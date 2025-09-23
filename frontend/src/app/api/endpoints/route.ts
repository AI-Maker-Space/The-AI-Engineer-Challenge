import { NextResponse } from 'next/server';

export async function GET() {
  const endpoints = [
    { path: '/api/health', method: 'GET', description: 'Health check endpoint' },
    { path: '/api/kids/login', method: 'POST', description: 'Kids login authentication' },
    { path: '/api/kids/[kidId]', method: 'GET', description: 'Get kid details by ID' },
    { path: '/api/reports/[kidId]', method: 'GET', description: 'Get kid progress report' },
    { path: '/api/upload-pdf', method: 'POST', description: 'Upload PDF files' },
    { path: '/api/reindex', method: 'POST', description: 'Rebuild vector database' },
    { path: '/api/next-session', method: 'POST', description: 'Get next reading session' },
    { path: '/api/start-session', method: 'POST', description: 'Start reading session' },
    { path: '/api/quiz', method: 'POST', description: 'Submit quiz answers' },
    { path: '/api/endpoints', method: 'GET', description: 'List all available API endpoints' }
  ];

  return NextResponse.json({
    message: 'Kids Science Tutor API - Available Endpoints',
    total: endpoints.length,
    endpoints: endpoints
  });
}
