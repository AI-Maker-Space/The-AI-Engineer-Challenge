import { NextRequest, NextResponse } from 'next/server';
import { 
  getKidById, 
  getLastSession, 
  createSession, 
  getAllPDFMetadata,
  logConversation,
  saveQuizQuestion,
  getAvailableTopics 
} from '@/lib/db';
import { searchForRelevantContent } from '../../../lib/embeddings';

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
  // For now, return sample questions based on content type
  // In a full implementation, this would use OpenAI API to generate questions
  
  // Determine content type based on keywords
  const isConstellations = content.includes("Andromeda") || content.includes("constellations");
  
  let sampleQuestions: QuizQuestion[] = [];
  
  if (isConstellations) {
    // Constellations questions
    sampleQuestions = [
      {
        question: "What are constellations?",
        options: [
          "Groups of stars that form patterns in the night sky",
          "Single bright stars",
          "Planets in our solar system", 
          "Comets flying through space"
        ],
        correctAnswer: "Groups of stars that form patterns in the night sky"
      },
      {
        question: "What is special about the Andromeda Galaxy?",
        options: [
          "It is the smallest galaxy",
          "It is the closest big galaxy to our Milky Way",
          "It has no stars",
          "It is inside our solar system"
        ],
        correctAnswer: "It is the closest big galaxy to our Milky Way"
      },
      {
        question: "How long does light from the Andromeda Galaxy take to reach us?",
        options: [
          "A few minutes",
          "One year",
          "Over 2 million years",
          "100 years"
        ],
        correctAnswer: "Over 2 million years"
      }
    ];
  } else {
    // Saturn questions (default)
    sampleQuestions = [
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
  }

  // For Saturn content, vary questions based on session number
  if (!isConstellations && sessionNo === 2) {
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

  if (!isConstellations && sessionNo === 3) {
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
    console.log("DEBUG /api/next-session request body:", body);
    const { kidId } = body;

    // Validate kid exists
    const kid = getKidById(kidId);
    if (!kid) {
      return NextResponse.json(
        { error: 'Kid not found' },
        { status: 404 }
      );
    }

    // Get available topics for this kid (excluding completed ones)
    const availableTopics = getAvailableTopics(kidId);
    
    if (availableTopics.length === 0) {
      return NextResponse.json(
        { 
          error: 'No more topics available! You have completed all Grade-3 science topics! 🎉',
          completed: true
        },
        { status: 200 }
      );
    }
    
    // Select the first available topic
    const selectedTopic = availableTopics[0];
    const pdfName = selectedTopic.filename;
    
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

    // Load PDF content using vector search
    let pdfContent = SATURN_CONTENT; // Fallback content
    
    try {
      console.log(`📚 Selected topic: ${selectedTopic.topic} - ${selectedTopic.subtopic} (${pdfName})`);
      
      // Try to get content from vector database
      const searchQuery = `${selectedTopic.topic} ${selectedTopic.subtopic}`;
      
      // Check if we have an API key available for embedding search
      const apiKey = process.env.OPENAI_API_KEY;
      if (apiKey) {
        try {
          // Search for relevant content using our helper function
          const searchResults = await searchForRelevantContent(
            searchQuery, 
            apiKey, 
            3, 
            pdfName
          );
          
          if (searchResults.length > 0) {
            // Combine top chunks for reading content
            const combinedContent = searchResults
              .map(result => result.content)
              .join('\n\n');
            
            // Take first 30 lines for reading session (approximately)
            const lines = combinedContent.split('\n');
            pdfContent = lines.slice(0, 30).join('\n');
            
            console.log(`🔍 Found ${searchResults.length} relevant chunks from vector search`);
          } else {
            console.log('⚠️ No vector search results found, using fallback content');
          }
        } catch (embeddingError) {
          console.error('Error in vector search:', embeddingError);
          console.log('⚠️ Vector search failed, using fallback content');
        }
      } else {
        console.log('⚠️ No OpenAI API key available for vector search, using fallback content');
      }
      
      // If still using fallback, try topic-specific content
      if (pdfContent === SATURN_CONTENT && selectedTopic.topic === "Constellations") {
        pdfContent = `Constellations are groups of stars that form patterns in the night sky. People have been looking at these star patterns for thousands of years and have given them names and stories.

One of the most famous constellations is Andromeda, named after a princess in Greek mythology. Andromeda is best seen in the autumn sky in the Northern Hemisphere.

The constellation Andromeda contains the Andromeda Galaxy, which is the closest big galaxy to our own Milky Way galaxy. This galaxy is so far away that its light takes over 2 million years to reach us!

You can find Andromeda by first looking for the Great Square of Pegasus. Andromeda appears to be connected to this square through a bright star called Alpheratz.

The stars in Andromeda form a long, curved line that looks a bit like a person lying down. The brightest stars in this constellation are Alpheratz, Mirach, and Almach.

Ancient people told stories about Andromeda being chained to a rock by the sea as punishment. In the story, she was rescued by the hero Perseus, who is also a constellation nearby in the sky.

Constellations help us navigate and understand our place in the universe. They are like a map of the night sky that has been used by sailors, travelers, and astronomers for centuries.

The stars in a constellation may look close together from Earth, but they are actually very far apart from each other in space. They only appear to form patterns because of how we see them from our planet.`;
      }
      
    } catch (error) {
      console.error(`Error loading PDF content for ${pdfName}:`, error);
      // Use fallback content
    }

    // Generate quiz questions based on the content
    const questions = await generateQuizQuestions(pdfContent, kidId, sessionNo);

    // Save questions to database for tracking
    for (const question of questions) {
      saveQuizQuestion(kidId, pdfName, question.question, question.correctAnswer, session.id);
    }

    const response: NextSessionResponse = {
      sessionId: session.id,
      text: pdfContent,
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
