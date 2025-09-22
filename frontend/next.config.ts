import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  async rewrites() {
    return [
      // Only proxy original chat/RAG routes to FastAPI
      {
        source: '/api/chat',
        destination: 'http://127.0.0.1:8000/api/chat',
      },
      {
        source: '/api/rag-chat',
        destination: 'http://127.0.0.1:8000/api/rag-chat',
      },
      {
        source: '/api/upload-pdf',
        destination: 'http://127.0.0.1:8000/api/upload-pdf',
      },
      {
        source: '/api/rag-status/:path*',
        destination: 'http://127.0.0.1:8000/api/rag-status/:path*',
      },
      {
        source: '/api/conversations/:path*',
        destination: 'http://127.0.0.1:8000/api/conversations/:path*',
      },
      // All other /api/* routes (kids, sessions, reports, test, next-session) 
      // will be handled by Next.js API routes
    ];
  },
};

export default nextConfig;
