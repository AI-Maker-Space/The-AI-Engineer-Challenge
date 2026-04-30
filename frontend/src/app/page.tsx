import Chat from './components/Chat';
import RAGSystem from './components/RAGSystem';

export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-gray-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="text-center mb-8">
          <h1 className="text-4xl tracking-tight font-extrabold text-gray-900 sm:text-5xl md:text-6xl">
            <span className="block text-primary">Job Prep AI</span>
          </h1>
          <p className="mt-3 max-w-md mx-auto text-base text-gray-500 sm:text-lg md:mt-5 md:text-xl md:max-w-3xl">
            Chat with our AI assistant and upload job descriptions for intelligent analysis and your preparation
          </p>
        </div>
        
        {/* RAG System Section */}
        <div className="mb-12">
          <RAGSystem />
        </div>
        
        {/* Regular Chat Section */}
        <div className="mt-8">
          <Chat />
        </div>
      </div>
    </div>
  )
} 