/**
 * PDF Upload API Route
 * Handles PDF uploads, text extraction, metadata storage, and embedding generation
 */

import { NextRequest, NextResponse } from 'next/server';
import { insertPDFMetadata } from '../../../../lib/db';
import { embedPDF } from '../../../lib/embeddings';

// PDF text extraction using pdf-parse
async function extractTextFromPDF(buffer: Buffer): Promise<string> {
  try {
    // Dynamic import for pdf-parse (Node.js only)
    const pdfParse = (await import('pdf-parse')).default;
    const data = await pdfParse(buffer);
    return data.text;
  } catch (error) {
    console.error('PDF text extraction error:', error);
    // Fallback to basic extraction
    try {
      const text = buffer.toString('utf8');
      return text.replace(/[^\x20-\x7E\n]/g, ' ').trim();
    } catch {
      return '';
    }
  }
}

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    const file = formData.get('file') as File;
    const apiKey = formData.get('api_key') as string;
    const userType = formData.get('user_type') as string || 'parent'; // parent or system

    if (!file) {
      return NextResponse.json(
        { error: 'No file provided' },
        { status: 400 }
      );
    }

    if (!apiKey) {
      return NextResponse.json(
        { error: 'No API key provided' },
        { status: 400 }
      );
    }

    if (!file.name.toLowerCase().endsWith('.pdf')) {
      return NextResponse.json(
        { error: 'File must be a PDF' },
        { status: 400 }
      );
    }

    // Generate unique filename (for database reference only)
    const timestamp = Date.now();
    const originalName = file.name.replace(/[^a-zA-Z0-9.-]/g, '_');
    const filename = `${timestamp}_${originalName}`;

    // Process file in memory (no filesystem writes on Vercel)
    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    // Extract text content
    const content = await extractTextFromPDF(buffer);
    
    if (!content || content.length < 50) {
      return NextResponse.json(
        { error: 'Could not extract readable text from PDF' },
        { status: 400 }
      );
    }

    // Prepare metadata
    const metadata = {
      filename,
      title: file.name.replace('.pdf', ''),
      topic: 'Uploaded Content',
      subtopic: null,
      gradeLevel: 'Mixed',
      sourceReferences: JSON.stringify([
        `Uploaded by ${userType}`,
        `Original filename: ${file.name}`,
        `Upload date: ${new Date().toISOString()}`
      ]),
      modelUsed: null,
      contentApproach: `${userType}-uploaded content`,
      totalLines: content.split('\n').length,
      fileSize: buffer.length
    };

    // Store metadata in database FIRST (required for foreign key)
    console.log(`📝 Inserting metadata for: ${filename}`);
    console.log(`📝 Metadata object:`, metadata);
    
    let savedMetadata;
    try {
      savedMetadata = insertPDFMetadata(metadata);
      console.log(`✅ Metadata inserted with ID: ${savedMetadata.id}, filename: ${savedMetadata.filename}`);
    } catch (metadataError) {
      console.error(`❌ Metadata insertion failed:`, metadataError);
      throw new Error(`Metadata insertion failed: ${metadataError}`);
    }

    // Generate and store embeddings (using the metadata ID as pdf_id)
    console.log(`🔄 Starting embedding process for metadata ID: ${savedMetadata.id}`);
    await embedPDF(savedMetadata.id, content, apiKey, {
      source: userType === 'parent' ? 'parent-uploaded' : 'system-uploaded',
      upload_date: new Date().toISOString(),
      original_filename: file.name,
      file_size: buffer.length
    });
    console.log(`✅ Embeddings completed for metadata ID: ${savedMetadata.id}`);

    return NextResponse.json({
      success: true,
      message: 'PDF uploaded and embedded successfully',
      filename,
      metadata: savedMetadata,
      content_length: content.length,
      chunks_created: Math.ceil(content.length / 1000) // Approximate chunk count
    });

  } catch (error) {
    console.error('PDF upload error:', error);
    return NextResponse.json(
      { 
        error: 'Upload failed', 
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
}