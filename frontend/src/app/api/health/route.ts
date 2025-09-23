/**
 * Health Check API Route
 * Provides system status including database and embeddings
 */

import { NextResponse } from 'next/server';
import { getDatabaseStats, getEmbeddingsCount } from '../../../../lib/db';

export async function GET() {
  const availableEndpoints = [
    '/api/health',
    '/api/kids/login',
    '/api/kids/[kidId]',
    '/api/reports/[kidId]',
    '/api/upload-pdf',
    '/api/reindex',
    '/api/next-session',
    '/api/start-session',
    '/api/quiz',
    '/api/endpoints'
  ];

  console.log('🚀 Kids Science Tutor API - Available Endpoints:');
  availableEndpoints.forEach(endpoint => console.log(`  ✅ ${endpoint}`));

  try {
    const dbStats = getDatabaseStats();
    const embeddingsCount = getEmbeddingsCount();
    
    return NextResponse.json({
      status: 'ok',
      message: 'Kids Science Tutor API is running',
      timestamp: new Date().toISOString(),
      availableEndpoints: availableEndpoints,
      database: {
        status: 'connected',
        stats: dbStats
      },
      embeddings: {
        status: embeddingsCount > 0 ? 'ready' : 'empty',
        count: embeddingsCount
      },
      environment: {
        node_env: process.env.NODE_ENV || 'development',
        has_openai_key: !!process.env.OPENAI_API_KEY
      }
    });
    
  } catch (error) {
    console.error('❌ Health check error:', error);
    return NextResponse.json(
      { 
        status: 'error',
        error: error instanceof Error ? error.message : 'Unknown error',
        availableEndpoints: availableEndpoints
      },
      { status: 500 }
    );
  }
}