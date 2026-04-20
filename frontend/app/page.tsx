'use client';

import ChatInterface from '@/components/ChatInterface';

export default function Home() {
  return (
    <main>
      <div className="background-gradient"></div>
      <div className="background-glow"></div>
      <div className="gradient-wash"></div>
      <div className="gradient-wave"></div>
      <div className="container">
        <ChatInterface />
      </div>
    </main>
  );
}

