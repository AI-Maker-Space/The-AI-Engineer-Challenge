/**
 * SQLite Database Helper for Kids Science Tutor
 * Handles all database operations for kids, sessions, conversations, and PDF metadata
 */

import Database from 'better-sqlite3';
import path from 'path';
import fs from 'fs';

// Database file path - use in-memory database on Vercel
const DB_PATH = process.env.NODE_ENV === 'production' 
  ? ':memory:' 
  : path.join(process.cwd(), 'kids_tutor.db');

// Ensure data directory exists (only in development)
if (process.env.NODE_ENV !== 'production') {
  const dataDir = path.dirname(DB_PATH);
  if (!fs.existsSync(dataDir)) {
    fs.mkdirSync(dataDir, { recursive: true });
  }
}

// Initialize database connection
const db = new Database(DB_PATH);

// Enable foreign keys
db.pragma('foreign_keys = ON');

/**
 * Initialize database tables
 */
export function initializeDatabase() {
  // Kids table - stores child login information
  db.exec(`
    CREATE TABLE IF NOT EXISTS kids (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT NOT NULL,
      pin TEXT NOT NULL,
      createdAt TEXT DEFAULT CURRENT_TIMESTAMP,
      UNIQUE(name, pin)
    )
  `);

  // Sessions table - tracks reading sessions and quiz scores
  db.exec(`
    CREATE TABLE IF NOT EXISTS sessions (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      kidId INTEGER NOT NULL,
      pdfName TEXT NOT NULL,
      sessionNo INTEGER NOT NULL DEFAULT 1,
      completedAt TEXT DEFAULT CURRENT_TIMESTAMP,
      quizScore INTEGER,
      readingTimeSeconds INTEGER,
      FOREIGN KEY (kidId) REFERENCES kids (id)
    )
  `);

  // Conversations table - logs all chat interactions
  db.exec(`
    CREATE TABLE IF NOT EXISTS conversations (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      kidId INTEGER NOT NULL,
      sessionId INTEGER,
      role TEXT NOT NULL CHECK (role IN ('user', 'assistant', 'system')),
      message TEXT NOT NULL,
      messageType TEXT DEFAULT 'chat' CHECK (messageType IN ('chat', 'quiz_question', 'quiz_answer', 'system_message')),
      createdAt TEXT DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (kidId) REFERENCES kids (id),
      FOREIGN KEY (sessionId) REFERENCES sessions (id)
    )
  `);

  // PDF Metadata table - tracks information about educational PDFs
  db.exec(`
    CREATE TABLE IF NOT EXISTS pdf_metadata (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      filename TEXT NOT NULL UNIQUE,
      title TEXT NOT NULL,
      topic TEXT NOT NULL,
      subtopic TEXT,
      gradeLevel TEXT DEFAULT 'Grade 3',
      sourceReferences TEXT, -- JSON array of source URLs
      modelUsed TEXT,
      contentApproach TEXT,
      createdAt TEXT DEFAULT CURRENT_TIMESTAMP,
      totalLines INTEGER,
      fileSize INTEGER
    )
  `);

  // Quiz Questions History table - tracks questions asked to prevent repetition
  db.exec(`
    CREATE TABLE IF NOT EXISTS quiz_questions (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      kidId INTEGER NOT NULL,
      pdfName TEXT NOT NULL,
      question TEXT NOT NULL,
      correctAnswer TEXT,
      kidAnswer TEXT,
      isCorrect BOOLEAN,
      sessionId INTEGER,
      askedAt TEXT DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (kidId) REFERENCES kids (id),
      FOREIGN KEY (sessionId) REFERENCES sessions (id)
    )
  `);

  // PDF Embeddings table - stores vector embeddings for RAG retrieval
  db.exec(`
    CREATE TABLE IF NOT EXISTS pdf_embeddings (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      pdf_id INTEGER NOT NULL,
      chunk_index INTEGER NOT NULL,
      content TEXT NOT NULL,
      embedding TEXT NOT NULL, -- JSON array of floats
      metadata TEXT, -- JSON object with additional chunk metadata
      createdAt TEXT DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (pdf_id) REFERENCES pdf_metadata (id)
    )
  `);

  // Clear existing embeddings table due to schema change (pdf_id is now INTEGER)
  try {
    db.exec(`DROP TABLE IF EXISTS pdf_embeddings`);
    db.exec(`DROP TABLE IF EXISTS pdf_embeddings_fts`);
    console.log('🧹 Dropped old pdf_embeddings tables due to schema change');
    
    // Recreate with new schema
    db.exec(`
      CREATE TABLE pdf_embeddings (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        pdf_id INTEGER NOT NULL,
        chunk_index INTEGER NOT NULL,
        content TEXT NOT NULL,
        embedding TEXT NOT NULL, -- JSON array of floats
        metadata TEXT, -- JSON object with additional chunk metadata
        createdAt TEXT DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (pdf_id) REFERENCES pdf_metadata (id)
      )
    `);
    
    // Recreate index
    db.exec(`
      CREATE INDEX idx_pdf_embeddings_pdf_chunk 
      ON pdf_embeddings (pdf_id, chunk_index)
    `);
    
    // Recreate FTS table
    db.exec(`
      CREATE VIRTUAL TABLE pdf_embeddings_fts USING fts5(
        content, 
        pdf_id UNINDEXED,
        content_rowid UNINDEXED
      )
    `);
    
    console.log('✅ Recreated pdf_embeddings tables with new schema');
  } catch (error: any) {
    console.warn('Warning during schema migration:', error.message);
  }


  console.log('✅ Database tables initialized successfully');
}

/**
 * Kid Management Functions
 */

export interface Kid {
  id: number;
  name: string;
  pin: string;
  createdAt: string;
}

export function getKidByNameAndPin(name: string, pin: string): Kid | null {
  ensureDatabasePopulated();
  const stmt = db.prepare('SELECT * FROM kids WHERE name = ? AND pin = ?');
  const result = stmt.get(name, pin) as Kid | undefined;
  return result || null;
}

export function createKid(name: string, pin: string): Kid {
  ensureDatabasePopulated();
  const stmt = db.prepare('INSERT INTO kids (name, pin) VALUES (?, ?)');
  const result = stmt.run(name, pin);
  
  const newKid = db.prepare('SELECT * FROM kids WHERE id = ?').get(result.lastInsertRowid) as Kid;
  return newKid;
}

export function getKidById(kidId: number): Kid | null {
  ensureDatabasePopulated();
  const stmt = db.prepare('SELECT * FROM kids WHERE id = ?');
  const result = stmt.get(kidId) as Kid | undefined;
  return result || null;
}

/**
 * Session Management Functions
 */

export interface Session {
  id: number;
  kidId: number;
  pdfName: string;
  sessionNo: number;
  completedAt: string;
  quizScore: number | null;
  readingTimeSeconds: number | null;
}

export function createSession(kidId: number, pdfName: string, sessionNo: number = 1): Session {
  const stmt = db.prepare('INSERT INTO sessions (kidId, pdfName, sessionNo) VALUES (?, ?, ?)');
  const result = stmt.run(kidId, pdfName, sessionNo);
  
  const newSession = db.prepare('SELECT * FROM sessions WHERE id = ?').get(result.lastInsertRowid) as Session;
  return newSession;
}

export function saveQuizScore(sessionId: number, score: number): void {
  const stmt = db.prepare('UPDATE sessions SET quizScore = ? WHERE id = ?');
  stmt.run(score, sessionId);
}

export function updateReadingTime(sessionId: number, seconds: number): void {
  const stmt = db.prepare('UPDATE sessions SET readingTimeSeconds = ? WHERE id = ?');
  stmt.run(seconds, sessionId);
}

export function getLastSession(kidId: number, pdfName: string): Session | null {
  const stmt = db.prepare(`
    SELECT * FROM sessions 
    WHERE kidId = ? AND pdfName = ? 
    ORDER BY completedAt DESC 
    LIMIT 1
  `);
  const result = stmt.get(kidId, pdfName) as Session | undefined;
  return result || null;
}

export function getKidSessions(kidId: number): Session[] {
  const stmt = db.prepare('SELECT * FROM sessions WHERE kidId = ? ORDER BY completedAt DESC');
  return stmt.all(kidId) as Session[];
}

export function getSessionById(sessionId: number): Session | null {
  const stmt = db.prepare('SELECT * FROM sessions WHERE id = ?');
  const result = stmt.get(sessionId) as Session | undefined;
  return result || null;
}

/**
 * Conversation Logging Functions
 */

export interface Conversation {
  id: number;
  kidId: number;
  sessionId: number | null;
  role: 'user' | 'assistant' | 'system';
  message: string;
  messageType: 'chat' | 'quiz_question' | 'quiz_answer' | 'system_message';
  createdAt: string;
}

export function logConversation(
  kidId: number, 
  role: 'user' | 'assistant' | 'system', 
  message: string,
  messageType: 'chat' | 'quiz_question' | 'quiz_answer' | 'system_message' = 'chat',
  sessionId?: number
): Conversation {
  const stmt = db.prepare(`
    INSERT INTO conversations (kidId, sessionId, role, message, messageType) 
    VALUES (?, ?, ?, ?, ?)
  `);
  const result = stmt.run(kidId, sessionId || null, role, message, messageType);
  
  const newConversation = db.prepare('SELECT * FROM conversations WHERE id = ?')
    .get(result.lastInsertRowid) as Conversation;
  return newConversation;
}

export function getKidConversations(kidId: number, limit: number = 50): Conversation[] {
  const stmt = db.prepare(`
    SELECT * FROM conversations 
    WHERE kidId = ? 
    ORDER BY createdAt DESC 
    LIMIT ?
  `);
  return stmt.all(kidId, limit) as Conversation[];
}

export function getSessionConversations(sessionId: number): Conversation[] {
  const stmt = db.prepare(`
    SELECT * FROM conversations 
    WHERE sessionId = ? 
    ORDER BY createdAt ASC
  `);
  return stmt.all(sessionId) as Conversation[];
}

/**
 * PDF Metadata Functions
 */

export interface PDFMetadata {
  id: number;
  filename: string;
  title: string;
  topic: string;
  subtopic: string | null;
  gradeLevel: string;
  sourceReferences: string; // JSON string
  modelUsed: string | null;
  contentApproach: string | null;
  createdAt: string;
  totalLines: number | null;
  fileSize: number | null;
}

export function savePDFMetadata(metadata: Omit<PDFMetadata, 'id' | 'createdAt'>): PDFMetadata {
  const stmt = db.prepare(`
    INSERT INTO pdf_metadata 
    (filename, title, topic, subtopic, gradeLevel, sourceReferences, modelUsed, contentApproach, totalLines, fileSize)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
  `);
  
  const result = stmt.run(
    metadata.filename,
    metadata.title,
    metadata.topic,
    metadata.subtopic,
    metadata.gradeLevel,
    metadata.sourceReferences,
    metadata.modelUsed,
    metadata.contentApproach,
    metadata.totalLines,
    metadata.fileSize
  );
  
  const newMetadata = db.prepare('SELECT * FROM pdf_metadata WHERE id = ?')
    .get(result.lastInsertRowid) as PDFMetadata;
  return newMetadata;
}

export function getPDFMetadata(filename: string): PDFMetadata | null {
  const stmt = db.prepare('SELECT * FROM pdf_metadata WHERE filename = ?');
  const result = stmt.get(filename) as PDFMetadata | undefined;
  return result || null;
}

export function getAllPDFMetadata(): PDFMetadata[] {
  const stmt = db.prepare('SELECT * FROM pdf_metadata ORDER BY createdAt DESC');
  return stmt.all() as PDFMetadata[];
}

export function insertPDFMetadata(metadata: Omit<PDFMetadata, 'id' | 'createdAt'>): PDFMetadata {
  const stmt = db.prepare(`
    INSERT OR REPLACE INTO pdf_metadata 
    (filename, title, topic, subtopic, gradeLevel, sourceReferences, modelUsed, contentApproach, totalLines, fileSize)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
  `);
  
  const result = stmt.run(
    metadata.filename,
    metadata.title,
    metadata.topic,
    metadata.subtopic,
    metadata.gradeLevel,
    metadata.sourceReferences,
    metadata.modelUsed,
    metadata.contentApproach,
    metadata.totalLines,
    metadata.fileSize
  );
  
  return db.prepare('SELECT * FROM pdf_metadata WHERE id = ?')
    .get(result.lastInsertRowid) as PDFMetadata;
}

/**
 * Quiz Question Functions
 */

export interface QuizQuestion {
  id: number;
  kidId: number;
  pdfName: string;
  question: string;
  correctAnswer: string | null;
  kidAnswer: string | null;
  isCorrect: boolean | null;
  sessionId: number | null;
  askedAt: string;
}

export function saveQuizQuestion(
  kidId: number,
  pdfName: string,
  question: string,
  correctAnswer?: string,
  sessionId?: number
): QuizQuestion {
  const stmt = db.prepare(`
    INSERT INTO quiz_questions (kidId, pdfName, question, correctAnswer, sessionId)
    VALUES (?, ?, ?, ?, ?)
  `);
  
  const result = stmt.run(kidId, pdfName, question, correctAnswer || null, sessionId || null);
  
  const newQuestion = db.prepare('SELECT * FROM quiz_questions WHERE id = ?')
    .get(result.lastInsertRowid) as QuizQuestion;
  return newQuestion;
}

export function updateQuizAnswer(questionId: number, kidAnswer: string, isCorrect: boolean): void {
  const stmt = db.prepare('UPDATE quiz_questions SET kidAnswer = ?, isCorrect = ? WHERE id = ?');
  stmt.run(kidAnswer, isCorrect, questionId);
}

export function getKidQuizHistory(kidId: number, pdfName: string): QuizQuestion[] {
  const stmt = db.prepare(`
    SELECT * FROM quiz_questions 
    WHERE kidId = ? AND pdfName = ? 
    ORDER BY askedAt DESC
  `);
  return stmt.all(kidId, pdfName) as QuizQuestion[];
}

/**
 * Completed Topics Functions
 */

export interface CompletedTopic {
  id: number;
  kidId: number;
  topic: string;
  subtopic: string;
  score: number;
  completedAt: string;
}

// Add completed_topics table
db.exec(`
  CREATE TABLE IF NOT EXISTS completed_topics (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    kidId INTEGER NOT NULL,
    topic TEXT NOT NULL,
    subtopic TEXT NOT NULL,
    score INTEGER NOT NULL,
    completedAt TEXT DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (kidId) REFERENCES kids (id),
    UNIQUE(kidId, topic, subtopic)
  )
`);

export function markTopicCompleted(kidId: number, topic: string, subtopic: string, score: number): void {
  const stmt = db.prepare(`
    INSERT OR REPLACE INTO completed_topics (kidId, topic, subtopic, score) 
    VALUES (?, ?, ?, ?)
  `);
  stmt.run(kidId, topic, subtopic, score);
}

export function getCompletedTopics(kidId: number): CompletedTopic[] {
  const stmt = db.prepare('SELECT * FROM completed_topics WHERE kidId = ? ORDER BY completedAt DESC');
  return stmt.all(kidId) as CompletedTopic[];
}

export function isTopicCompleted(kidId: number, topic: string, subtopic: string): boolean {
  const stmt = db.prepare('SELECT id FROM completed_topics WHERE kidId = ? AND topic = ? AND subtopic = ?');
  return !!stmt.get(kidId, topic, subtopic);
}

// Ensure database is populated with initial data (important for Vercel cold starts)
function ensureDatabasePopulated(): void {
  // Check if we have any PDF metadata
  const metadataCount = db.prepare('SELECT COUNT(*) as count FROM pdf_metadata').get() as {count: number};
  
  if (metadataCount.count === 0) {
    console.log('🔄 Database empty, populating initial data...');
    populateInitialPDFMetadata();
  }
}

export function getAvailableTopics(kidId: number): PDFMetadata[] {
  // Ensure database is initialized and populated
  ensureDatabasePopulated();
  
  // Get all PDF metadata
  const allPDFs = getAllPDFMetadata();
  
  // Filter out completed topics
  return allPDFs.filter(pdf => {
    return !isTopicCompleted(kidId, pdf.topic, pdf.subtopic || '');
  });
}

export function populateInitialPDFMetadata(): void {
  // This function can be used to populate initial PDF metadata if needed
  const pdfs = [
    {
      filename: "Easy_Planets_Saturn_Grade3_Sep_2025.pdf",
      title: "Saturn - The Ringed Planet",
      topic: "Planets",
      subtopic: "Saturn",
      gradeLevel: "Grade 3",
      sourceReferences: JSON.stringify(["NASA Kids", "Educational content"]),
      modelUsed: "GPT-4",
      contentApproach: "Kid-friendly",
      totalLines: 90,
      fileSize: null
    }
  ];

  pdfs.forEach(pdf => {
    try {
      insertPDFMetadata(pdf);
    } catch (error) {
      // Ignore if already exists
    }
  });
}

/**
 * Analytics and Reporting Functions
 */

export interface KidProgress {
  kidId: number;
  kidName: string;
  totalSessions: number;
  averageQuizScore: number;
  pdfsRead: string[];
  wordsLearned: number;
  lastActiveDate: string;
}

export function getKidProgress(kidId: number): KidProgress | null {
  const kid = getKidById(kidId);
  if (!kid) return null;

  const sessions = getKidSessions(kidId);
  const pdfsRead = [...new Set(sessions.map(s => s.pdfName))];
  
  const avgScore = sessions.length > 0 
    ? sessions.filter(s => s.quizScore !== null).reduce((sum, s) => sum + (s.quizScore || 0), 0) / sessions.filter(s => s.quizScore !== null).length
    : 0;

  const correctAnswers = db.prepare(`
    SELECT COUNT(*) as count FROM quiz_questions 
    WHERE kidId = ? AND isCorrect = 1
  `).get(kidId) as { count: number };

  return {
    kidId: kid.id,
    kidName: kid.name,
    totalSessions: sessions.length,
    averageQuizScore: Math.round(avgScore * 100) / 100,
    pdfsRead,
    wordsLearned: correctAnswers.count * 5, // Estimate 5 words per correct answer
    lastActiveDate: sessions.length > 0 ? sessions[0].completedAt : kid.createdAt
  };
}

/**
 * Database Cleanup and Maintenance
 */

export function closeDatabase(): void {
  db.close();
}

export function getDatabaseStats(): { 
  totalKids: number; 
  totalSessions: number; 
  totalConversations: number; 
  totalQuizQuestions: number;
} {
  const kids = db.prepare('SELECT COUNT(*) as count FROM kids').get() as { count: number };
  const sessions = db.prepare('SELECT COUNT(*) as count FROM sessions').get() as { count: number };
  const conversations = db.prepare('SELECT COUNT(*) as count FROM conversations').get() as { count: number };
  const questions = db.prepare('SELECT COUNT(*) as count FROM quiz_questions').get() as { count: number };

  return {
    totalKids: kids.count,
    totalSessions: sessions.count,
    totalConversations: conversations.count,
    totalQuizQuestions: questions.count
  };
}

/**
 * PDF Embeddings Functions
 */

export interface PDFEmbedding {
  id: number;
  pdf_id: string;
  chunk_index: number;
  content: string;
  embedding: string; // JSON array
  metadata: string | null; // JSON object
  createdAt: string;
}

export function storeEmbedding(
  pdf_id: number, 
  chunk_index: number, 
  content: string, 
  embedding: number[], 
  metadata?: any
): PDFEmbedding {
  console.log(`🔍 storeEmbedding called with pdf_id: ${pdf_id}, chunk_index: ${chunk_index}`);
  
  const stmt = db.prepare(`
    INSERT INTO pdf_embeddings (pdf_id, chunk_index, content, embedding, metadata)
    VALUES (?, ?, ?, ?, ?)
  `);
  
  const result = stmt.run(
    pdf_id,
    chunk_index,
    content,
    JSON.stringify(embedding),
    metadata ? JSON.stringify(metadata) : null
  );
  
  // Also insert into FTS table for text search
  const ftsStmt = db.prepare(`
    INSERT INTO pdf_embeddings_fts (content, pdf_id, content_rowid)
    VALUES (?, ?, ?)
  `);
  ftsStmt.run(content, pdf_id, result.lastInsertRowid);
  
  return db.prepare('SELECT * FROM pdf_embeddings WHERE id = ?')
    .get(result.lastInsertRowid) as PDFEmbedding;
}

export function searchEmbeddings(
  query_embedding: number[], 
  limit: number = 5,
  pdf_id?: string
): Array<{content: string, pdf_id: string, similarity: number, metadata?: any}> {
  // Get all embeddings (optionally filtered by pdf_id)
  let sql = 'SELECT pdf_id, content, embedding, metadata FROM pdf_embeddings';
  let params: any[] = [];
  
  if (pdf_id) {
    sql += ' WHERE pdf_id = ?';
    params.push(pdf_id);
  }
  
  const stmt = db.prepare(sql);
  const embeddings = stmt.all(...params) as Array<{
    pdf_id: string;
    content: string;
    embedding: string;
    metadata: string | null;
  }>;
  
  // Calculate cosine similarity for each embedding
  const results = embeddings.map(row => {
    const stored_embedding = JSON.parse(row.embedding);
    const similarity = cosineSimilarity(query_embedding, stored_embedding);
    
    return {
      content: row.content,
      pdf_id: row.pdf_id,
      similarity,
      metadata: row.metadata ? JSON.parse(row.metadata) : undefined
    };
  });
  
  // Sort by similarity (highest first) and return top results
  return results
    .sort((a, b) => b.similarity - a.similarity)
    .slice(0, limit);
}

export function getEmbeddingsByPdfId(pdf_id: string): PDFEmbedding[] {
  const stmt = db.prepare(`
    SELECT * FROM pdf_embeddings 
    WHERE pdf_id = ? 
    ORDER BY chunk_index ASC
  `);
  return stmt.all(pdf_id) as PDFEmbedding[];
}

export function clearEmbeddings(pdf_id?: string): void {
  if (pdf_id) {
    // Clear specific PDF embeddings
    db.prepare('DELETE FROM pdf_embeddings WHERE pdf_id = ?').run(pdf_id);
    db.prepare('DELETE FROM pdf_embeddings_fts WHERE pdf_id = ?').run(pdf_id);
  } else {
    // Clear all embeddings
    db.prepare('DELETE FROM pdf_embeddings').run();
    db.prepare('DELETE FROM pdf_embeddings_fts').run();
  }
}

export function clearAllData(): void {
  console.log('🧹 Clearing all data...');
  // Clear in order to respect foreign keys
  db.prepare('DELETE FROM pdf_embeddings_fts').run();
  db.prepare('DELETE FROM pdf_embeddings').run();
  db.prepare('DELETE FROM quiz_questions').run();
  db.prepare('DELETE FROM conversations').run();
  db.prepare('DELETE FROM completed_topics').run();
  db.prepare('DELETE FROM sessions').run();
  db.prepare('DELETE FROM pdf_metadata').run();
  db.prepare('DELETE FROM kids').run();
  console.log('✅ All data cleared');
}

export function getEmbeddingsCount(): number {
  const result = db.prepare('SELECT COUNT(*) as count FROM pdf_embeddings').get() as { count: number };
  return result.count;
}

// Helper function for cosine similarity calculation
function cosineSimilarity(a: number[], b: number[]): number {
  if (a.length !== b.length) return 0;
  
  let dotProduct = 0;
  let normA = 0;
  let normB = 0;
  
  for (let i = 0; i < a.length; i++) {
    dotProduct += a[i] * b[i];
    normA += a[i] * a[i];
    normB += b[i] * b[i];
  }
  
  if (normA === 0 || normB === 0) return 0;
  
  return dotProduct / (Math.sqrt(normA) * Math.sqrt(normB));
}

// Initialize database on import
initializeDatabase();

// Export database instance for advanced queries if needed
export { db };
