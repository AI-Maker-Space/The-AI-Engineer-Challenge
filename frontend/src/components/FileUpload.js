import React, { useCallback, useState } from 'react';
import { useDropzone } from 'react-dropzone';
import { Upload, FileText, Image, Loader2 } from 'lucide-react';
import './FileUpload.css';

const FileUpload = ({ onFileUpload, loading, disabled }) => {
  const [dragActive, setDragActive] = useState(false);

  const onDrop = useCallback((acceptedFiles) => {
    if (acceptedFiles && acceptedFiles.length > 0) {
      onFileUpload(acceptedFiles[0]);
    }
  }, [onFileUpload]);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'application/pdf': ['.pdf'],
      'image/jpeg': ['.jpeg', '.jpg'],
      'image/png': ['.png']
    },
    multiple: false,
    disabled: disabled || loading
  });

  const getFileIcon = () => {
    if (loading) {
      return <Loader2 size={48} className="animate-spin" />;
    }
    return isDragActive ? <Upload size={48} /> : <FileText size={48} />;
  };

  return (
    <div className="file-upload-section">
      <div 
        {...getRootProps()} 
        className={`file-upload-area ${isDragActive ? 'drag-active' : ''} ${disabled ? 'disabled' : ''} ${loading ? 'loading' : ''}`}
      >
        <input {...getInputProps()} />
        
        <div className="upload-content">
          <div className="upload-icon">
            {getFileIcon()}
          </div>
          
          {loading ? (
            <div className="upload-text">
              <h3>Processing your PRD...</h3>
              <p>This may take a few moments while AI analyzes your document</p>
            </div>
          ) : (
            <div className="upload-text">
              <h3>
                {isDragActive 
                  ? 'Drop your PRD file here' 
                  : disabled 
                    ? 'Please enter your API key first'
                    : 'Upload your PRD file'
                }
              </h3>
              {!disabled && (
                <p>
                  Drag & drop or click to select<br />
                  <span className="file-types">PDF, JPEG, JPG, PNG files supported</span>
                </p>
              )}
            </div>
          )}
        </div>
      </div>

      {!disabled && !loading && (
        <div className="upload-tips">
          <h4>💡 Tips for better results:</h4>
          <ul>
            <li>Ensure your PRD has clear, readable text</li>
            <li>Include functional requirements and user stories</li>
            <li>Higher resolution images work better for text extraction</li>
            <li>PDFs with selectable text provide the best results</li>
          </ul>
        </div>
      )}
    </div>
  );
};

export default FileUpload; 