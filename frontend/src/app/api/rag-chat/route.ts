import { NextResponse } from 'next/server';

export async function POST() {
  return NextResponse.json({
    status: "ok",
    message: "RAG chat is not available on Vercel (FastAPI disabled). Please use Kids Tutor flows instead."
  });
}
