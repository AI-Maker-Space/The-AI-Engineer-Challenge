import { Message } from '@/types';

export interface StudySession {
  id: string;
  timestamp: Date;
  section: string; // penal code section
  messages: Message[];
}

export interface StudyStats {
  totalQuestions: number;
  sectionsStudied: string[];
  lastStudyTime: Date;
}

const STORAGE_KEY = 'penal-code-study-sessions';
const STATS_KEY = 'penal-code-study-stats';

export class StudyStorageService {
  private static instance: StudyStorageService;

  private constructor() {}

  static getInstance(): StudyStorageService {
    if (!StudyStorageService.instance) {
      StudyStorageService.instance = new StudyStorageService();
    }
    return StudyStorageService.instance;
  }

  private getStorage(): StudySession[] {
    if (typeof window === 'undefined') return [];
    const stored = localStorage.getItem(STORAGE_KEY);
    return stored ? JSON.parse(stored) : [];
  }

  private getStats(): StudyStats {
    if (typeof window === 'undefined') return {
      totalQuestions: 0,
      sectionsStudied: [],
      lastStudyTime: new Date()
    };
    const stored = localStorage.getItem(STATS_KEY);
    return stored ? JSON.parse(stored) : {
      totalQuestions: 0,
      sectionsStudied: [],
      lastStudyTime: new Date()
    };
  }

  saveSession(section: string, messages: Message[]): void {
    const sessions = this.getStorage();
    const newSession: StudySession = {
      id: Date.now().toString(),
      timestamp: new Date(),
      section,
      messages
    };
    sessions.push(newSession);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(sessions));

    // Update stats
    const stats = this.getStats();
    stats.totalQuestions++;
    if (!stats.sectionsStudied.includes(section)) {
      stats.sectionsStudied.push(section);
    }
    stats.lastStudyTime = new Date();
    localStorage.setItem(STATS_KEY, JSON.stringify(stats));
  }

  getSessions(): StudySession[] {
    return this.getStorage();
  }

  getSessionsBySection(section: string): StudySession[] {
    const sessions = this.getStorage();
    return sessions.filter(s => s.section === section);
  }

  getStudyStats(): StudyStats {
    return this.getStats();
  }

  clearAllData(): void {
    localStorage.removeItem(STORAGE_KEY);
    localStorage.removeItem(STATS_KEY);
  }

  deleteSession(sessionId: string): void {
    const sessions = this.getStorage();
    const filteredSessions = sessions.filter(s => s.id !== sessionId);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(filteredSessions));
  }

  searchSessions(query: string): StudySession[] {
    const sessions = this.getStorage();
    const lowerQuery = query.toLowerCase();
    return sessions.filter(session => 
      session.section.toLowerCase().includes(lowerQuery) ||
      session.messages.some(msg => 
        msg.content.toLowerCase().includes(lowerQuery)
      )
    );
  }
}
