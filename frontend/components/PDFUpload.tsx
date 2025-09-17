import { useState } from 'react';
import { Upload, Check, AlertCircle } from 'lucide-react';

interface PDFUploadProps {
  apiKey: string;
  onUploadSuccess: () => void;
}

export default function PDFUpload({ apiKey, onUploadSuccess }: PDFUploadProps) {
  const [isUploading, setIsUploading] = useState(false);
  const [uploadStatus, setUploadStatus] = useState<'idle' | 'success' | 'error'>('idle');
  const [errorMessage, setErrorMessage] = useState('');

  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    // Check if file is PDF
    if (file.type !== 'application/pdf') {
      setErrorMessage('Please upload a PDF file');
      setUploadStatus('error');
      return;
    }

    setIsUploading(true);
    setUploadStatus('idle');
    setErrorMessage('');

    const formData = new FormData();
    formData.append('file', file);

    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000'}/api/upload-pdf?api_key=${apiKey}`,
        {
          method: 'POST',
          body: formData,
        }
      );

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.detail || 'Failed to upload PDF');
      }

      setUploadStatus('success');
      onUploadSuccess();
    } catch (error) {
      console.error('Upload error:', error);
      setUploadStatus('error');
      setErrorMessage(error instanceof Error ? error.message : 'Failed to upload PDF');
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <div className="p-4 border border-border rounded-lg bg-card">
      <div className="flex items-center justify-between mb-4">
        <h3 className="font-semibold">Upload PDF</h3>
        {uploadStatus === 'success' && (
          <div className="flex items-center text-green-500">
            <Check className="w-4 h-4 mr-1" />
            <span className="text-sm">PDF uploaded successfully</span>
          </div>
        )}
        {uploadStatus === 'error' && (
          <div className="flex items-center text-red-500">
            <AlertCircle className="w-4 h-4 mr-1" />
            <span className="text-sm">{errorMessage}</span>
          </div>
        )}
      </div>

      <label className="flex flex-col items-center justify-center w-full h-32 border-2 border-dashed border-border rounded-lg cursor-pointer hover:bg-accent/50 transition-colors">
        <div className="flex flex-col items-center justify-center pt-5 pb-6">
          <Upload className={`w-8 h-8 mb-2 ${isUploading ? 'animate-bounce' : ''}`} />
          <p className="mb-2 text-sm">
            <span className="font-semibold">Click to upload</span> or drag and drop
          </p>
          <p className="text-xs text-muted-foreground">PDF files only</p>
        </div>
        <input
          type="file"
          className="hidden"
          accept=".pdf"
          onChange={handleFileUpload}
          disabled={isUploading}
        />
      </label>
    </div>
  );
}
