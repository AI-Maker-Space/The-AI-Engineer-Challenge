import React, { useState, useEffect } from 'react';
import { Document } from '../types/document';

interface DocumentListProps {
  selectedDocumentId: string | null;
  onDocumentSelect: (documentId: string) => void;
  onDocumentDelete: (documentId: string) => void;
}

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';

export default function DocumentList({
  selectedDocumentId,
  onDocumentSelect,
  onDocumentDelete
}: DocumentListProps) {
  const [documents, setDocuments] = useState<Document[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchDocuments = async () => {
    try {
      setLoading(true);
      const response = await fetch(`${API_BASE_URL}/api/documents`);

      if (!response.ok) {
        throw new Error('Failed to fetch documents');
      }

      const data = await response.json();
      setDocuments(data.documents || []);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load documents');
    } finally {
      setLoading(false);
    }
  };

  const deleteDocument = async (documentId: string) => {
    try {
      const response = await fetch(`${API_BASE_URL}/api/documents/${documentId}`, {
        method: 'DELETE',
      });

      if (!response.ok) {
        throw new Error('Failed to delete document');
      }

      // Remove from local state
      setDocuments(prev => prev.filter(doc => doc.id !== documentId));

      // If this was the selected document, clear selection
      if (selectedDocumentId === documentId) {
        onDocumentSelect('');
      }

      onDocumentDelete(documentId);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to delete document');
    }
  };

  const formatFileSize = (bytes: number): string => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const formatDate = (dateString: string): string => {
    return new Date(dateString).toLocaleDateString();
  };

  useEffect(() => {
    fetchDocuments();
  }, []);

  if (loading) {
    return (
      <div className="p-4">
        <div className="text-sm text-gray-500">Loading documents...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-4">
        <div className="text-sm text-red-500">Error: {error}</div>
        <button
          onClick={fetchDocuments}
          className="mt-2 text-sm text-olive-600 hover:text-olive-500"
        >
          Retry
        </button>
      </div>
    );
  }

  if (documents.length === 0) {
    return (
      <div className="p-4">
        <div className="text-sm text-gray-500 text-center">
          No documents uploaded yet
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-2">
      <h3 className="text-sm font-medium text-gray-700 mb-3">Uploaded Documents</h3>
      {documents.map((doc) => (
        <div
          key={doc.id}
          className={`p-3 rounded-lg border cursor-pointer transition-colors ${
            selectedDocumentId === doc.id
              ? 'border-olive-400 bg-olive-50'
              : 'border-gray-200 hover:border-gray-300'
          }`}
          onClick={() => onDocumentSelect(doc.id)}
        >
          <div className="flex justify-between items-start">
            <div className="flex-1 min-w-0">
              <div className="flex items-center space-x-2">
                <svg
                  className="w-4 h-4 text-red-500 flex-shrink-0"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path
                    fillRule="evenodd"
                    d="M4 4a2 2 0 012-2h4.586A2 2 0 0112 2.586L15.414 6A2 2 0 0116 7.414V16a2 2 0 01-2 2H6a2 2 0 01-2-2V4z"
                    clipRule="evenodd"
                  />
                </svg>
                <div className="text-sm font-medium text-gray-900 truncate">
                  {doc.filename}
                </div>
              </div>
              <div className="mt-1 text-xs text-gray-500 space-y-1">
                <div>{formatFileSize(doc.size)} • {doc.pages} pages • {doc.chunks_count} chunks</div>
                <div>Uploaded: {formatDate(doc.upload_date)}</div>
              </div>
            </div>
            <button
              onClick={(e) => {
                e.stopPropagation();
                deleteDocument(doc.id);
              }}
              className="ml-2 p-1 text-gray-400 hover:text-red-500 transition-colors"
              title="Delete document"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                />
              </svg>
            </button>
          </div>
        </div>
      ))}
    </div>
  );
}