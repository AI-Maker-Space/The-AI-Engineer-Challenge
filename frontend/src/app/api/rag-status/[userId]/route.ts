import { NextRequest, NextResponse } from 'next/server';
import { getEmbeddingsCount } from '../../../../../lib/db';

export async function GET(
  request: NextRequest,
  context: { params: Promise<{ userId: string }> }
) {
  try {
    const { userId } = await context.params;
    
    // Check if we have any embeddings in the database
    const embeddingsCount = getEmbeddingsCount();
    
    return NextResponse.json({
      hasIndex: embeddingsCount > 0,
      documentsCount: embeddingsCount,
      status: embeddingsCount > 0 ? "ready" : "empty",
      message: embeddingsCount > 0 
        ? `RAG system ready with ${embeddingsCount} document chunks`
        : "No documents indexed yet. Upload PDFs to get started."
    });
    
  } catch (error) {
    console.error('RAG Status API error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
