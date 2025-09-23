/**
 * SQLite Database Helper for Kids Science Tutor
 * Handles all database operations for kids, sessions, conversations, and PDF metadata
 */

import Database from 'better-sqlite3';
import path from 'path';
import fs from 'fs';

// Database file path (relative to project root)
const DB_PATH = path.join(process.cwd(), '..', 'data', 'kids_tutor.db');

// Ensure data directory exists
const dataDir = path.dirname(DB_PATH);
if (!fs.existsSync(dataDir)) {
  fs.mkdirSync(dataDir, { recursive: true });
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

  // Completed Topics table - tracks what kids have finished
  db.exec(`
    CREATE TABLE IF NOT EXISTS completed_topics (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      kidId INTEGER NOT NULL,
      topic TEXT NOT NULL,
      subtopic TEXT,
      completedAt TEXT DEFAULT CURRENT_TIMESTAMP,
      totalSessions INTEGER DEFAULT 1,
      averageScore REAL DEFAULT 0,
      FOREIGN KEY (kidId) REFERENCES kids (id),
      UNIQUE(kidId, topic, subtopic)
    )
  `);

  // PDF Embeddings table - stores vector embeddings for RAG
  db.exec(`
    CREATE TABLE IF NOT EXISTS pdf_embeddings (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      pdf_id INTEGER,
      chunk_index INTEGER,
      content TEXT,
      embedding TEXT,
      FOREIGN KEY(pdf_id) REFERENCES pdf_metadata(id)
    )
  `);

  // Create index for efficient queries
  db.exec(`
    CREATE INDEX IF NOT EXISTS idx_pdf_embeddings_pdf_chunk 
    ON pdf_embeddings(pdf_id, chunk_index)
  `);

  // Create FTS table for text search (optional, for hybrid search)
  db.exec(`
    CREATE VIRTUAL TABLE IF NOT EXISTS pdf_embeddings_fts
    USING fts5(content, content='pdf_embeddings', content_rowid='id')
  `);

  // Populate PDF metadata if table is empty
  const metadataCount = db.prepare('SELECT COUNT(*) as count FROM pdf_metadata').get() as {count: number};
  if (metadataCount.count === 0) {
    populateInitialPDFMetadata();
  }
  
  console.log('✅ Database tables initialized successfully');
}

function populateInitialPDFMetadata(): void {
  console.log('📚 Populating initial PDF metadata...');
  
  const initialPDFs = [
    {
      filename: 'Easy_Planets_Saturn_Grade3_Sep_2025.pdf',
      title: 'Saturn - The Ringed Planet',
      topic: 'Planets',
      subtopic: 'Saturn',
      gradeLevel: 'Grade 3'
    },
    {
      filename: 'Easy_Constellations_Andromeda_Grade3_Sep_2025.pdf',
      title: 'Andromeda - The Princess Constellation', 
      topic: 'Constellations',
      subtopic: 'Andromeda',
      gradeLevel: 'Grade 3'
    },
    {
      filename: 'Easy_Rocks_Minerals_Grade3_Sep_2025.pdf',
      title: 'Rocks and Minerals Around Us',
      topic: 'Rocks and Minerals', 
      subtopic: 'Types',
      gradeLevel: 'Grade 3'
    },
    {
      filename: 'Easy_WaterCycle_Evaporation_Grade3_Sep_2025.pdf',
      title: 'The Amazing Water Cycle',
      topic: 'Water Cycle',
      subtopic: 'Evaporation',
      gradeLevel: 'Grade 3'
    },
    {
      filename: 'Easy_Volcanoes_Eruption_Grade3_Sep_2025.pdf',
      title: 'Volcanoes - Mountains of Fire',
      topic: 'Volcanoes',
      subtopic: 'Eruption',
      gradeLevel: 'Grade 3'
    }
  ];
  
  const stmt = db.prepare(`
    INSERT INTO pdf_metadata (filename, title, topic, subtopic, gradeLevel)
    VALUES (?, ?, ?, ?, ?)
  `);
  
  for (const pdf of initialPDFs) {
    stmt.run(pdf.filename, pdf.title, pdf.topic, pdf.subtopic, pdf.gradeLevel);
  }
  
  console.log(`✅ Added ${initialPDFs.length} PDF metadata records`);
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
  const stmt = db.prepare('SELECT * FROM kids WHERE name = ? AND pin = ?');
  const result = stmt.get(name, pin) as Kid | undefined;
  return result || null;
}

export function createKid(name: string, pin: string): Kid {
  const stmt = db.prepare('INSERT INTO kids (name, pin) VALUES (?, ?)');
  const result = stmt.run(name, pin);
  
  const newKid = db.prepare('SELECT * FROM kids WHERE id = ?').get(result.lastInsertRowid) as Kid;
  return newKid;
}

export function getKidById(kidId: number): Kid | null {
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
  try {
    const stmt = db.prepare('INSERT INTO sessions (kidId, pdfName, sessionNo) VALUES (?, ?, ?)');
    const result = stmt.run(kidId, pdfName, sessionNo);
    
    const newSession = db.prepare('SELECT * FROM sessions WHERE id = ?').get(result.lastInsertRowid) as Session;
    console.log(`✅ Created session ${result.lastInsertRowid} for kid ${kidId}, PDF: ${pdfName}`);
    return newSession;
  } catch (error) {
    console.error(`❌ Failed to create session for kid ${kidId}:`, error);
    throw error;
  }
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

export function getSessionById(sessionId: number): Session | null {
  const stmt = db.prepare(`
    SELECT * FROM sessions 
    WHERE id = ?
  `);
  
  const result = stmt.get(sessionId) as Session | undefined;
  return result || null;
}

export function getKidSessions(kidId: number): Session[] {
  const stmt = db.prepare('SELECT * FROM sessions WHERE kidId = ? ORDER BY completedAt DESC');
  return stmt.all(kidId) as Session[];
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
 * Completed Topics Management Functions
 */

export function markTopicCompleted(kidId: number, topic: string, subtopic: string | null, averageScore: number = 0): void {
  const stmt = db.prepare(`
    INSERT OR REPLACE INTO completed_topics (kidId, topic, subtopic, averageScore, totalSessions)
    VALUES (?, ?, ?, ?, 
      COALESCE((SELECT totalSessions + 1 FROM completed_topics WHERE kidId = ? AND topic = ? AND subtopic = ?), 1)
    )
  `);
  
  stmt.run(kidId, topic, subtopic ?? '', averageScore, kidId, topic, subtopic ?? '');
  console.log(`✅ Marked topic completed: ${topic} - ${subtopic} for kid ${kidId}`);
}

export function getCompletedTopics(kidId: number): Array<{topic: string, subtopic: string, completedAt: string, averageScore: number}> {
  const stmt = db.prepare(`
    SELECT topic, subtopic, completedAt, averageScore, totalSessions
    FROM completed_topics 
    WHERE kidId = ?
    ORDER BY completedAt DESC
  `);
  
  return stmt.all(kidId) as Array<{topic: string, subtopic: string, completedAt: string, averageScore: number}>;
}

export function isTopicCompleted(kidId: number, topic: string, subtopic?: string | null): boolean {
  const stmt = db.prepare(`
    SELECT COUNT(*) as count 
    FROM completed_topics 
    WHERE kidId = ? AND topic = ? AND subtopic = ?
  `);
  
  const result = stmt.get(kidId, topic, subtopic ?? '') as {count: number};
  return result.count > 0;
}

export function getAvailableTopics(kidId: number): Array<{topic: string, subtopic: string | null, filename: string}> {
  // Get all PDF metadata
  const allTopics = getAllPDFMetadata();
  
  // Filter out completed topics
  const availableTopics = allTopics.filter(pdf => {
    return !isTopicCompleted(kidId, pdf.topic, pdf.subtopic);
  });
  
  console.log(`📚 Available topics for kid ${kidId}: ${availableTopics.length}/${allTopics.length}`);
  return availableTopics;
}

// Initialize database on import
initializeDatabase();

// Export database instance for advanced queries if needed
export { db };
