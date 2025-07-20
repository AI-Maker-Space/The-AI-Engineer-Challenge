'use client';

import { useState, useRef, useEffect } from 'react';

interface PdfUploadResponse {
  pdf_id: string;
  filename: string;
  chunks: number;
  message: string;
}

interface PdfInfo {
  pdf_id: string;
  filename: string;
  chunks: number;
}

interface PdfUploadRAGProps {
  onPdfSelect: (pdfId: string) => void;
  selectedPdfId: string | null;
}

export default function PdfUploadRAG({ onPdfSelect, selectedPdfId }: PdfUploadRAGProps) {
  const [isUploading, setIsUploading] = useState(false);
  const [uploadResult, setUploadResult] = useState<PdfUploadResponse | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [uploadedPdfs, setUploadedPdfs] = useState<PdfInfo[]>([]);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Load uploaded PDFs on component mount
  useEffect(() => {
    loadUploadedPdfs();
  }, []);

  const loadUploadedPdfs = async () => {
    try {
      const response = await fetch('https://the-ai-engineer-challenge-six.vercel.app/api/pdfs');
      if (response.ok) {
        const data = await response.json();
        setUploadedPdfs(data.pdfs);
        if (data.pdfs.length > 0 && !selectedPdfId) {
          onPdfSelect(data.pdfs[0].pdf_id);
        }
      }
    } catch (err) {
      console.error('Error loading PDFs:', err);
    }
  };

  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    // Validate file type
    if (!file.name.toLowerCase().endsWith('.pdf')) {
      setError('Please select a PDF file');
      return;
    }

    // Validate file size (max 10MB)
    if (file.size > 10 * 1024 * 1024) {
      setError('File size must be less than 10MB');
      return;
    }

    setIsUploading(true);
    setError(null);
    setUploadResult(null);

    try {
      const formData = new FormData();
      formData.append('file', file);

      const response = await fetch('https://the-ai-engineer-challenge-six.vercel.app/api/upload-pdf-rag', {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.detail || 'Failed to upload PDF');
      }

      const result: PdfUploadResponse = await response.json();
      setUploadResult(result);
      onPdfSelect(result.pdf_id);
      
      // Reload the list of uploaded PDFs
      await loadUploadedPdfs();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred while uploading the PDF');
    } finally {
      setIsUploading(false);
    }
  };

  const handleDrop = async (event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    const files = event.dataTransfer.files;
    if (files.length > 0) {
      const file = files[0];
      if (fileInputRef.current) {
        fileInputRef.current.files = files;
        await handleFileUpload({ target: { files } } as React.ChangeEvent<HTMLInputElement>);
      }
    }
  };

  const handleDragOver = (event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault();
  };

  const clearResult = () => {
    setUploadResult(null);
    setError(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  return (
    <div className="w-full max-w-4xl mx-auto bg-white rounded-lg shadow-lg p-6">
      <h2 className="text-2xl font-bold text-gray-900 mb-6"> Job Description Evaluation</h2>
      {/* Upload/Select Job Description */}
      <div className="mb-8">
        <h3 className="text-lg font-medium text-gray-900 mb-2">Upload or Select Job Description PDF</h3>
        {/* Reuse upload area, but for job description */}
        <div
          className={`border-2 border-dashed rounded-lg p-8 text-center transition-colors ${
            isUploading 
              ? 'border-blue-400 bg-blue-50' 
              : 'border-gray-300 hover:border-gray-400'
          }`}
          onDrop={handleDrop}
          onDragOver={handleDragOver}
        >
          <div className="space-y-4">
            <div className="text-gray-600">
              <svg className="mx-auto h-12 w-12 text-gray-400" stroke="currentColor" fill="none" viewBox="0 0 48 48">
                <path d="M28 8H12a4 4 0 00-4 4v20m32-12v8m0 0v8a4 4 0 01-4 4H12a4 4 0 01-4-4v-4m32-4l-3.172-3.172a4 4 0 00-5.656 0L28 28M8 32l9.172-9.172a4 4 0 015.656 0L28 28m0 0l4 4m4-24h8m-4-4v8m-12 4h.02" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </div>
            
            <div>
              <label htmlFor="file-upload-rag" className="cursor-pointer">
                <span className="text-lg font-medium text-blue-600 hover:text-blue-500">
                  {isUploading ? 'Uploading and Indexing...' : 'Click to upload a PDF'}
                </span>
                <span className="text-gray-500"> or drag and drop</span>
              </label>
              <input
                id="file-upload-rag"
                ref={fileInputRef}
                type="file"
                accept=".pdf"
                onChange={handleFileUpload}
                className="hidden"
                disabled={isUploading}
              />
            </div>
            
            <p className="text-sm text-gray-500">
              PDF files only, max 10MB. Files will be indexed for AI chat.
            </p>
          </div>
        </div>

        {/* Loading State */}
        {isUploading && (
          <div className="mt-6 text-center">
            <div className="inline-flex items-center space-x-2">
              <div className="w-4 h-4 bg-blue-500 rounded-full animate-bounce" />
              <div className="w-4 h-4 bg-blue-500 rounded-full animate-bounce delay-100" />
              <div className="w-4 h-4 bg-blue-500 rounded-full animate-bounce delay-200" />
            </div>
            <p className="mt-2 text-gray-600">Processing and indexing your PDF...</p>
          </div>
        )}

        {/* Error Display */}
        {error && (
          <div className="mt-6 p-4 bg-red-50 border border-red-200 rounded-lg">
            <div className="flex">
              <div className="flex-shrink-0">
                <svg className="h-5 w-5 text-red-400" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                </svg>
              </div>
              <div className="ml-3">
                <p className="text-sm text-red-800">{error}</p>
              </div>
            </div>
          </div>
        )}

        {/* Success Result */}
        {uploadResult && (
          <div className="mt-6 p-4 bg-green-50 border border-green-200 rounded-lg">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <svg className="h-5 w-5 text-green-500" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                </svg>
                <h3 className="text-lg font-medium text-green-900">
                  PDF Indexed Successfully
                </h3>
              </div>
              <button
                onClick={clearResult}
                className="text-sm text-green-600 hover:text-green-800"
              >
                Clear
              </button>
            </div>
            
            <div className="mt-2 text-sm text-green-800">
              <p><strong>Filename:</strong> {uploadResult.filename}</p>
              <p><strong>Chunks Created:</strong> {uploadResult.chunks}</p>
              <p><strong>PDF ID:</strong> {uploadResult.pdf_id}</p>
            </div>
          </div>
        )}

        {/* Uploaded PDFs List */}
        {uploadedPdfs.length > 0 && (
          <div className="mt-6">
            <h3 className="text-lg font-medium text-gray-900 mb-3">Uploaded PDFs</h3>
            <div className="space-y-2">
              {uploadedPdfs.map((pdf) => (
                <div
                  key={pdf.pdf_id}
                  className={`p-3 rounded-lg border cursor-pointer transition-colors ${
                    selectedPdfId === pdf.pdf_id
                      ? 'border-blue-500 bg-blue-50'
                      : 'border-gray-200 hover:border-gray-300'
                  }`}
                  onClick={() => onPdfSelect(pdf.pdf_id)}
                >
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-medium text-gray-900">{pdf.filename}</p>
                      <p className="text-sm text-gray-500">{pdf.chunks} chunks indexed</p>
                    </div>
                    {selectedPdfId === pdf.pdf_id && (
                      <svg className="h-5 w-5 text-blue-500" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                      </svg>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Selected PDF Info */}
        {selectedPdfId && (
          <div className="mt-4 p-4 bg-gray-50 rounded-lg">
            <p className="text-sm text-gray-600">
              <strong>Selected PDF:</strong> {uploadedPdfs.find(p => p.pdf_id === selectedPdfId)?.filename}
            </p>
            <p className="text-sm text-gray-600">
              You can now chat with this PDF using the chat interface below.
            </p>
          </div>
        )}
      </div>
    </div>
  );
} 