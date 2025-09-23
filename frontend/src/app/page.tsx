'use client';

import { useState, useEffect } from 'react';

interface ChatRequest {
  developer_message: string;
  user_message: string;
  model: string;
  api_key: string;
  user_id: string;
}

interface RAGChatRequest {
  user_message: string;
  model: string;
  api_key: string;
  user_id: string;
}

interface RAGStatus {
  user_id: string;
  has_index: boolean;
  message?: string;
  index_info?: {
    filename: string;
    upload_time: string;
    text_length: number;
  };
}

interface HealthResponse {
  status: string;
}

export default function Home() {
  const [apiStatus, setApiStatus] = useState<'checking' | 'healthy' | 'error'>('checking');
  const [healthResponse, setHealthResponse] = useState<string>('');
  const [userMessage, setUserMessage] = useState('');
  const [chatResponse, setChatResponse] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [apiKey, setApiKey] = useState('');
  const [userId, setUserId] = useState<string>('');
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [uploadStatus, setUploadStatus] = useState<string>('');
  const [ragStatus, setRagStatus] = useState<RAGStatus | null>(null);
  const [chatMode, setChatMode] = useState<'normal' | 'rag'>('normal');
  const [rebuildStatus, setRebuildStatus] = useState<'idle' | 'rebuilding'>('idle');
  const [rebuildMessage, setRebuildMessage] = useState<string>('');

  // Generate or retrieve user ID on component mount
  useEffect(() => {
    let storedUserId = localStorage.getItem('ai-chat-user-id');
    if (!storedUserId) {
      storedUserId = 'user_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9);
      localStorage.setItem('ai-chat-user-id', storedUserId);
    }
    setUserId(storedUserId);
  }, []);

  const checkHealth = async () => {
    setApiStatus('checking');
    try {
      const response = await fetch('/api/health');
      const data: HealthResponse = await response.json();
      
      if (response.ok) {
        setApiStatus('healthy');
        setHealthResponse(JSON.stringify(data, null, 2));
      } else {
        throw new Error(`HTTP ${response.status}`);
      }
    } catch (error) {
      setApiStatus('error');
      setHealthResponse(`Error: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  };

  const testChat = async () => {
    if (!userMessage.trim()) {
      alert('Please enter a message');
      return;
    }

    if (!apiKey.trim()) {
      alert('Please enter your OpenAI API key');
      return;
    }

    if (!userId.trim()) {
      alert('User ID not ready yet. Please wait a moment and try again.');
      return;
    }

    setIsLoading(true);
    setChatResponse('Sending request...');

    try {
      const requestBody: ChatRequest = {
        developer_message: "You are a helpful AI assistant.",
        user_message: userMessage,
        model: "gpt-4.1-mini",
        api_key: apiKey,
        user_id: userId
      };

      console.log('Sending request with user_id:', userId);
      console.log('Request body:', requestBody);

      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 15000);

      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(requestBody),
        signal: controller.signal,
      });

      clearTimeout(timeoutId);

      if (!response.ok) {
        const maybeText = await response.text().catch(() => '');
        if (response.status === 401) {
          setChatResponse('Error: 401 Unauthorized - Your OpenAI API key is invalid or missing.');
        } else {
          setChatResponse(`Error: HTTP ${response.status}${maybeText ? ` - ${maybeText}` : ''}`);
        }
        return;
      }

      // If there's no body (no stream), fall back to reading text
      if (!response.body) {
        const text = await response.text().catch(() => '');
        setChatResponse(text || 'No response body received from server.');
        return;
      }

      const reader = response.body.getReader();
      const decoder = new TextDecoder();
      let result = '';

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;
        result += decoder.decode(value);
        setChatResponse(result);
      }

      if (!result) {
        setChatResponse('No content received from the stream.');
      }
    } catch (error) {
      if (error instanceof Error && error.name === 'AbortError') {
        setChatResponse('Request timed out. Please try again or provide a valid API key.');
      } else {
        setChatResponse(`Error: ${error instanceof Error ? error.message : 'Unknown error'}`);
      }
    } finally {
      setIsLoading(false);
    }
  };

  const uploadPDF = async () => {
    if (!selectedFile) {
      alert('Please select a PDF file');
      return;
    }

    if (!apiKey.trim()) {
      alert('Please enter your OpenAI API key');
      return;
    }

    if (!userId.trim()) {
      alert('User ID not ready yet. Please wait a moment and try again.');
      return;
    }

    setUploadStatus('Uploading PDF...');

    try {
      const formData = new FormData();
      formData.append('file', selectedFile);
      formData.append('api_key', apiKey);
      formData.append('user_id', userId);

      const response = await fetch('/api/upload-pdf', {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) {
        const errorText = await response.text();
        setUploadStatus(`Error: HTTP ${response.status} - ${errorText}`);
        return;
      }

      const result = await response.json();
      setUploadStatus(`✅ ${result.message}`);
      setChatMode('rag');
      checkRAGStatus();
    } catch (error) {
      setUploadStatus(`Error: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  };

  const ragChat = async () => {
    if (!userMessage.trim()) {
      alert('Please enter a message');
      return;
    }

    if (!apiKey.trim()) {
      alert('Please enter your OpenAI API key');
      return;
    }

    if (!userId.trim()) {
      alert('User ID not ready yet. Please wait a moment and try again.');
      return;
    }

    setIsLoading(true);
    setChatResponse('Sending RAG request...');

    try {
      const requestBody: RAGChatRequest = {
        user_message: userMessage,
        model: "gpt-4.1-mini",
        api_key: apiKey,
        user_id: userId
      };

      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 15000);

      const response = await fetch('/api/rag-chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(requestBody),
        signal: controller.signal,
      });

      clearTimeout(timeoutId);

      if (!response.ok) {
        const maybeText = await response.text().catch(() => '');
        setChatResponse(`Error: HTTP ${response.status}${maybeText ? ` - ${maybeText}` : ''}`);
        return;
      }

      if (!response.body) {
        const text = await response.text().catch(() => '');
        setChatResponse(text || 'No response body received from server.');
        return;
      }

      const reader = response.body.getReader();
      const decoder = new TextDecoder();
      let result = '';

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;
        result += decoder.decode(value);
        setChatResponse(result);
      }

      if (!result) {
        setChatResponse('No content received from the stream.');
      }
    } catch (error) {
      if (error instanceof Error && error.name === 'AbortError') {
        setChatResponse('Request timed out. Please try again or provide a valid API key.');
      } else {
        setChatResponse(`Error: ${error instanceof Error ? error.message : 'Unknown error'}`);
      }
    } finally {
      setIsLoading(false);
    }
  };

  const checkRAGStatus = async () => {
    if (!userId.trim()) return;

    try {
      const response = await fetch(`/api/rag-status/${userId}`);
      if (response.ok) {
        const status = await response.json();
        setRagStatus(status);
      }
    } catch (error) {
      console.error('Error checking RAG status:', error);
    }
  };

  const handleRebuildVectorDB = async () => {
    if (!apiKey.trim()) {
      setRebuildMessage('Please enter your OpenAI API key first');
      return;
    }

    if (!confirm('This will clear all existing embeddings and rebuild them from scratch. Continue?')) {
      return;
    }

    setRebuildStatus('rebuilding');
    setRebuildMessage('Clearing existing embeddings and rebuilding...');

    try {
      const response = await fetch('/api/reindex', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          api_key: apiKey,
          confirm: true
        }),
      });

      const result = await response.json();

      if (response.ok) {
        setRebuildMessage(`✅ ${result.message} - ${result.details.pdfsProcessed} PDFs processed`);
        // Refresh health status
        checkHealth();
      } else {
        setRebuildMessage(`❌ ${result.error}: ${result.details}`);
      }
    } catch (error) {
      setRebuildMessage(`❌ Error: ${error instanceof Error ? error.message : 'Unknown error'}`);
    } finally {
      setRebuildStatus('idle');
    }
  };

  const handleAdminFileChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    if (!apiKey.trim()) {
      alert('Please enter your OpenAI API key first');
      return;
    }

    setUploadStatus('Uploading and processing...');

    try {
      const formData = new FormData();
      formData.append('file', file);
      formData.append('api_key', apiKey);
      formData.append('user_type', 'admin');

      const response = await fetch('/api/upload-pdf', {
        method: 'POST',
        body: formData,
      });

      const result = await response.json();

      if (response.ok) {
        setUploadStatus(`✅ ${result.message} - ${result.chunks_created} chunks created`);
        // Clear the file input
        event.target.value = '';
        // Refresh health status
        checkHealth();
      } else {
        setUploadStatus(`❌ ${result.error}: ${result.details || ''}`);
      }
    } catch (error) {
      setUploadStatus(`❌ Upload failed: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  };

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file && file.type === 'application/pdf') {
      setSelectedFile(file);
      setUploadStatus('');
    } else {
      alert('Please select a valid PDF file');
      setSelectedFile(null);
    }
  };

  useEffect(() => {
    checkHealth();
  }, []);

  useEffect(() => {
    if (userId) {
      checkRAGStatus();
    }
  }, [userId]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-600 via-blue-600 to-indigo-800 text-white">
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          {/* Header */}
          <div className="text-center mb-8">
            <h1 className="text-5xl font-bold mb-4 bg-gradient-to-r from-yellow-400 to-pink-400 bg-clip-text text-transparent">
              🤖 AI Engineer Challenge
            </h1>
            <p className="text-xl text-blue-100">
              Your First LLM-powered Application with Next.js & Vercel
            </p>
          </div>

          {/* Kids Science Tutor Section */}
          <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-6 mb-8 shadow-xl">
            <h2 className="text-2xl font-semibold mb-4 flex items-center gap-2">
              <span className="text-2xl">🎓</span>
              Kids Science Tutor
            </h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
              <a 
                href="/login" 
                className="bg-blue-500 hover:bg-blue-600 text-white p-4 rounded-xl transition-colors block text-center"
              >
                <div className="text-2xl mb-2">👶</div>
                <div className="font-semibold">Kids Login</div>
                <div className="text-sm opacity-90">Start learning science!</div>
              </a>
              
              <a 
                href="/read/1" 
                className="bg-green-500 hover:bg-green-600 text-white p-4 rounded-xl transition-colors block text-center"
              >
                <div className="text-2xl mb-2">📚</div>
                <div className="font-semibold">Demo Reading</div>
                <div className="text-sm opacity-90">Try the reading experience</div>
          </a>
        </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <a 
                href="/report/1" 
                className="bg-purple-500 hover:bg-purple-600 text-white p-4 rounded-xl transition-colors block text-center"
              >
                <div className="text-2xl mb-2">📊</div>
                <div className="font-semibold">Parent Report</div>
                <div className="text-sm opacity-90">View progress reports</div>
              </a>
              
              <button 
                onClick={() => window.open('/api/health', '_blank')}
                className="bg-gray-500 hover:bg-gray-600 text-white p-4 rounded-xl transition-colors"
              >
                <div className="text-2xl mb-2">🏥</div>
                <div className="font-semibold">System Health</div>
                <div className="text-sm opacity-90">Check embeddings status</div>
              </button>
            </div>
          </div>

          {/* Admin Section */}
          <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-6 mb-8 shadow-xl">
            <h2 className="text-2xl font-semibold mb-4 flex items-center gap-2">
              <span className="text-2xl">⚙️</span>
              Admin Tools
            </h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
              <button 
                onClick={handleRebuildVectorDB}
                disabled={rebuildStatus === 'rebuilding'}
                className="bg-orange-500 hover:bg-orange-600 disabled:bg-gray-500 text-white p-4 rounded-xl transition-colors"
              >
                <div className="text-2xl mb-2">🔄</div>
                <div className="font-semibold">
                  {rebuildStatus === 'rebuilding' ? 'Rebuilding...' : 'Rebuild Vector DB'}
                </div>
                <div className="text-sm opacity-90">Clear and reload all embeddings</div>
              </button>
              
              <div className="bg-blue-500 hover:bg-blue-600 text-white p-4 rounded-xl">
                <div className="text-2xl mb-2">📁</div>
                <div className="font-semibold">Upload PDF</div>
                <div className="text-sm opacity-90 mb-2">Add content to vector DB</div>
                <input
                  type="file"
                  accept=".pdf"
                  onChange={handleAdminFileChange}
                  className="w-full text-sm bg-white/20 rounded p-1"
                />
              </div>
            </div>
            
            {rebuildMessage && (
              <div className={`p-3 rounded-lg mb-4 ${
                rebuildMessage.includes('✅') ? 'bg-green-500/20' : 'bg-red-500/20'
              }`}>
                {rebuildMessage}
              </div>
            )}
            
            {uploadStatus && (
              <div className={`p-3 rounded-lg ${
                uploadStatus.includes('✅') ? 'bg-green-500/20' : 'bg-red-500/20'
              }`}>
                {uploadStatus}
              </div>
            )}
          </div>

          {/* API Status Section */}
          <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-6 mb-8 shadow-xl">
            <h2 className="text-2xl font-semibold mb-4 flex items-center gap-2">
              <span className="text-2xl">🔍</span>
              API Status
            </h2>
            
            <div className="flex items-center gap-4 mb-4">
              <div className={`px-4 py-2 rounded-full font-semibold ${
                apiStatus === 'checking' ? 'bg-yellow-500' :
                apiStatus === 'healthy' ? 'bg-green-500' : 'bg-red-500'
              }`}>
                {apiStatus === 'checking' && '🔄 Checking...'}
                {apiStatus === 'healthy' && '✅ API is healthy'}
                {apiStatus === 'error' && '❌ API is not responding'}
              </div>
              <button
                onClick={checkHealth}
                className="px-6 py-2 bg-blue-500 hover:bg-blue-600 rounded-full font-medium transition-colors"
              >
                Check API Health
              </button>
            </div>

            {healthResponse && (
              <div className="bg-black/20 p-4 rounded-lg font-mono text-sm overflow-x-auto">
                <pre>{healthResponse}</pre>
              </div>
            )}
          </div>

          {/* PDF Upload Section */}
          <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-6 mb-8 shadow-xl">
            <h2 className="text-2xl font-semibold mb-4 flex items-center gap-2">
              <span className="text-2xl">📄</span>
              PDF Upload & RAG
            </h2>
            
            <div className="space-y-4">
              <div className="space-y-3">
                <div>
                  <label className="block text-sm font-medium text-blue-100 mb-2">
                    Upload PDF for RAG
                  </label>
                  <div className="flex gap-4 items-center">
                    <input
                      type="file"
                      accept=".pdf"
                      onChange={handleFileChange}
                      className="flex-1 px-4 py-3 rounded-lg border-0 bg-white/20 text-white file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-blue-500 file:text-white hover:file:bg-blue-600"
                    />
                    <button
                      onClick={uploadPDF}
                      disabled={!selectedFile || !apiKey.trim() || !userId.trim()}
                      className="px-6 py-3 bg-purple-500 hover:bg-purple-600 disabled:bg-gray-500 rounded-full font-medium transition-colors flex-shrink-0"
                    >
                      Upload PDF
                    </button>
                  </div>
                  {selectedFile && (
                    <p className="text-sm text-blue-200 mt-2">
                      Selected: {selectedFile.name} ({(selectedFile.size / 1024 / 1024).toFixed(2)} MB)
                    </p>
                  )}
                </div>
                
                {uploadStatus && (
                  <div className="bg-black/20 p-4 rounded-lg">
                    <p className="text-sm">{uploadStatus}</p>
                  </div>
                )}

                {ragStatus && (
                  <div className="bg-black/20 p-4 rounded-lg">
                    <h3 className="font-semibold mb-2">RAG Status:</h3>
                    {ragStatus.has_index ? (
                      <div>
                        <p className="text-green-400">✅ PDF indexed successfully</p>
                        <p className="text-sm text-blue-200">
                          File: {ragStatus.index_info?.filename} | 
                          Length: {ragStatus.index_info?.text_length} characters
                        </p>
                      </div>
                    ) : (
                      <p className="text-yellow-400">⚠️ No PDF uploaded yet</p>
                    )}
                  </div>
                )}

                <div className="flex gap-4">
                  <button
                    onClick={() => setChatMode('normal')}
                    className={`px-4 py-2 rounded-full font-medium transition-colors ${
                      chatMode === 'normal' 
                        ? 'bg-blue-500 text-white' 
                        : 'bg-white/20 text-blue-200 hover:bg-white/30'
                    }`}
                  >
                    Normal Chat
                  </button>
                  <button
                    onClick={() => setChatMode('rag')}
                    disabled={!ragStatus?.has_index}
                    className={`px-4 py-2 rounded-full font-medium transition-colors ${
                      chatMode === 'rag' 
                        ? 'bg-purple-500 text-white' 
                        : 'bg-white/20 text-blue-200 hover:bg-white/30 disabled:bg-gray-500 disabled:text-gray-400'
                    }`}
                  >
                    RAG Chat
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* API Endpoints Section */}
          <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-6 mb-8 shadow-xl">
            <h2 className="text-2xl font-semibold mb-4 flex items-center gap-2">
              <span className="text-2xl">📡</span>
              Available Endpoints
            </h2>
            
            <div className="space-y-4">
              <div className="bg-black/20 p-4 rounded-lg">
                <div className="flex items-center gap-2 mb-2">
                  <span className="px-2 py-1 bg-green-500 text-white text-xs font-bold rounded">
                    GET
                  </span>
                  <code className="text-lg font-mono">/api/health</code>
                </div>
                <p className="text-blue-100">Health check endpoint to verify API status</p>
              </div>

              <div className="bg-black/20 p-4 rounded-lg">
                <div className="flex items-center gap-2 mb-2">
                  <span className="px-2 py-1 bg-blue-500 text-white text-xs font-bold rounded">
                    POST
                  </span>
                  <code className="text-lg font-mono">/api/chat</code>
                </div>
                <p className="text-blue-100 mb-2">Chat endpoint for AI conversations</p>
                <p className="text-sm text-blue-200">
                  <strong>Body:</strong> JSON with developer_message, user_message, model, api_key
                </p>
              </div>

              <div className="bg-black/20 p-4 rounded-lg">
                <div className="flex items-center gap-2 mb-2">
                  <span className="px-2 py-1 bg-purple-500 text-white text-xs font-bold rounded">
                    POST
                  </span>
                  <code className="text-lg font-mono">/api/upload-pdf</code>
                </div>
                <p className="text-blue-100 mb-2">Upload and index PDF for RAG</p>
                <p className="text-sm text-blue-200">
                  <strong>Body:</strong> FormData with file, api_key, user_id
                </p>
              </div>

              <div className="bg-black/20 p-4 rounded-lg">
                <div className="flex items-center gap-2 mb-2">
                  <span className="px-2 py-1 bg-purple-500 text-white text-xs font-bold rounded">
                    POST
                  </span>
                  <code className="text-lg font-mono">/api/rag-chat</code>
                </div>
                <p className="text-blue-100 mb-2">Chat with uploaded PDF using RAG</p>
                <p className="text-sm text-blue-200">
                  <strong>Body:</strong> JSON with user_message, model, api_key, user_id
                </p>
              </div>

              <div className="bg-black/20 p-4 rounded-lg">
                <div className="flex items-center gap-2 mb-2">
                  <span className="px-2 py-1 bg-green-500 text-white text-xs font-bold rounded">
                    GET
                  </span>
                  <code className="text-lg font-mono">/api/rag-status/{"{user_id}"}</code>
                </div>
                <p className="text-blue-100">Check RAG index status for a user</p>
              </div>
            </div>
          </div>

          {/* Chat Test Section */}
          <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-6 shadow-xl">
            <h2 className="text-2xl font-semibold mb-4 flex items-center gap-2">
              <span className="text-2xl">💬</span>
              {chatMode === 'rag' ? 'RAG Chat with PDF' : 'Test Chat API'}
            </h2>
            
            <div className="space-y-4">
              <div className="space-y-3">
                <div>
                  <label className="block text-sm font-medium text-blue-100 mb-2">
                    Your User ID
                  </label>
                  <div className="px-4 py-3 rounded-full bg-white/20 border border-white/30 text-white/80 font-mono text-sm">
                    {userId || 'Generating...'}
                  </div>
                  <p className="text-xs text-blue-200 mt-1">
                    This ID persists across sessions to track your conversations
                  </p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-blue-100 mb-2">
                    OpenAI API Key
                  </label>
                  <input
                    type="password"
                    value={apiKey}
                    onChange={(e) => setApiKey(e.target.value)}
                    placeholder="sk-..."
                    className="w-full px-4 py-3 rounded-full border-0 bg-white/20 text-white placeholder-blue-200 focus:outline-none focus:ring-2 focus:ring-blue-400"
                  />
                  <p className="text-xs text-blue-200 mt-1">
                    Get your API key from <a href="https://platform.openai.com/api-keys" target="_blank" rel="noopener noreferrer" className="text-yellow-400 hover:text-yellow-300 underline">OpenAI Platform</a>
                  </p>
                </div>
                <div className="flex gap-4 items-end">
                  <textarea
                    value={userMessage}
                    onChange={(e) => setUserMessage(e.target.value)}
                    placeholder="Enter your message..."
                    className="flex-1 px-4 py-3 rounded-lg border-0 bg-white/20 text-white placeholder-blue-200 focus:outline-none focus:ring-2 focus:ring-blue-400 resize-none min-h-[48px] max-h-32"
                    onKeyPress={(e) => e.key === 'Enter' && !e.shiftKey && testChat()}
                    rows={1}
                    style={{ height: 'auto' }}
                    onInput={(e) => {
                      e.currentTarget.style.height = 'auto';
                      e.currentTarget.style.height = e.currentTarget.scrollHeight + 'px';
                    }}
                  />
                  <button
                    onClick={chatMode === 'rag' ? ragChat : testChat}
                    disabled={isLoading}
                    className="px-6 py-3 bg-green-500 hover:bg-green-600 disabled:bg-gray-500 rounded-full font-medium transition-colors flex-shrink-0"
                  >
                    {isLoading ? 'Sending...' : 'Send Message'}
                  </button>
                </div>
              </div>

              {chatResponse && (
                <div className="bg-black/20 p-4 rounded-lg">
                  <h3 className="font-semibold mb-2">Response:</h3>
                  <pre className="whitespace-pre-wrap font-mono text-sm overflow-x-auto">
                    {chatResponse}
                  </pre>
                </div>
              )}
            </div>
          </div>

          {/* Footer */}
          <div className="text-center mt-8 text-blue-200">
            <p>Built with Next.js and deployed on Vercel</p>
            <p className="text-sm mt-2">
              🚀 Part of the AI Engineer Challenge by{' '}
              <a 
                href="https://github.com/AI-Maker-Space/The-AI-Engineer-Challenge" 
          target="_blank"
          rel="noopener noreferrer"
                className="text-yellow-400 hover:text-yellow-300 underline"
              >
                AI Makerspace
              </a>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
