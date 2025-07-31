import React, { useCallback } from 'react';
import { useDropzone } from 'react-dropzone';
import { Upload, FileText, Loader2, Gift, AlertCircle } from 'lucide-react';
import './FileUpload.css';

const FileUpload = ({ onFileUpload, loading, usageInfo, serviceAvailable }) => {

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
    disabled: loading // Only disable during loading
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
        subtitle: "AI is analyzing your document and generating test cases"
      };
    }
    
    if (isDragActive) {
      return {
        title: "Drop your PRD file here",
        subtitle: "Ready to transform into comprehensive test cases"
      };
    }
    
    if (usageInfo?.remaining_today > 0) {
      return {
        title: "Upload your PRD file",
        subtitle: `${usageInfo.remaining_today} free uses remaining today`
      };
    } else if (usageInfo?.remaining_today === 0) {
      return {
        title: "Daily limit reached",
        subtitle: "Come back tomorrow for more free uses"
      };
    } else {
      return {
        title: "Upload your PRD file",
        subtitle: "Free AI-powered test case generation"
      };
    }
  };

  const message = getUploadMessage();

  return (
    <div className="file-upload-section">
      <div 
        {...getRootProps()} 
        className={`file-upload-area ${isDragActive ? 'drag-active' : ''} ${loading ? 'loading' : ''} service-tier`}
      >
        <input {...getInputProps()} />
        
        <div className="upload-content">
          <div className="upload-icon">
            {getFileIcon()}
            {!loading && (
              <div className="tier-indicator">
                <Gift size={20} />
              </div>
            )}
          </div>
          
          <div className="upload-text">
            <h3>{message.title}</h3>
            <p>
              {message.subtitle}<br />
              <span className="file-types">PDF, JPEG, JPG, PNG files supported</span>
            </p>
          </div>
        </div>
      </div>

      {!loading && (
        <div className="upload-tips">
          <h4>💡 Tips for better results:</h4>
          <ul>
            <li>Ensure your PRD has clear, readable text</li>
            <li>Include functional requirements and user stories</li>
            <li>Higher resolution images work better for text extraction</li>
            <li>PDFs with selectable text provide the best results</li>
          </ul>
          
          <div className="service-info">
            {usageInfo?.remaining_today > 0 ? (
              <div className="usage-reminder">
                <Gift size={16} />
                <span>
                  {usageInfo.remaining_today} of {usageInfo.daily_limit} free uses remaining today
                </span>
              </div>
            ) : usageInfo?.remaining_today === 0 ? (
              <div className="limit-info">
                <AlertCircle size={16} />
                <span>
                  Daily limit reached. Resets tomorrow for more free uses!
                </span>
              </div>
            ) : (
              <div className="service-reminder">
                <Gift size={16} />
                <span>
                  Free AI-powered service • No sign-up required
                </span>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default FileUpload; 