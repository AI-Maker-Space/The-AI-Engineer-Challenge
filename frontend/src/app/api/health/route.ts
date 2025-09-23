/**
 * Health Check API Route
 * Provides system status including database and embeddings
 */

import { NextResponse } from 'next/server';
import { getDatabaseStats, getEmbeddingsCount } from '../../../../lib/db';

export async function GET() {
  try {
    const dbStats = getDatabaseStats();
    const embeddingsCount = getEmbeddingsCount();
    
    return NextResponse.json({
      status: 'ok',
      timestamp: new Date().toISOString(),
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
    console.error('Health check error:', error);
    return NextResponse.json(
      { 
        status: 'error',
        error: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
}