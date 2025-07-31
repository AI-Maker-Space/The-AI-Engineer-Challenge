import React from 'react';
import { FileText, Zap } from 'lucide-react';
import './Header.css';

const Header = () => {
  return (
    <header className="header">
      <div className="header-content">
        <div className="header-icon">
          <FileText size={48} />
          <Zap size={24} className="zap-icon" />
        </div>
        <h1 className="header-title">PRD to Test Case Generator</h1>
        <p className="header-description">
          Transform your Product Requirements Documents into comprehensive test cases
          using AI-powered analysis. Upload PDFs or images and get structured test cases instantly.
        </p>
        <div className="supported-formats">
          <span className="format-tag">PDF</span>
          <span className="format-tag">JPEG</span>
          <span className="format-tag">JPG</span>
          <span className="format-tag">PNG</span>
        </div>
      </div>
    </header>
  );
};

export default Header; 