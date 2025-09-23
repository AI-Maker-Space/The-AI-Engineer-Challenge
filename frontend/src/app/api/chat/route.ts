import { NextResponse } from 'next/server';

export async function POST() {
  return NextResponse.json({
    status: "ok",
    message: "Chat API is not available. Please use Kids Tutor flows instead."
  });
}
