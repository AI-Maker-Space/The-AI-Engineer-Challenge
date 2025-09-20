import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { toast } from 'react-hot-toast';
import FileUpload from './FileUpload';
import TestCaseTable from './TestCaseTable';
import UsageInfo from './UsageInfo';
import PromptingTool from './PromptingTool';
import { FileText } from 'lucide-react';
import './PRDGenerator.css';

const PRDGenerator = () => {
  const [testCases, setTestCases] = useState([]);
  const [loading, setLoading] = useState(false);
  const [hasResults, setHasResults] = useState(false);
  const [usageInfo, setUsageInfo] = useState(null);
  const [serviceAvailable, setServiceAvailable] = useState(false);

  // Check usage info on component mount
  useEffect(() => {
    fetchUsageInfo();
  }, []);

  const fetchUsageInfo = async () => {
    try {
      const response = await axios.get('/api/usage-info');
      setUsageInfo(response.data);
      setServiceAvailable(response.data.service_available);
    } catch (error) {
      console.error('Error fetching usage info:', error);
      // Don't show error to user - backend might not be running yet
    }
  };

  const handleFileUpload = async (file) => {
    setLoading(true);
    const formData = new FormData();
    formData.append('file', file);

    try {
      const response = await axios.post('/api/upload-prd', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      if (response.data.success) {
        setTestCases(response.data.test_cases);
        setHasResults(true);
        setUsageInfo(response.data.usage_info);
        
        // Show success message with usage info
        const message = response.data.usage_info?.message || response.data.message;
        toast.success(message);
        
        // Refresh usage info to update the display
        await fetchUsageInfo();
      } else {
        toast.error('Failed to generate test cases');
      }
    } catch (error) {
      console.error('Error uploading file:', error);
      
      // Handle different error scenarios with helpful messages
      if (error.code === 'ERR_NETWORK' || error.message === 'Network Error') {
        toast.error('❌ Unable to connect to server. Please try again.');
      } else if (error.response?.status === 503) {
        toast.error('⚠️ Service temporarily unavailable. Please try again later.');
      } else if (error.response?.status === 429) {
        toast.error('📊 Daily limit reached! Please try again tomorrow.');
      } else if (error.response?.data?.detail) {
        toast.error(error.response.data.detail);
      } else {
        toast.error('Failed to process the file. Please try again.');
      }
    } finally {
      setLoading(false);
    }
  };

  const handleDownloadCSV = async () => {
    try {
      const response = await axios.post('/api/download-csv', testCases, {
        responseType: 'blob',
      });

      // Create blob link to download
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', 'test_cases.csv');
      document.body.appendChild(link);
      link.click();
      link.remove();
      window.URL.revokeObjectURL(url);
      
      toast.success('CSV file downloaded successfully!');
    } catch (error) {
      console.error('Error downloading CSV:', error);
      toast.error('Failed to download CSV file');
    }
  };

  const handleReset = () => {
    setTestCases([]);
    setHasResults(false);
    fetchUsageInfo(); // Refresh usage info
    toast.success('Ready for new upload');
  };

  return (
    <div className="prd-generator">
      <div className="tab-header">
        <div className="tab-header-icon">
          <FileText size={24} />
        </div>
        <div className="tab-header-content">
          <h2>PRD to Test Case Generator</h2>
          <p>Transform your Product Requirements Documents into comprehensive test cases using AI-powered analysis. Upload PDFs or images and get structured test cases instantly.</p>
          <div className="supported-formats">
            <span className="format-tag">PDF</span>
            <span className="format-tag">JPEG</span>
            <span className="format-tag">JPG</span>
            <span className="format-tag">PNG</span>
          </div>
        </div>
      </div>

      <div className="tab-content">
        {!hasResults ? (
          <div className="upload-section">
            <UsageInfo 
              usageInfo={usageInfo} 
              serviceAvailable={serviceAvailable}
            />
            <FileUpload 
              onFileUpload={handleFileUpload} 
              loading={loading}
              usageInfo={usageInfo}
              serviceAvailable={serviceAvailable}
            />
          </div>
        ) : (
          <div className="results-section">
            <TestCaseTable 
              testCases={testCases} 
              onDownloadCSV={handleDownloadCSV}
              onReset={handleReset}
              usageInfo={usageInfo}
            />
          </div>
        )}
      </div>
      <PromptingTool testCases={testCases} apiKey={usageInfo?.api_key} />
    </div>
  );
};

export default PRDGenerator;
