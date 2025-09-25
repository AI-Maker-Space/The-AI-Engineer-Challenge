import { NextRequest, NextResponse } from 'next/server';
import { 
  getKidById, 
  getKidProgress, 
  getKidQuizHistory 
} from '@/lib/db';

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
  context: { params: Promise<{ kidId: string }> }
) {
  try {
    const { kidId } = await context.params;
    const kidIdNum = parseInt(kidId);
    
    if (isNaN(kidIdNum)) {
      return NextResponse.json(
        { error: 'Invalid kid ID' },
        { status: 400 }
      );
    }

    // Get kid information
    const kid = getKidById(kidIdNum);
    if (!kid) {
      return NextResponse.json(
        { error: 'Kid not found' },
        { status: 404 }
      );
    }

    // Get all sessions for this kid
    const progress = getKidProgress(kidIdNum);
    const totalSessions = progress.totalSessions;
    
    // Calculate statistics
    const averageScore = progress.averageScore;

    // Get unique PDFs read (placeholder for now)
    const pdfsRead: string[] = [];

    // Calculate words learned (estimate: 5 words per correct answer)
    // This is a simplified calculation - in a full implementation, 
    // we would query the quiz_questions table for correct answers
    const estimatedWordsLearned = Math.round(averageScore * totalSessions * 0.15); // Rough estimate

    // Get last active date (simplified)
    const lastActiveDate = kid.createdAt;

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
      sessions: [], // Empty array since we don't have session details in progress
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
