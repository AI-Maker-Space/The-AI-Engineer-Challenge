import { useState, useRef, useEffect } from 'react';
import { Send, Settings, Book, Search, Filter, BarChart2 } from 'lucide-react';
import MessageBubble from './MessageBubble';
import PDFUpload from './PDFUpload';
import { Message } from '@/types';
import { StudyStorageService, StudySession, StudyStats } from '../services/studyStorage';

interface StudyInterfaceProps {
  apiKey: string;
  onApiKeyReset: () => void;
}

export default function StudyInterface({
  apiKey,
  onApiKeyReset,
}: StudyInterfaceProps) {
  const [messages, setMessages] = useState<Message[]>([]);
  const [userMessage, setUserMessage] = useState('');
  const [currentSection, setCurrentSection] = useState('');
  const [model, setModel] = useState('gpt-4.1-mini');
  const [isLoading, setIsLoading] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  const [isPdfUploaded, setIsPdfUploaded] = useState(false);
  const [showHistory, setShowHistory] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [studyStats, setStudyStats] = useState<StudyStats | null>(null);
  
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const storageService = StudyStorageService.getInstance();

  useEffect(() => {
    const stats = storageService.getStudyStats();
    setStudyStats(stats);
  }, []);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!userMessage.trim() || isLoading || !isPdfUploaded || !currentSection) return;

    const newUserMessage: Message = {
      id: Date.now().toString(),
      role: 'user',
      content: userMessage,
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, newUserMessage]);
    setUserMessage('');
    setIsLoading(true);

    const assistantMessage: Message = {
      id: (Date.now() + 1).toString(),
      role: 'assistant',
      content: '',
      timestamp: new Date(),
      isStreaming: true,
    };

    setMessages((prev) => [...prev, assistantMessage]);

    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000'}/api/chat`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            user_message: userMessage,
            model,
            api_key: apiKey,
          }),
        }
      );

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      if (!response.body) {
        throw new Error('No response body');
      }

      const reader = response.body.getReader();
      const decoder = new TextDecoder();
      let fullResponse = '';

      while (true) {
        const { done, value } = await reader.read();

        if (done) break;

        const chunk = decoder.decode(value);
        fullResponse += chunk;

        setMessages((prev) =>
          prev.map((msg) =>
            msg.id === assistantMessage.id
              ? { ...msg, content: fullResponse }
              : msg
          )
        );
      }

      // Save the completed Q&A session
      storageService.saveSession(currentSection, [newUserMessage, { ...assistantMessage, content: fullResponse, isStreaming: false }]);
      
      // Update stats
      setStudyStats(storageService.getStudyStats());

      // Mark streaming as complete
      setMessages((prev) =>
        prev.map((msg) =>
          msg.id === assistantMessage.id ? { ...msg, isStreaming: false } : msg
        )
      );
    } catch (error) {
      console.error('Chat error:', error);
      setMessages((prev) =>
        prev.map((msg) =>
          msg.id === assistantMessage.id
            ? {
                ...msg,
                content:
                  'Sorry, there was an error processing your request. Please try again.',
                isStreaming: false,
                isError: true,
              }
            : msg
        )
      );
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSubmit(e as any);
    }
  };

  const handleTextareaResize = () => {
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
      textareaRef.current.style.height =
        Math.min(textareaRef.current.scrollHeight, 120) + 'px';
    }
  };

  const filteredSessions = searchQuery
    ? storageService.searchSessions(searchQuery)
    : storageService.getSessions();

  return (
    <div className="flex h-full bg-white dark:bg-gray-800 rounded-lg shadow-lg border border-border overflow-hidden">
      {/* Main Study Interface */}
      <div className="flex flex-col flex-1">
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-border bg-card">
          <div className="flex items-center space-x-3">
            <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg flex items-center justify-center">
              <Book className="w-4 h-4 text-white" />
            </div>
            <div>
              <h2 className="font-semibold">Police Academy Study Assistant</h2>
              <p className="text-xs text-muted-foreground">
                {currentSection ? `Section ${currentSection}` : 'Select a section to study'}
              </p>
            </div>
          </div>

          <div className="flex items-center space-x-2">
            <button
              onClick={() => setShowHistory(!showHistory)}
              className="p-2 hover:bg-accent rounded-md transition-colors"
              title="Study History"
            >
              <Filter className="w-4 h-4" />
            </button>
            <button
              onClick={() => setShowSettings(!showSettings)}
              className="p-2 hover:bg-accent rounded-md transition-colors"
              title="Settings"
            >
              <Settings className="w-4 h-4" />
            </button>
            <button
              onClick={onApiKeyReset}
              className="text-xs text-muted-foreground hover:text-foreground transition-colors"
            >
              Change API Key
            </button>
          </div>
        </div>

        {/* Settings Panel */}
        {showSettings && (
          <div className="p-4 bg-muted border-b border-border space-y-4 animate-slide-up">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium mb-2">Model</label>
                <select
                  value={model}
                  onChange={(e) => setModel(e.target.value)}
                  className="w-full px-3 py-2 border border-input rounded-md bg-background focus:ring-2 focus:ring-ring focus:border-transparent"
                >
                  <option value="gpt-4.1-mini">GPT-4.1-mini</option>
                  <option value="gpt-4">GPT-4</option>
                  <option value="gpt-3.5-turbo">GPT-3.5-turbo</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">Penal Code Section</label>
                <input
                  type="text"
                  value={currentSection}
                  onChange={(e) => setCurrentSection(e.target.value)}
                  placeholder="e.g. 46.14"
                  className="w-full px-3 py-2 border border-input rounded-md bg-background focus:ring-2 focus:ring-ring focus:border-transparent"
                />
              </div>
            </div>

            <PDFUpload
              apiKey={apiKey}
              onUploadSuccess={() => setIsPdfUploaded(true)}
            />
          </div>
        )}

        {/* Messages */}
        <div className="flex-1 overflow-y-auto p-4 space-y-4">
          {messages.length === 0 ? (
            <div className="flex items-center justify-center h-full">
              <div className="text-center text-muted-foreground">
                <Book className="w-16 h-16 mx-auto mb-4 opacity-50" />
                <h3 className="text-lg font-medium mb-2">
                  Start Your Study Session
                </h3>
                <p className="text-sm">
                  {isPdfUploaded && currentSection
                    ? 'Ask questions about the penal code section'
                    : 'Upload a PDF and select a section to start studying'}
                </p>
              </div>
            </div>
          ) : (
            <>
              {messages.map((message) => (
                <MessageBubble key={message.id} message={message} />
              ))}
              <div ref={messagesEndRef} />
            </>
          )}
        </div>

        {/* Input Form */}
        <form onSubmit={handleSubmit} className="p-4 border-t border-border">
          <div className="flex space-x-2">
            <div className="flex-1 relative">
              <textarea
                ref={textareaRef}
                value={userMessage}
                onChange={(e) => {
                  setUserMessage(e.target.value);
                  handleTextareaResize();
                }}
                onKeyDown={handleKeyDown}
                placeholder={
                  currentSection
                    ? `Ask a question about Section ${currentSection}...`
                    : 'Select a section to start studying...'
                }
                disabled={isLoading || !currentSection}
                rows={1}
                className="w-full px-4 py-3 pr-12 border border-input rounded-lg bg-background focus:ring-2 focus:ring-ring focus:border-transparent outline-none resize-none transition-colors"
                style={{ minHeight: '48px', maxHeight: '120px' }}
              />
            </div>

            <button
              type="submit"
              disabled={!userMessage.trim() || isLoading || !currentSection}
              className="px-4 py-3 bg-primary text-primary-foreground hover:bg-primary/90 disabled:opacity-50 disabled:cursor-not-allowed rounded-lg font-medium transition-colors flex items-center space-x-2"
            >
              <Send className="w-4 h-4" />
            </button>
          </div>
        </form>
      </div>

      {/* Study History Sidebar */}
      {showHistory && (
        <div className="w-80 border-l border-border bg-card overflow-hidden flex flex-col">
          <div className="p-4 border-b border-border">
            <h3 className="font-semibold mb-2">Study History</h3>
            <div className="relative">
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search questions..."
                className="w-full pl-8 pr-4 py-2 border border-input rounded-md bg-background focus:ring-2 focus:ring-ring focus:border-transparent"
              />
              <Search className="w-4 h-4 absolute left-2 top-1/2 transform -translate-y-1/2 text-muted-foreground" />
            </div>
          </div>

          <div className="flex-1 overflow-y-auto">
            {filteredSessions.length > 0 ? (
              <div className="divide-y divide-border">
                {filteredSessions.map((session) => (
                  <div key={session.id} className="p-4 hover:bg-accent/50 cursor-pointer">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm font-medium">Section {session.section}</span>
                      <span className="text-xs text-muted-foreground">
                        {new Date(session.timestamp).toLocaleDateString()}
                      </span>
                    </div>
                    <p className="text-sm line-clamp-2">
                      {session.messages[0].content}
                    </p>
                  </div>
                ))}
              </div>
            ) : (
              <div className="p-4 text-center text-muted-foreground">
                <p className="text-sm">No study sessions found</p>
              </div>
            )}
          </div>

          {/* Study Stats */}
          {studyStats && (
            <div className="p-4 border-t border-border bg-muted">
              <div className="flex items-center justify-between mb-2">
                <h4 className="font-medium">Study Stats</h4>
                <BarChart2 className="w-4 h-4 text-muted-foreground" />
              </div>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span>Total Questions:</span>
                  <span className="font-medium">{studyStats.totalQuestions}</span>
                </div>
                <div className="flex justify-between">
                  <span>Sections Covered:</span>
                  <span className="font-medium">{studyStats.sectionsStudied.length}</span>
                </div>
                <div className="flex justify-between">
                  <span>Last Study:</span>
                  <span className="font-medium">
                    {new Date(studyStats.lastStudyTime).toLocaleDateString()}
                  </span>
                </div>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
