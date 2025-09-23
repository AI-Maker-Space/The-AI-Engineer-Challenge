import { NextRequest, NextResponse } from 'next/server';
import { getKidById } from '../../../../lib/db';

/**
 * Get Kid by ID API Endpoint
 * GET /api/kids/[kidId]
 * 
 * Returns kid information for the reading page
 */

export async function GET(
  request: NextRequest,
  context: { params: { kidId: string } }
) {
  try {
    const { kidId } = context.params;
    const kidIdNum = parseInt(kidId);
    
    if (isNaN(kidIdNum)) {
      return NextResponse.json(
        { error: 'Invalid kid ID' },
        { status: 400 }
      );
    }

    const kid = getKidById(kidIdNum);
    
    if (!kid) {
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
