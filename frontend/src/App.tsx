import React from 'react';
import './App.css';
import ChatInterface from './components/ChatInterface';

function App() {
  return (
    <div className="App">
      <header className="App-header">
        <h1>AI Engineer Challenge Chat</h1>
        <p>Interactive chat interface powered by OpenAI GPT models</p>
      </header>
      <main>
        <ChatInterface />
      </main>
    </div>
  );
}

export default App;
