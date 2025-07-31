import React, { useCallback, useState } from 'react';
import { useDropzone } from 'react-dropzone';
import { Upload, FileText, Image, Loader2, Gift, Crown } from 'lucide-react';
import './FileUpload.css';

const FileUpload = ({ onFileUpload, loading, disabled, usageInfo, hasUserApiKey }) => {
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

  const getUploadMessage = () => {
    if (loading) {
      return {
        title: "Processing your PRD...",
        subtitle: "This may take a few moments while AI analyzes your document"
      };
    }
    
    if (disabled && !usageInfo?.can_use) {
      return {
        title: "Daily limit reached",
        subtitle: "Please provide your own API key or try again tomorrow"
      };
    }
    
    if (disabled) {
      return {
        title: "Please provide an API key",
        subtitle: "Free tier is currently unavailable"
      };
    }
    
    if (isDragActive) {
      return {
        title: "Drop your PRD file here",
        subtitle: hasUserApiKey ? "Using unlimited tier" : `${usageInfo?.remaining_today || 5} free uses remaining`
      };
    }
    
    return {
      title: "Upload your PRD file",
      subtitle: hasUserApiKey ? "Unlimited usage with your API key" : `${usageInfo?.remaining_today || 5} free uses remaining today`
    };
  };

  const message = getUploadMessage();

  return (
    <div className="file-upload-section">
      <div 
        {...getRootProps()} 
        className={`file-upload-area ${isDragActive ? 'drag-active' : ''} ${disabled ? 'disabled' : ''} ${loading ? 'loading' : ''} ${hasUserApiKey ? 'unlimited' : 'free-tier'}`}
      >
        <input {...getInputProps()} />
        
        <div className="upload-content">
          <div className="upload-icon">
            {getFileIcon()}
            {!loading && (
              <div className="tier-indicator">
                {hasUserApiKey ? <Crown size={20} /> : <Gift size={20} />}
              </div>
            )}
          </div>
          
          <div className="upload-text">
            <h3>{message.title}</h3>
            {!disabled && (
              <p>
                {message.subtitle}<br />
                <span className="file-types">PDF, JPEG, JPG, PNG files supported</span>
              </p>
            )}
          </div>
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
          
          {!hasUserApiKey && usageInfo && (
            <div className="free-tier-reminder">
              <Gift size={16} />
              <span>
                Free tier: {usageInfo.remaining_today} of {usageInfo.daily_limit} uses remaining today
              </span>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default FileUpload; 