import { NextRequest, NextResponse } from 'next/server';
import { getKidByNameAndPin, createKid } from '../../../../lib/db';

/**
 * Kids Login API Endpoint
 * POST /api/kids/login
 * 
 * Handles kid authentication:
 * - If kid exists with name/pin, return kid info
 * - If kid doesn't exist, create new kid
 * - Returns kid data and whether it's a new account
 */

interface LoginRequest {
  name: string;
  pin: string;
}

interface LoginResponse {
  kid: {
    id: number;
    name: string;
    createdAt: string;
  };
  isNewKid: boolean;
}

export async function POST(request: NextRequest) {
  try {
    const body: LoginRequest = await request.json();
    const { name, pin } = body;

    // Validation
    if (!name || typeof name !== 'string' || name.trim().length === 0) {
      return NextResponse.json(
        { error: 'Name is required' },
        { status: 400 }
      );
    }

    if (!pin || typeof pin !== 'string' || !/^\d{4}$/.test(pin)) {
      return NextResponse.json(
        { error: 'PIN must be exactly 4 digits' },
        { status: 400 }
      );
    }

    const trimmedName = name.trim();

    // Check if kid already exists
    let existingKid = getKidByNameAndPin(trimmedName, pin);
    
    if (existingKid) {
      // Kid exists, return their info
      const response: LoginResponse = {
        kid: {
          id: existingKid.id,
          name: existingKid.name,
          createdAt: existingKid.createdAt,
        },
        isNewKid: false,
      };

      return NextResponse.json(response);
    }

    // Kid doesn't exist, create new one
    try {
      const newKid = createKid(trimmedName, pin);
      
      const response: LoginResponse = {
        kid: {
          id: newKid.id,
          name: newKid.name,
          createdAt: newKid.createdAt,
        },
        isNewKid: true,
      };

      return NextResponse.json(response, { status: 201 });
      
    } catch (error) {
      // Handle case where kid with same name/pin might have been created by another request
      console.error('Error creating kid:', error);
      
      // Try to get the kid again in case it was just created
      existingKid = getKidByNameAndPin(trimmedName, pin);
      if (existingKid) {
        const response: LoginResponse = {
          kid: {
            id: existingKid.id,
            name: existingKid.name,
            createdAt: existingKid.createdAt,
          },
          isNewKid: false,
        };

        return NextResponse.json(response);
      }

      // If still can't create or find kid, return error
      return NextResponse.json(
        { error: 'Failed to create account. Please try again.' },
        { status: 500 }
      );
    }

  } catch (error) {
    console.error('Login API error:', error);
    return NextResponse.json(
      { error: 'Invalid request format' },
      { status: 400 }
    );
  }
}

// Handle unsupported methods
export async function GET() {
  return NextResponse.json(
    { error: 'Method not allowed' },
    { status: 405 }
  );
}
