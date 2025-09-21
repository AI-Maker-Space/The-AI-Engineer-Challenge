'use client';

import { useState, useEffect, useRef } from 'react';
import { useParams, useRouter } from 'next/navigation';

/**
 * Kids Reading + Quiz Page
 * Main learning interface where kids:
 * 1. Get greeted and choose to start reading
 * 2. Read 30 lines of PDF content with timer
 * 3. Take 3 MCQ quizzes generated from content
 * 4. Get results and progress tracking
 */

interface Kid {
  id: number;
  name: string;
  createdAt: string;
}

interface QuizQuestion {
  question: string;
  options: string[];
  correctAnswer: string;
}

interface SessionData {
  sessionId: number;
  text: string;
  questions: QuizQuestion[];
  sessionNo: number;
}

type PageState = 'greeting' | 'reading' | 'quiz' | 'results';

export default function ReadingPage() {
  const params = useParams();
  const router = useRouter();
  const kidId = parseInt(params.kidId as string);
  
  // State management
  const [kid, setKid] = useState<Kid | null>(null);
  const [pageState, setPageState] = useState<PageState>('greeting');
  const [sessionData, setSessionData] = useState<SessionData | null>(null);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [userAnswers, setUserAnswers] = useState<string[]>([]);
  const [timeLeft, setTimeLeft] = useState(300); // 5 minutes in seconds
  const [isTimerActive, setIsTimerActive] = useState(false);
  const [readingStartTime, setReadingStartTime] = useState<number | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  // Load kid data on mount
  useEffect(() => {
    if (isNaN(kidId)) {
      setError('Invalid kid ID');
      setLoading(false);
      return;
    }

    loadKidData();
  }, [kidId]);

  // Timer effect
  useEffect(() => {
    if (isTimerActive && timeLeft > 0) {
      timerRef.current = setTimeout(() => {
        setTimeLeft(timeLeft - 1);
      }, 1000);
    } else if (timeLeft === 0 && isTimerActive) {
      handleTimerExpired();
    }

    return () => {
      if (timerRef.current) {
        clearTimeout(timerRef.current);
      }
    };
  }, [isTimerActive, timeLeft]);

  const loadKidData = async () => {
    try {
      const response = await fetch(`/api/kids/${kidId}`);
      if (!response.ok) {
        throw new Error('Kid not found');
      }
      const kidData = await response.json();
      setKid(kidData);
    } catch (error) {
      console.error('Error loading kid:', error);
      setError('Could not load your profile. Please try logging in again.');
    } finally {
      setLoading(false);
    }
  };

  const startReading = async () => {
    setLoading(true);
    try {
      const response = await fetch('/api/next-session', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ kidId }),
      });

      if (!response.ok) {
        throw new Error('Failed to start session');
      }

      const data: SessionData = await response.json();
      setSessionData(data);
      setPageState('reading');
      setTimeLeft(300); // Reset timer to 5 minutes
      setIsTimerActive(true);
      setReadingStartTime(Date.now());
      
    } catch (error) {
      console.error('Error starting session:', error);
      setError('Could not start reading session. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleTimerExpired = () => {
    setIsTimerActive(false);
    proceedToQuiz();
  };

  const skipReading = () => {
    setIsTimerActive(false);
    proceedToQuiz();
  };

  const proceedToQuiz = () => {
    if (sessionData) {
      setPageState('quiz');
      setCurrentQuestionIndex(0);
      setUserAnswers([]);
    }
  };

  const handleAnswerSelect = (answer: string) => {
    const newAnswers = [...userAnswers];
    newAnswers[currentQuestionIndex] = answer;
    setUserAnswers(newAnswers);
  };

  const nextQuestion = () => {
    if (sessionData && currentQuestionIndex < sessionData.questions.length - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
    } else {
      finishQuiz();
    }
  };

  const finishQuiz = async () => {
    if (!sessionData) return;

    setLoading(true);
    try {
      // Calculate score
      let correctAnswers = 0;
      sessionData.questions.forEach((question, index) => {
        if (userAnswers[index] === question.correctAnswer) {
          correctAnswers++;
        }
      });

      const score = Math.round((correctAnswers / sessionData.questions.length) * 100);
      
      // Calculate reading time
      const readingTime = readingStartTime ? Math.round((Date.now() - readingStartTime) / 1000) : 300;

      // Save results
      await fetch('/api/sessions/complete', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          sessionId: sessionData.sessionId,
          score,
          readingTime,
          answers: userAnswers,
        }),
      });

      setPageState('results');
      
    } catch (error) {
      console.error('Error finishing quiz:', error);
      setError('Could not save your results. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const restartSession = () => {
    setPageState('greeting');
    setSessionData(null);
    setCurrentQuestionIndex(0);
    setUserAnswers([]);
    setTimeLeft(300);
    setIsTimerActive(false);
    setReadingStartTime(null);
    setError('');
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-green-50 to-blue-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading your learning session...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-red-50 to-pink-50 flex items-center justify-center p-4">
        <div className="bg-white rounded-2xl shadow-xl p-8 max-w-md w-full text-center">
          <div className="text-4xl mb-4">😕</div>
          <h2 className="text-2xl font-bold text-gray-800 mb-4">Oops!</h2>
          <p className="text-gray-600 mb-6">{error}</p>
          <button
            onClick={() => router.push('/login')}
            className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-6 rounded-lg transition-colors"
          >
            Back to Login
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-blue-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-4xl mx-auto px-4 py-4 flex justify-between items-center">
          <div className="flex items-center">
            <span className="text-2xl mr-3">🧪</span>
            <div>
              <h1 className="text-xl font-bold text-gray-800">Science Learning</h1>
              <p className="text-sm text-gray-600">Hello, {kid?.name}! 👋</p>
            </div>
          </div>
          
          {pageState === 'reading' && (
            <div className="flex items-center space-x-4">
              <div className={`text-lg font-mono ${timeLeft < 60 ? 'text-red-600' : 'text-blue-600'}`}>
                ⏰ {formatTime(timeLeft)}
              </div>
              <button
                onClick={skipReading}
                className="bg-yellow-500 hover:bg-yellow-600 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors"
              >
                Skip Reading
              </button>
            </div>
          )}
          
          <button
            onClick={() => router.push('/login')}
            className="text-gray-500 hover:text-gray-700 text-sm"
          >
            Logout
          </button>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-4xl mx-auto p-6">
        {/* Greeting State */}
        {pageState === 'greeting' && (
          <div className="bg-white rounded-2xl shadow-xl p-8 text-center">
            <div className="text-6xl mb-6">🪐</div>
            <h2 className="text-3xl font-bold text-gray-800 mb-4">
              Let's read something interesting today about Saturn!
            </h2>
            <p className="text-lg text-gray-600 mb-8">
              Are you ready to learn amazing facts about the beautiful ringed planet?
            </p>
            <div className="space-y-4">
              <button
                onClick={startReading}
                disabled={loading}
                className="bg-green-600 hover:bg-green-700 disabled:bg-green-300 text-white font-bold py-4 px-8 rounded-xl text-xl transition-colors"
              >
                {loading ? 'Starting...' : 'Yes, let\'s start! 🚀'}
              </button>
              <p className="text-sm text-gray-500">
                You'll have 5 minutes to read, then answer 3 fun questions!
              </p>
            </div>
          </div>
        )}

        {/* Reading State */}
        {pageState === 'reading' && sessionData && (
          <div className="bg-white rounded-2xl shadow-xl p-8">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-bold text-gray-800">📖 Reading Time</h2>
              <div className="text-sm text-gray-600">
                Session {sessionData.sessionNo} • Take your time and enjoy!
              </div>
            </div>
            
            <div className="prose prose-lg max-w-none">
              <div className="bg-blue-50 rounded-lg p-6 leading-relaxed text-gray-800">
                {sessionData.text.split('\n').map((paragraph, index) => (
                  <p key={index} className="mb-4 last:mb-0">
                    {paragraph}
                  </p>
                ))}
              </div>
            </div>
            
            <div className="mt-8 text-center">
              <button
                onClick={proceedToQuiz}
                className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-8 rounded-lg transition-colors"
              >
                I'm ready for the quiz! 🧠
              </button>
            </div>
          </div>
        )}

        {/* Quiz State */}
        {pageState === 'quiz' && sessionData && (
          <div className="bg-white rounded-2xl shadow-xl p-8">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-bold text-gray-800">🧠 Quiz Time</h2>
              <div className="text-sm text-gray-600">
                Question {currentQuestionIndex + 1} of {sessionData.questions.length}
              </div>
            </div>
            
            {sessionData.questions[currentQuestionIndex] && (
              <div>
                <h3 className="text-xl font-semibold text-gray-800 mb-6">
                  {sessionData.questions[currentQuestionIndex].question}
                </h3>
                
                <div className="space-y-3 mb-8">
                  {sessionData.questions[currentQuestionIndex].options.map((option, index) => (
                    <button
                      key={index}
                      onClick={() => handleAnswerSelect(option)}
                      className={`w-full text-left p-4 rounded-lg border-2 transition-colors ${
                        userAnswers[currentQuestionIndex] === option
                          ? 'border-blue-500 bg-blue-50 text-blue-800'
                          : 'border-gray-200 hover:border-gray-300 hover:bg-gray-50'
                      }`}
                    >
                      <span className="font-medium mr-3">
                        {String.fromCharCode(65 + index)}.
                      </span>
                      {option}
                    </button>
                  ))}
                </div>
                
                <div className="text-center">
                  <button
                    onClick={nextQuestion}
                    disabled={!userAnswers[currentQuestionIndex]}
                    className="bg-green-600 hover:bg-green-700 disabled:bg-gray-300 text-white font-semibold py-3 px-8 rounded-lg transition-colors"
                  >
                    {currentQuestionIndex === sessionData.questions.length - 1 ? 'Finish Quiz! 🎉' : 'Next Question →'}
                  </button>
                </div>
              </div>
            )}
          </div>
        )}

        {/* Results State */}
        {pageState === 'results' && sessionData && (
          <div className="bg-white rounded-2xl shadow-xl p-8 text-center">
            <div className="text-6xl mb-6">🎉</div>
            <h2 className="text-3xl font-bold text-gray-800 mb-4">
              Great job, {kid?.name}!
            </h2>
            
            {(() => {
              let correctAnswers = 0;
              sessionData.questions.forEach((question, index) => {
                if (userAnswers[index] === question.correctAnswer) {
                  correctAnswers++;
                }
              });
              const score = Math.round((correctAnswers / sessionData.questions.length) * 100);
              
              return (
                <div className="mb-8">
                  <div className="text-4xl font-bold text-blue-600 mb-2">
                    {score}%
                  </div>
                  <p className="text-lg text-gray-600">
                    You got {correctAnswers} out of {sessionData.questions.length} questions correct!
                  </p>
                  
                  {score >= 80 && (
                    <div className="mt-4 p-4 bg-green-50 rounded-lg">
                      <p className="text-green-800 font-medium">
                        🌟 Excellent work! You're a science superstar!
                      </p>
                    </div>
                  )}
                  
                  {score >= 60 && score < 80 && (
                    <div className="mt-4 p-4 bg-yellow-50 rounded-lg">
                      <p className="text-yellow-800 font-medium">
                        👍 Good job! Keep learning and you'll be amazing!
                      </p>
                    </div>
                  )}
                  
                  {score < 60 && (
                    <div className="mt-4 p-4 bg-blue-50 rounded-lg">
                      <p className="text-blue-800 font-medium">
                        💪 Great effort! Try reading again to learn even more!
                      </p>
                    </div>
                  )}
                </div>
              );
            })()}
            
            <div className="space-y-4">
              <button
                onClick={restartSession}
                className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-8 rounded-lg transition-colors mr-4"
              >
                Read Another Topic 📚
              </button>
              
              <button
                onClick={() => router.push(`/report/${kidId}`)}
                className="bg-green-600 hover:bg-green-700 text-white font-semibold py-3 px-8 rounded-lg transition-colors"
              >
                See My Progress 📊
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
