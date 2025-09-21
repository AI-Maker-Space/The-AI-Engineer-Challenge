import { NextRequest, NextResponse } from 'next/server';
import { 
  getKidById, 
  getLastSession, 
  createSession, 
  getAllPDFMetadata,
  logConversation,
  saveQuizQuestion 
} from '../../../../lib/db';

/**
 * Next Session API Endpoint
 * POST /api/next-session
 * 
 * Determines what content to show next:
 * - Looks up last completed session for a kid
 * - Returns next 30 lines from PDF content
 * - Generates quiz questions using OpenAI
 * - Handles session progression logic
 */

interface NextSessionRequest {
  kidId: number;
}

interface QuizQuestion {
  question: string;
  options: string[];
  correctAnswer: string;
}

interface NextSessionResponse {
  sessionId: number;
  text: string;
  questions: QuizQuestion[];
  sessionNo: number;
}

// Sample content for Saturn PDF (first 30 lines)
const SATURN_CONTENT = `Saturn is one of the most beautiful planets in our solar system. It is the sixth planet from the Sun and is famous for its stunning rings that circle around it like a hula hoop!

Saturn is a giant planet made mostly of gas, just like Jupiter. It is so big that you could fit about 764 Earths inside it! Even though it's huge, Saturn is actually lighter than water. If you could find a bathtub big enough, Saturn would float!

The most amazing thing about Saturn is its rings. These rings are made of billions of pieces of ice and rock. Some pieces are as small as snowballs, while others are as big as houses! The rings stretch out for thousands of miles but are very thin.

Saturn has many moons - at least 83 of them! The biggest moon is called Titan, and it's even bigger than the planet Mercury. Titan has thick clouds and lakes, but instead of water, these lakes are filled with liquid methane.

Another interesting moon is Enceladus, which shoots giant water geysers into space from its south pole. Scientists think there might be an ocean under its icy surface where tiny sea creatures could live!

Saturn takes about 29 Earth years to travel around the Sun once. That means if you were born on Saturn, you would only have a birthday every 29 years! But Saturn spins very fast - one day on Saturn is only about 10 hours long.

The planet is named after the Roman god of farming and harvest. Ancient people could see Saturn in the night sky, but they couldn't see its rings without telescopes. When Galileo first looked at Saturn through his telescope in 1610, he thought the rings looked like handles!

Saturn is made mostly of hydrogen and helium gases. The planet has strong winds that can blow at speeds of up to 1,100 miles per hour! These winds create beautiful bands of clouds in different colors - yellow, gold, and brown.`;

async function generateQuizQuestions(content: string, kidId: number, sessionNo: number): Promise<QuizQuestion[]> {
  // For now, return sample questions based on Saturn content
  // In a full implementation, this would use OpenAI API to generate questions
  
  const sampleQuestions: QuizQuestion[] = [
    {
      question: "What makes Saturn special compared to other planets?",
      options: [
        "It has beautiful rings around it",
        "It is the biggest planet",
        "It is closest to the Sun",
        "It has no moons"
      ],
      correctAnswer: "It has beautiful rings around it"
    },
    {
      question: "How many moons does Saturn have?",
      options: [
        "About 20 moons",
        "About 50 moons", 
        "At least 83 moons",
        "Only 1 moon"
      ],
      correctAnswer: "At least 83 moons"
    },
    {
      question: "What are Saturn's rings made of?",
      options: [
        "Solid metal bands",
        "Billions of pieces of ice and rock",
        "Colorful gases",
        "Diamond crystals"
      ],
      correctAnswer: "Billions of pieces of ice and rock"
    }
  ];

  // Vary questions based on session number
  if (sessionNo === 2) {
    // Session 2: Mix of repeated (rephrased) and new questions
    return [
      {
        question: "Saturn is famous for having what special feature?",
        options: [
          "The most moons of any planet",
          "Stunning rings that circle around it", 
          "The hottest surface temperature",
          "The fastest rotation speed"
        ],
        correctAnswer: "Stunning rings that circle around it"
      },
      {
        question: "What is Saturn's largest moon called?",
        options: [
          "Europa",
          "Ganymede",
          "Titan",
          "Enceladus"
        ],
        correctAnswer: "Titan"
      },
      {
        question: "How long does it take Saturn to orbit the Sun?",
        options: [
          "About 1 Earth year",
          "About 10 Earth years",
          "About 29 Earth years", 
          "About 100 Earth years"
        ],
        correctAnswer: "About 29 Earth years"
      }
    ];
  }

  if (sessionNo === 3) {
    // Session 3: Final test with mix of all previous concepts
    return [
      {
        question: "Which of these facts about Saturn is correct?",
        options: [
          "Saturn is made of solid rock like Earth",
          "Saturn is lighter than water and would float",
          "Saturn has no atmosphere",
          "Saturn is the closest planet to the Sun"
        ],
        correctAnswer: "Saturn is lighter than water and would float"
      },
      {
        question: "What did Galileo think Saturn's rings looked like when he first saw them?",
        options: [
          "A beautiful necklace",
          "Handles on the planet",
          "A hat on Saturn",
          "Colorful ribbons"
        ],
        correctAnswer: "Handles on the planet"
      },
      {
        question: "Which moon of Saturn shoots water geysers into space?",
        options: [
          "Titan",
          "Europa",
          "Enceladus",
          "Mimas"
        ],
        correctAnswer: "Enceladus"
      },
      {
        question: "How fast can winds blow on Saturn?",
        options: [
          "Up to 100 miles per hour",
          "Up to 500 miles per hour",
          "Up to 1,100 miles per hour",
          "Up to 2,000 miles per hour"
        ],
        correctAnswer: "Up to 1,100 miles per hour"
      }
    ];
  }

  return sampleQuestions;
}

export async function POST(request: NextRequest) {
  try {
    const body: NextSessionRequest = await request.json();
    const { kidId } = body;

    // Validate kid exists
    const kid = getKidById(kidId);
    if (!kid) {
      return NextResponse.json(
        { error: 'Kid not found' },
        { status: 404 }
      );
    }

    // For now, we'll use Saturn content for all sessions
    // In full implementation, this would rotate through different PDFs
    const pdfName = 'Easy_Planets_Saturn_Grade3_Sep_2025.pdf';
    
    // Check last session to determine session number
    const lastSession = getLastSession(kidId, pdfName);
    const sessionNo = lastSession ? lastSession.sessionNo + 1 : 1;

    // Create new session
    const session = createSession(kidId, pdfName, sessionNo);

    // Log the session start
    logConversation(
      kidId,
      'system',
      `Started reading session ${sessionNo} for ${pdfName}`,
      'system_message',
      session.id
    );

    // Generate quiz questions
    const questions = await generateQuizQuestions(SATURN_CONTENT, kidId, sessionNo);

    // Save questions to database for tracking
    for (const question of questions) {
      saveQuizQuestion(kidId, pdfName, question.question, question.correctAnswer, session.id);
    }

    const response: NextSessionResponse = {
      sessionId: session.id,
      text: SATURN_CONTENT,
      questions: questions,
      sessionNo: sessionNo
    };

    return NextResponse.json(response);

  } catch (error) {
    console.error('Next session API error:', error);
    return NextResponse.json(
      { error: 'Failed to create session' },
      { status: 500 }
    );
  }
}
