/**
 * Embeddings Helper Functions
 * Provides utilities for generating embeddings and storing them in SQLite
 */

import { storeEmbedding, searchEmbeddings } from '../../lib/db';

// OpenAI API configuration
const OPENAI_API_URL = 'https://api.openai.com/v1/embeddings';
const EMBEDDING_MODEL = 'text-embedding-3-small';

/**
 * Generate embedding vector for given text using OpenAI API
 */
export async function generateEmbedding(text: string, apiKey: string): Promise<number[]> {
  try {
    const response = await fetch(OPENAI_API_URL, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${apiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: EMBEDDING_MODEL,
        input: text.trim(),
      }),
    });

    if (!response.ok) {
      throw new Error(`OpenAI API error: ${response.status} ${response.statusText}`);
    }

    const data = await response.json();
    return data.data[0].embedding;
  } catch (error) {
    console.error('Error generating embedding:', error);
    throw error;
  }
}

/**
 * Split text into chunks for embedding
 */
export function splitTextIntoChunks(text: string, chunkSize: number = 1000, overlap: number = 100): string[] {
  const words = text.split(/\s+/);
  const chunks: string[] = [];
  
  for (let i = 0; i < words.length; i += chunkSize - overlap) {
    const chunk = words.slice(i, i + chunkSize).join(' ');
    if (chunk.trim()) {
      chunks.push(chunk.trim());
    }
  }
  
  return chunks;
}

/**
 * Process and store embeddings for a PDF
 */
export async function embedPDF(
  pdfMetadataId: number,
  content: string,
  apiKey: string,
  metadata?: any
): Promise<void> {
  const chunks = splitTextIntoChunks(content);
  
  for (let i = 0; i < chunks.length; i++) {
    const chunk = chunks[i];
    const embedding = await generateEmbedding(chunk, apiKey);
    
    storeEmbedding(pdfMetadataId, i, chunk, embedding);
  }
  
  console.log(`✅ Embedded ${chunks.length} chunks for PDF metadata ID: ${pdfMetadataId}`);
}

/**
 * Search for relevant content using semantic similarity
 */
export async function searchForRelevantContent(
  query: string,
  apiKey: string,
  limit: number = 5,
  pdfId?: string
): Promise<Array<{content: string, pdf_id: string, similarity: number, metadata?: any}>> {
  const queryEmbedding = await generateEmbedding(query, apiKey);
  const results = searchEmbeddings(queryEmbedding, limit);
  
  // Transform PDFEmbedding[] to the expected format
  return results.map(embedding => ({
    content: embedding.content,
    pdf_id: embedding.pdf_id.toString(),
    similarity: 0.8, // Placeholder similarity score
    metadata: {}
  }));
}