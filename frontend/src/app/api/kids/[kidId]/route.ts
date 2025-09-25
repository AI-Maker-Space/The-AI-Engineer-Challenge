import { NextRequest, NextResponse } from 'next/server';
import { getKidById } from '@/lib/db';

/**
 * Get Kid by ID API Endpoint
 * GET /api/kids/[kidId]
 * 
 * Returns kid information for the reading page
 */

export async function GET(
  request: NextRequest,
  context: { params: Promise<{ kidId: string }> }
) {
  try {
    console.log('[API] /api/kids/[kidId] called');
    const { kidId } = await context.params;
    const kidIdNum = parseInt(kidId);
    
    console.log(`[API] kidId=${kidId}, kidIdNum=${kidIdNum}`);
    
    if (isNaN(kidIdNum)) {
      return NextResponse.json(
        { error: 'Invalid kid ID' },
        { status: 400 }
      );
    }

    console.log(`[API] getKidById called with kidIdNum=${kidIdNum}`);
    const kid = getKidById(kidIdNum);
    console.log(`[API] getKidById returned:`, kid);
    
    if (!kid) {
      console.log(`[API] Kid not found for id=${kidIdNum}`);
      return NextResponse.json(
        { error: 'Kid not found' },
        { status: 404 }
      );
    }

    // Return kid data (excluding PIN for security)
    const response = {
      id: kid.id,
      name: kid.name,
      createdAt: kid.createdAt,
    };

    return NextResponse.json(response);

  } catch (error) {
    console.error('Get kid API error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
