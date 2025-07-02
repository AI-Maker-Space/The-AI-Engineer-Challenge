export interface Document {
  id: string;
  filename: string;
  size: number;
  pages: number;
  upload_date: string;
  chunks_count: number;
  status: string;
}

export interface DocumentList {
  documents: Document[];
}

export interface UploadResponse {
  success: boolean;
  document_id?: string;
  message: string;
  status: string;
}

export interface DocumentDelete {
  success: boolean;
  message: string;
}

export interface RagChatRequest {
  user_message: string;
  model?: string;
  api_key: string;
  document_id: string;
  k_chunks?: number;
}

export interface DocumentChunk {
  content: string;
  page: number;
  chunk_index: number;
  similarity_score: number;
}