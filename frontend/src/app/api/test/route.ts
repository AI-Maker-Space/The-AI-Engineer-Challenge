import { NextRequest, NextResponse } from 'next/server';

export async function GET() {
  try {
    // Test if we can import the db module
    const { initializeDatabase, getDatabaseStats } = await import('../../../lib/db');
    
    // Initialize database
    initializeDatabase();
    
    // Get stats
    const stats = getDatabaseStats();
    
    return NextResponse.json({ 
      success: true, 
      message: 'Database connection working',
      stats 
    });
  } catch (error) {
    return NextResponse.json({ 
      success: false, 
      error: error instanceof Error ? error.message : 'Unknown error',
      stack: error instanceof Error ? error.stack : undefined
    });
  }
}
