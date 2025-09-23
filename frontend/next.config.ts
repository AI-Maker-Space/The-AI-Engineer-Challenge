import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // For Vercel deployment: use only Next.js API routes
  // For local development with FastAPI backend, uncomment the rewrites below
  
  // async rewrites() {
  //   return [
  //     // Only proxy original chat/RAG routes to FastAPI (for local development)
  //     {
  //       source: '/api/chat',
  //       destination: 'http://127.0.0.1:8000/api/chat',
  //     },
  //     {
  //       source: '/api/rag-chat', 
  //       destination: 'http://127.0.0.1:8000/api/rag-chat',
  //     },
  //   ];
  // },
};

export default nextConfig;
