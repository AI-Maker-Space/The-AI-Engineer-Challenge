/**
 * In-Memory Database for Kids Science Tutor
 * Handles all database operations for kids, sessions, conversations, and PDF metadata
 */

// Types
export interface Kid {
  id: number;
  name: string;
  pin: string;
  createdAt: string;
}

export interface Session {
  id: number;
  kidId: number;
  pdfName: string;
  sessionNo: number;
  completedAt?: string;
  quizScore?: number;
  readingTimeSeconds?: number;
}

export interface Conversation {
  id: number;
  kidId: number;
  sessionId?: number;
  role: 'user' | 'assistant' | 'system';
  text: string;
  timestamp: string;
  type?: string;
}

export interface PDFMetadata {
  id: number;
  filename: string;
  title: string;
  topic: string;
  subtopic: string;
  grade: string;
  subject: string;
  difficulty: string;
  estimatedReadingTime: number;
  createdAt: string;
}

export interface QuizQuestion {
  id: number;
  kidId: number;
  pdfName: string;
  question: string;
  correctAnswer: string;
  sessionId: number;
  createdAt: string;
}

export interface PDFEmbedding {
  id: number;
  pdf_id: number;
  chunk_index: number;
  content: string;
  embedding: number[];
}

export interface CompletedTopic {
  id: number;
  kidId: number;
  topic: string;
  subtopic: string;
  score: number;
  completedAt: string;
}

// In-memory data storage
let nextId = 1;
const data = {
  kids: [
    { id: 1, name: 'Demo Kid', pin: '1234', createdAt: new Date().toISOString() }
  ] as Kid[],
  sessions: [] as Session[],
  conversations: [] as Conversation[],
  pdf_metadata: [] as PDFMetadata[],
  pdf_embeddings: [] as PDFEmbedding[],
  completed_topics: [] as CompletedTopic[],
  quiz_questions: [] as QuizQuestion[]
};

// Helper functions
function generateId(): number {
  return nextId++;
}

// Kid Management Functions
export function getKidById(kidId: number): Kid | null {
  console.log(`[getKidById] kidId=${kidId}, data.kids length:`, data.kids.length);
  console.log(`[getKidById] data.kids:`, data.kids);
  const kid = data.kids.find(k => k.id === kidId);
  console.log(`[getKidById] returning:`, kid);
  return kid || null;
}

export function getKidByNameAndPin(name: string, pin: string): Kid | null {
  console.log(`[getKidByNameAndPin] name=${name}, pin=${pin}`);
  const kid = data.kids.find(k => k.name === name && k.pin === pin);
  console.log(`[getKidByNameAndPin] returning:`, kid);
  return kid || null;
}

export function createKid(name: string, pin: string): Kid {
  console.log(`[createKid] name=${name}, pin=${pin}`);
  // Single-kid mode: always return the singleton
  const kid = data.kids[0];
  console.log(`[createKid] returning singleton:`, kid);
  return kid;
}

// Session Management Functions
export function createSession(kidId: number, pdfName: string, sessionNo: number): Session {
  const session: Session = {
    id: generateId(),
    kidId,
    pdfName,
    sessionNo,
    completedAt: new Date().toISOString()
  };
  data.sessions.push(session);
  console.log(`[createSession] created session:`, session);
  return session;
}

export function getLastSession(kidId: number, pdfName: string): Session | null {
  const sessions = data.sessions
    .filter(s => s.kidId === kidId && s.pdfName === pdfName)
    .sort((a, b) => b.sessionNo - a.sessionNo);
  return sessions[0] || null;
}

export function getSessionById(sessionId: number): Session | null {
  return data.sessions.find(s => s.id === sessionId) || null;
}

export function saveQuizScore(sessionId: number, score: number): void {
  const session = data.sessions.find(s => s.id === sessionId);
  if (session) {
    session.quizScore = score;
  }
}

export function updateReadingTime(sessionId: number, readingTime: number): void {
  const session = data.sessions.find(s => s.id === sessionId);
  if (session) {
    session.readingTimeSeconds = readingTime;
  }
}

// Conversation Functions
export function logConversation(
  kidId: number,
  role: 'user' | 'assistant' | 'system',
  text: string,
  type?: string,
  sessionId?: number
): Conversation {
  const conversation: Conversation = {
    id: generateId(),
    kidId,
    sessionId,
    role,
    text,
    timestamp: new Date().toISOString(),
    type
  };
  data.conversations.push(conversation);
  return conversation;
}

export function getConversationsForKid(kidId: number): Conversation[] {
  return data.conversations.filter(c => c.kidId === kidId);
}

// PDF Metadata Functions
export function insertPDFMetadata(metadata: Omit<PDFMetadata, 'id' | 'createdAt'>): PDFMetadata {
  const pdfMetadata: PDFMetadata = {
    ...metadata,
    id: generateId(),
    createdAt: new Date().toISOString()
  };
  data.pdf_metadata.push(pdfMetadata);
  return pdfMetadata;
}

export function getAllPDFMetadata(): PDFMetadata[] {
  return data.pdf_metadata;
}

export function getPDFMetadataByFilename(filename: string): PDFMetadata | null {
  return data.pdf_metadata.find(pdf => pdf.filename === filename) || null;
}

// Quiz Functions
export function saveQuizQuestion(
  kidId: number,
  pdfName: string,
  question: string,
  correctAnswer: string,
  sessionId: number
): QuizQuestion {
  const quizQuestion: QuizQuestion = {
    id: generateId(),
    kidId,
    pdfName,
    question,
    correctAnswer,
    sessionId,
    createdAt: new Date().toISOString()
  };
  data.quiz_questions.push(quizQuestion);
  return quizQuestion;
}

export function getKidQuizHistory(kidId: number): QuizQuestion[] {
  return data.quiz_questions.filter(q => q.kidId === kidId);
}

// Topic Management Functions
export function getAvailableTopics(kidId: number): PDFMetadata[] {
  // Get all PDFs that haven't been completed by this kid
  const completedTopics = data.completed_topics
    .filter(ct => ct.kidId === kidId)
    .map(ct => `${ct.topic}-${ct.subtopic}`);
  
  return data.pdf_metadata.filter(pdf => 
    !completedTopics.includes(`${pdf.topic}-${pdf.subtopic}`)
  );
}

export function markTopicCompleted(
  kidId: number,
  topic: string,
  subtopic: string,
  score: number
): void {
  const completedTopic: CompletedTopic = {
    id: generateId(),
    kidId,
    topic,
    subtopic,
    score,
    completedAt: new Date().toISOString()
  };
  data.completed_topics.push(completedTopic);
}

// Database Stats
export function getDatabaseStats(): { 
  totalKids: number; 
  totalSessions: number; 
  totalConversations: number; 
  totalQuizQuestions: number;
} {
  return {
    totalKids: data.kids.length,
    totalSessions: data.sessions.length,
    totalConversations: data.conversations.length,
    totalQuizQuestions: data.quiz_questions.length
  };
}

// Embedding Functions
export function storeEmbedding(pdfId: number, chunkIndex: number, content: string, embedding: number[]): void {
  const pdfEmbedding: PDFEmbedding = {
    id: generateId(),
    pdf_id: pdfId,
    chunk_index: chunkIndex,
    content,
    embedding
  };
  data.pdf_embeddings.push(pdfEmbedding);
}

export function searchEmbeddings(queryEmbedding: number[], topK: number = 3): PDFEmbedding[] {
  // Simple cosine similarity search
  const similarities = data.pdf_embeddings.map(emb => {
    const similarity = cosineSimilarity(queryEmbedding, emb.embedding);
    return { embedding: emb, similarity };
  });
  
  return similarities
    .sort((a, b) => b.similarity - a.similarity)
    .slice(0, topK)
    .map(item => item.embedding);
}

function cosineSimilarity(a: number[], b: number[]): number {
  const dotProduct = a.reduce((sum, val, i) => sum + val * b[i], 0);
  const magnitudeA = Math.sqrt(a.reduce((sum, val) => sum + val * val, 0));
  const magnitudeB = Math.sqrt(b.reduce((sum, val) => sum + val * val, 0));
  
  if (magnitudeA === 0 || magnitudeB === 0) return 0;
  return dotProduct / (magnitudeA * magnitudeB);
}

// Database Initialization
export function initializeDatabase(): void {
  console.log('🔄 Initializing in-memory database...');
  
  // Populate with sample PDF metadata if empty
  if (data.pdf_metadata.length === 0) {
    populateInitialPDFMetadata();
  }
  
  console.log('✅ Database initialized');
}

function populateInitialPDFMetadata(): void {
  const samplePDFs: Omit<PDFMetadata, 'id' | 'createdAt'>[] = [
    {
      filename: 'saturn.pdf',
      title: 'Saturn: The Ringed Planet',
      topic: 'Planets',
      subtopic: 'Saturn',
      grade: '3',
      subject: 'Science',
      difficulty: 'Easy',
      estimatedReadingTime: 5
    },
    {
      filename: 'constellations.pdf',
      title: 'Constellations in the Night Sky',
      topic: 'Constellations',
      subtopic: 'Andromeda',
      grade: '3',
      subject: 'Science',
      difficulty: 'Easy',
      estimatedReadingTime: 4
    },
    {
      filename: 'bees.pdf',
      title: 'Bees and Pollination',
      topic: 'Ecosystems',
      subtopic: 'Pollination',
      grade: '3',
      subject: 'Science',
      difficulty: 'Medium',
      estimatedReadingTime: 6
    },
    {
      filename: 'weather.pdf',
      title: 'Weather Patterns',
      topic: 'Weather',
      subtopic: 'Clouds',
      grade: '3',
      subject: 'Science',
      difficulty: 'Medium',
      estimatedReadingTime: 5
    },
    {
      filename: 'plants.pdf',
      title: 'How Plants Grow',
      topic: 'Biology',
      subtopic: 'Plant Life Cycle',
      grade: '3',
      subject: 'Science',
      difficulty: 'Easy',
      estimatedReadingTime: 4
    }
  ];
  
  samplePDFs.forEach(pdf => {
    insertPDFMetadata(pdf);
  });
  
  console.log('✅ Added 5 sample PDF metadata records');
}

// Legacy functions for compatibility
export function getEmbeddingsCount(): number {
  return data.pdf_embeddings.length;
}

export function clearEmbeddings(): void {
  data.pdf_embeddings.length = 0;
}

export function getKidProgress(kidId: number): any {
  const sessions = data.sessions.filter(s => s.kidId === kidId);
  const completedTopics = data.completed_topics.filter(ct => ct.kidId === kidId);
  
  return {
    totalSessions: sessions.length,
    completedTopics: completedTopics.length,
    averageScore: sessions.length > 0 
      ? sessions.reduce((sum, s) => sum + (s.quizScore || 0), 0) / sessions.length 
      : 0
  };
}

export function updateQuizAnswer(questionId: number, answer: string, isCorrect: boolean): void {
  // This would update a quiz question record if we had one
  console.log(`[updateQuizAnswer] questionId=${questionId}, answer=${answer}, isCorrect=${isCorrect}`);
}