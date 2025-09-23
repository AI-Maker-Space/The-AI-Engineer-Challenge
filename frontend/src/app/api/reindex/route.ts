/**
 * Reindex API Route
 * Clears all embeddings and rebuilds them from scratch
 */

import { NextRequest, NextResponse } from 'next/server';
import { clearEmbeddings } from '../../../../lib/db';
import { autoInitializeEmbeddings } from '../../../lib/auto-initialize';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { api_key, confirm } = body;

    if (!api_key) {
      return NextResponse.json(
        { error: 'API key is required' },
        { status: 400 }
      );
    }

    if (!confirm) {
      return NextResponse.json(
        { error: 'Confirmation required - set confirm: true to proceed' },
        { status: 400 }
      );
    }

    console.log('🔄 Starting reindex process...');

    // Clear all existing embeddings
    clearEmbeddings();
    console.log('✅ Cleared all existing embeddings');

    // Set the API key for the auto-initialization process
    process.env.OPENAI_API_KEY = api_key;

    // Reinitialize embeddings
    const result = await autoInitializeEmbeddings();

    if (result.success) {
      return NextResponse.json({
        success: true,
        message: 'Reindex completed successfully',
        details: result
      });
    } else {
      return NextResponse.json(
        { 
          error: 'Reindex failed', 
          details: result.message 
        },
        { status: 500 }
      );
    }

  } catch (error) {
    console.error('Reindex error:', error);
    return NextResponse.json(
      { 
        error: 'Reindex failed', 
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
}