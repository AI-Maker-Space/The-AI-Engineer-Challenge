import { NextRequest, NextResponse } from 'next/server';
import { 
  saveQuizScore, 
  updateReadingTime, 
  logConversation,
  getKidQuizHistory,
  updateQuizAnswer
} from '../../../../lib/db';

/**
 * Complete Session API Endpoint
 * POST /api/sessions/complete
 * 
 * Handles session completion:
 * - Saves quiz score and reading time
 * - Logs all quiz answers
 * - Updates quiz question records with kid's answers
 * - Returns completion status
 */

interface CompleteSessionRequest {
  sessionId: number;
  score: number;
  readingTime: number;
  answers: string[];
}

export async function POST(request: NextRequest) {
  try {
    const body: CompleteSessionRequest = await request.json();
    const { sessionId, score, readingTime, answers } = body;

    // Validate input
    if (!sessionId || score === undefined || !readingTime || !Array.isArray(answers)) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    if (score < 0 || score > 100) {
      return NextResponse.json(
        { error: 'Score must be between 0 and 100' },
        { status: 400 }
      );
    }

    // Save quiz score and reading time
    saveQuizScore(sessionId, score);
    updateReadingTime(sessionId, readingTime);

    // Log completion
    logConversation(
      0, // We'll need to get kidId from session, for now using 0
      'system',
      `Session completed with score: ${score}% in ${readingTime} seconds`,
      'system_message',
      sessionId
    );

    // Log each quiz answer
    answers.forEach((answer, index) => {
      logConversation(
        0, // We'll need to get kidId from session
        'user',
        `Quiz answer ${index + 1}: ${answer}`,
        'quiz_answer',
        sessionId
      );
    });

    // Note: In a full implementation, we would:
    // 1. Get the session to find kidId and pdfName
    // 2. Get the quiz questions for this session
    // 3. Update each quiz question record with the kid's answer and correctness
    // 4. Calculate words learned based on correct answers
    // 5. Update progress tracking

    const response = {
      success: true,
      sessionId,
      score,
      message: score >= 80 ? 'Excellent work!' : score >= 60 ? 'Good job!' : 'Keep learning!'
    };

    return NextResponse.json(response);

  } catch (error) {
    console.error('Complete session API error:', error);
    return NextResponse.json(
      { error: 'Failed to complete session' },
      { status: 500 }
    );
  }
}
