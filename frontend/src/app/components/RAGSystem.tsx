'use client';

import { useState } from 'react';
import PdfUploadRAG from './PdfUploadRAG';
import RAGChat from './RAGChat';

export default function RAGSystem() {
  const [selectedPdfId, setSelectedPdfId] = useState<string | null>(null);

  const handlePdfSelect = (pdfId: string) => {
    setSelectedPdfId(pdfId);
  };

  return (
    <div className="w-full max-w-7xl mx-auto space-y-8">
      {/* PDF Upload Section */}
      <PdfUploadRAG onPdfSelect={handlePdfSelect} selectedPdfId={selectedPdfId} />
      
      {/* RAG Chat Section */}
      <div className="flex justify-center">
        <RAGChat selectedPdfId={selectedPdfId} />
      </div>
    </div>
  );
} 