import { NextRequest, NextResponse } from 'next/server';
import { 
  getKidById, 
  getKidSessions, 
  getKidQuizHistory 
} from '../../../../../lib/db';

/**
 * Kid Progress Report API Endpoint
 * GET /api/reports/[kidId]
 * 
 * Returns comprehensive progress data for parent report:
 * - Kid information
 * - Session history with scores and reading times
 * - Calculated statistics (average score, words learned, etc.)
 * - Achievement data
 */

interface Session {
  id: number;
  pdfName: string;
  sessionNo: number;
  completedAt: string;
  quizScore: number | null;
  readingTimeSeconds: number | null;
}

interface ProgressResponse {
  kid: {
    id: number;
    name: string;
    createdAt: string;
  };
  sessions: Session[];
  totalSessions: number;
  averageScore: number;
  pdfsRead: string[];
  wordsLearned: number;
  lastActiveDate: string;
  streakDays: number;
}

export async function GET(
  request: NextRequest,
  { params }: { params: { kidId: string } }
) {
  try {
    const kidId = parseInt(params.kidId);
    
    if (isNaN(kidId)) {
      return NextResponse.json(
        { error: 'Invalid kid ID' },
        { status: 400 }
      );
    }

    // Get kid information
    const kid = getKidById(kidId);
    if (!kid) {
      return NextResponse.json(
        { error: 'Kid not found' },
        { status: 404 }
      );
    }

    // Get all sessions for this kid
    const sessions = getKidSessions(kidId);
    
    // Calculate statistics
    const totalSessions = sessions.length;
    
    // Calculate average score (only from sessions with scores)
    const sessionsWithScores = sessions.filter(s => s.quizScore !== null);
    const averageScore = sessionsWithScores.length > 0 
      ? sessionsWithScores.reduce((sum, s) => sum + (s.quizScore || 0), 0) / sessionsWithScores.length
      : 0;

    // Get unique PDFs read
    const pdfsRead = [...new Set(sessions.map(s => s.pdfName))];

    // Calculate words learned (estimate: 5 words per correct answer)
    // This is a simplified calculation - in a full implementation, 
    // we would query the quiz_questions table for correct answers
    const estimatedWordsLearned = Math.round(averageScore * totalSessions * 0.15); // Rough estimate

    // Get last active date
    const lastActiveDate = sessions.length > 0 ? sessions[0].completedAt : kid.createdAt;

    // Calculate streak days (simplified - just check if active in last 7 days)
    const lastActivity = new Date(lastActiveDate);
    const daysSinceLastActivity = Math.floor((Date.now() - lastActivity.getTime()) / (1000 * 60 * 60 * 24));
    const streakDays = daysSinceLastActivity <= 7 ? Math.min(totalSessions, 7) : 0;

    const response: ProgressResponse = {
      kid: {
        id: kid.id,
        name: kid.name,
        createdAt: kid.createdAt,
      },
      sessions: sessions.map(session => ({
        id: session.id,
        pdfName: session.pdfName,
        sessionNo: session.sessionNo,
        completedAt: session.completedAt,
        quizScore: session.quizScore,
        readingTimeSeconds: session.readingTimeSeconds,
      })),
      totalSessions,
      averageScore: Math.round(averageScore * 100) / 100, // Round to 2 decimal places
      pdfsRead,
      wordsLearned: estimatedWordsLearned,
      lastActiveDate,
      streakDays,
    };

    return NextResponse.json(response);

  } catch (error) {
    console.error('Progress report API error:', error);
    return NextResponse.json(
      { error: 'Failed to generate progress report' },
      { status: 500 }
    );
  }
}
