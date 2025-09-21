'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';

/**
 * Parent Report Page
 * Shows comprehensive progress tracking for a child:
 * - PDFs read with session dates
 * - Quiz scores over time
 * - Words mastered estimation
 * - Learning streaks and achievements
 */

interface Kid {
  id: number;
  name: string;
  createdAt: string;
}

interface Session {
  id: number;
  pdfName: string;
  sessionNo: number;
  completedAt: string;
  quizScore: number | null;
  readingTimeSeconds: number | null;
}

interface ProgressData {
  kid: Kid;
  sessions: Session[];
  totalSessions: number;
  averageScore: number;
  pdfsRead: string[];
  wordsLearned: number;
  lastActiveDate: string;
  streakDays: number;
}

export default function ParentReportPage() {
  const params = useParams();
  const router = useRouter();
  const kidId = parseInt(params.kidId as string);
  
  const [progressData, setProgressData] = useState<ProgressData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    if (isNaN(kidId)) {
      setError('Invalid kid ID');
      setLoading(false);
      return;
    }

    loadProgressData();
  }, [kidId]);

  const loadProgressData = async () => {
    try {
      const response = await fetch(`/api/reports/${kidId}`);
      if (!response.ok) {
        throw new Error('Failed to load progress data');
      }
      const data = await response.json();
      setProgressData(data);
    } catch (error) {
      console.error('Error loading progress:', error);
      setError('Could not load progress report. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const formatReadingTime = (seconds: number | null) => {
    if (!seconds) return 'N/A';
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}m ${remainingSeconds}s`;
  };

  const getScoreColor = (score: number | null) => {
    if (!score) return 'text-gray-500';
    if (score >= 80) return 'text-green-600';
    if (score >= 60) return 'text-yellow-600';
    return 'text-red-500';
  };

  const getScoreBadge = (score: number | null) => {
    if (!score) return 'bg-gray-100 text-gray-600';
    if (score >= 80) return 'bg-green-100 text-green-800';
    if (score >= 60) return 'bg-yellow-100 text-yellow-800';
    return 'bg-red-100 text-red-800';
  };

  const getPDFDisplayName = (filename: string) => {
    // Convert filename to readable format
    // Easy_Planets_Saturn_Grade3_Sep_2025.pdf -> "Planets: Saturn"
    const parts = filename.replace('.pdf', '').split('_');
    if (parts.length >= 3) {
      const topic = parts[1];
      const subtopic = parts[2];
      return `${topic}: ${subtopic}`;
    }
    return filename.replace('.pdf', '');
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-50 to-blue-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading progress report...</p>
        </div>
      </div>
    );
  }

  if (error || !progressData) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-red-50 to-pink-50 flex items-center justify-center p-4">
        <div className="bg-white rounded-2xl shadow-xl p-8 max-w-md w-full text-center">
          <div className="text-4xl mb-4">📊</div>
          <h2 className="text-2xl font-bold text-gray-800 mb-4">Report Not Available</h2>
          <p className="text-gray-600 mb-6">{error}</p>
          <button
            onClick={() => router.push('/login')}
            className="bg-purple-600 hover:bg-purple-700 text-white font-semibold py-2 px-6 rounded-lg transition-colors"
          >
            Back to Login
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 to-blue-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-6xl mx-auto px-4 py-6">
          <div className="flex justify-between items-center">
            <div className="flex items-center">
              <span className="text-3xl mr-4">📊</span>
              <div>
                <h1 className="text-2xl font-bold text-gray-800">Progress Report</h1>
                <p className="text-gray-600">{progressData.kid.name}'s Learning Journey</p>
              </div>
            </div>
            
            <div className="flex space-x-3">
              <button
                onClick={() => router.push(`/read/${kidId}`)}
                className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg font-medium transition-colors"
              >
                Continue Learning
              </button>
              <button
                onClick={() => router.push('/login')}
                className="text-gray-500 hover:text-gray-700 px-4 py-2 rounded-lg transition-colors"
              >
                Switch Child
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-6xl mx-auto p-6">
        {/* Overview Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {/* Total Sessions */}
          <div className="bg-white rounded-xl shadow-lg p-6">
            <div className="flex items-center">
              <div className="bg-blue-100 rounded-full p-3 mr-4">
                <span className="text-2xl">📚</span>
              </div>
              <div>
                <p className="text-sm text-gray-600">Total Sessions</p>
                <p className="text-2xl font-bold text-gray-800">{progressData.totalSessions}</p>
              </div>
            </div>
          </div>

          {/* Average Score */}
          <div className="bg-white rounded-xl shadow-lg p-6">
            <div className="flex items-center">
              <div className="bg-green-100 rounded-full p-3 mr-4">
                <span className="text-2xl">🎯</span>
              </div>
              <div>
                <p className="text-sm text-gray-600">Average Score</p>
                <p className={`text-2xl font-bold ${getScoreColor(progressData.averageScore)}`}>
                  {progressData.averageScore.toFixed(1)}%
                </p>
              </div>
            </div>
          </div>

          {/* Words Learned */}
          <div className="bg-white rounded-xl shadow-lg p-6">
            <div className="flex items-center">
              <div className="bg-purple-100 rounded-full p-3 mr-4">
                <span className="text-2xl">🧠</span>
              </div>
              <div>
                <p className="text-sm text-gray-600">Words Learned</p>
                <p className="text-2xl font-bold text-gray-800">{progressData.wordsLearned}</p>
              </div>
            </div>
          </div>

          {/* Topics Explored */}
          <div className="bg-white rounded-xl shadow-lg p-6">
            <div className="flex items-center">
              <div className="bg-orange-100 rounded-full p-3 mr-4">
                <span className="text-2xl">🔬</span>
              </div>
              <div>
                <p className="text-sm text-gray-600">Topics Explored</p>
                <p className="text-2xl font-bold text-gray-800">{progressData.pdfsRead.length}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Recent Activity */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Session History */}
          <div className="lg:col-span-2 bg-white rounded-xl shadow-lg p-6">
            <h3 className="text-xl font-bold text-gray-800 mb-6 flex items-center">
              <span className="mr-2">📈</span>
              Session History
            </h3>
            
            {progressData.sessions.length === 0 ? (
              <div className="text-center py-8">
                <div className="text-4xl mb-4">🎯</div>
                <p className="text-gray-600">No sessions completed yet.</p>
                <p className="text-sm text-gray-500 mt-2">Start learning to see progress here!</p>
              </div>
            ) : (
              <div className="space-y-4">
                {progressData.sessions.slice(0, 10).map((session) => (
                  <div key={session.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                    <div className="flex-1">
                      <h4 className="font-medium text-gray-800">
                        {getPDFDisplayName(session.pdfName)}
                      </h4>
                      <p className="text-sm text-gray-600">
                        Session {session.sessionNo} • {formatDate(session.completedAt)}
                      </p>
                      <p className="text-xs text-gray-500">
                        Reading time: {formatReadingTime(session.readingTimeSeconds)}
                      </p>
                    </div>
                    
                    <div className="text-right">
                      {session.quizScore !== null ? (
                        <span className={`inline-block px-3 py-1 rounded-full text-sm font-medium ${getScoreBadge(session.quizScore)}`}>
                          {session.quizScore}%
                        </span>
                      ) : (
                        <span className="text-gray-400 text-sm">No quiz</span>
                      )}
                    </div>
                  </div>
                ))}
                
                {progressData.sessions.length > 10 && (
                  <p className="text-center text-gray-500 text-sm mt-4">
                    Showing latest 10 sessions of {progressData.sessions.length} total
                  </p>
                )}
              </div>
            )}
          </div>

          {/* Learning Insights */}
          <div className="space-y-6">
            {/* Achievement Badges */}
            <div className="bg-white rounded-xl shadow-lg p-6">
              <h3 className="text-lg font-bold text-gray-800 mb-4 flex items-center">
                <span className="mr-2">🏆</span>
                Achievements
              </h3>
              
              <div className="space-y-3">
                {progressData.totalSessions >= 1 && (
                  <div className="flex items-center p-3 bg-blue-50 rounded-lg">
                    <span className="text-2xl mr-3">🎯</span>
                    <div>
                      <p className="font-medium text-blue-800">First Steps</p>
                      <p className="text-xs text-blue-600">Completed first session</p>
                    </div>
                  </div>
                )}
                
                {progressData.averageScore >= 80 && (
                  <div className="flex items-center p-3 bg-green-50 rounded-lg">
                    <span className="text-2xl mr-3">⭐</span>
                    <div>
                      <p className="font-medium text-green-800">Star Student</p>
                      <p className="text-xs text-green-600">80%+ average score</p>
                    </div>
                  </div>
                )}
                
                {progressData.totalSessions >= 5 && (
                  <div className="flex items-center p-3 bg-purple-50 rounded-lg">
                    <span className="text-2xl mr-3">🔥</span>
                    <div>
                      <p className="font-medium text-purple-800">Learning Streak</p>
                      <p className="text-xs text-purple-600">5+ sessions completed</p>
                    </div>
                  </div>
                )}
                
                {progressData.pdfsRead.length >= 3 && (
                  <div className="flex items-center p-3 bg-orange-50 rounded-lg">
                    <span className="text-2xl mr-3">🌟</span>
                    <div>
                      <p className="font-medium text-orange-800">Explorer</p>
                      <p className="text-xs text-orange-600">3+ topics explored</p>
                    </div>
                  </div>
                )}
                
                {progressData.totalSessions === 0 && (
                  <div className="text-center py-4">
                    <p className="text-gray-500 text-sm">Complete sessions to earn achievements!</p>
                  </div>
                )}
              </div>
            </div>

            {/* Learning Tips */}
            <div className="bg-white rounded-xl shadow-lg p-6">
              <h3 className="text-lg font-bold text-gray-800 mb-4 flex items-center">
                <span className="mr-2">💡</span>
                Learning Tips
              </h3>
              
              <div className="space-y-3 text-sm">
                <div className="p-3 bg-yellow-50 rounded-lg">
                  <p className="font-medium text-yellow-800">📖 Reading Tip</p>
                  <p className="text-yellow-700">Take your time reading. Understanding is more important than speed!</p>
                </div>
                
                <div className="p-3 bg-blue-50 rounded-lg">
                  <p className="font-medium text-blue-800">🧠 Quiz Tip</p>
                  <p className="text-blue-700">Read each question carefully and think about what you just learned.</p>
                </div>
                
                <div className="p-3 bg-green-50 rounded-lg">
                  <p className="font-medium text-green-800">⏰ Time Tip</p>
                  <p className="text-green-700">If you finish reading early, review the content before starting the quiz.</p>
                </div>
              </div>
            </div>

            {/* Parent Notes */}
            <div className="bg-white rounded-xl shadow-lg p-6">
              <h3 className="text-lg font-bold text-gray-800 mb-4 flex items-center">
                <span className="mr-2">👨‍👩‍👧‍👦</span>
                For Parents
              </h3>
              
              <div className="space-y-3 text-sm text-gray-600">
                <p>
                  <strong>Words Learned:</strong> Estimated based on correct quiz answers (5 words per correct answer).
                </p>
                <p>
                  <strong>Reading Time:</strong> Tracks how long your child spends reading each session.
                </p>
                <p>
                  <strong>Session Progression:</strong> Questions become more challenging as your child progresses through sessions on the same topic.
                </p>
                <p>
                  <strong>Privacy:</strong> All data is stored locally and not shared with third parties.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
