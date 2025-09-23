import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    
    // For Vercel deployment, return a simple response indicating this is a demo
    // In a full production setup, you would implement the actual chat logic here
    return NextResponse.json({
      message: "Chat functionality is available in the Kids Tutor section. This endpoint is for development/demo purposes only.",
      status: "demo_mode",
      suggestion: "Try the Kids Login at /login or Parent Reports at /report/1"
    });
    
  } catch (error) {
    console.error('Chat API error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
