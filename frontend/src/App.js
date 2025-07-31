import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Toaster, toast } from 'react-hot-toast';
import FileUpload from './components/FileUpload';
import TestCaseTable from './components/TestCaseTable';
import Header from './components/Header';
import ApiKeyInput from './components/ApiKeyInput';
import UsageInfo from './components/UsageInfo';
import './App.css';

function App() {
  const [apiKey, setApiKey] = useState('');
  const [testCases, setTestCases] = useState([]);
  const [loading, setLoading] = useState(false);
  const [hasResults, setHasResults] = useState(false);
  const [usageInfo, setUsageInfo] = useState(null);
  const [freeTierAvailable, setFreeTierAvailable] = useState(false);

  // Check usage info on component mount
  useEffect(() => {
    fetchUsageInfo();
  }, []);

  const fetchUsageInfo = async () => {
    try {
      const response = await axios.get('/api/usage-info');
      setUsageInfo(response.data);
      setFreeTierAvailable(response.data.free_tier_available);
    } catch (error) {
      console.error('Error fetching usage info:', error);
    }
  };

  const handleFileUpload = async (file) => {
    // Check if user has API key or if free tier is available
    if (!apiKey.trim() && !freeTierAvailable) {
      toast.error('Please enter your Gemini API key - free tier is currently unavailable');
      return;
    }

    // Check free tier usage before uploading
    if (!apiKey.trim() && usageInfo && !usageInfo.can_use) {
      toast.error(`Daily free limit (${usageInfo.daily_limit}) reached. Please provide your own API key or try again tomorrow.`);
      return;
    }

    setLoading(true);
    const formData = new FormData();
    formData.append('file', file);
    
    // Only send API key if user provided one
    if (apiKey.trim()) {
      formData.append('user_api_key', apiKey);
    }

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
        const message = response.data.usage_info.message || response.data.message;
        toast.success(message);
        
        // Refresh usage info to update the display
        await fetchUsageInfo();
      } else {
        toast.error('Failed to generate test cases');
      }
    } catch (error) {
      console.error('Error uploading file:', error);
      if (error.response?.status === 429) {
        toast.error('Daily free limit reached! Please provide your own API key for unlimited usage.');
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

  const canUpload = freeTierAvailable || apiKey.trim();

  return (
    <div className="App">
      <Toaster position="top-right" />
      <Header />
      
      <div className="container">
        {!hasResults ? (
          <div className="upload-section">
            <UsageInfo 
              usageInfo={usageInfo} 
              freeTierAvailable={freeTierAvailable}
              hasUserApiKey={!!apiKey.trim()}
            />
            <ApiKeyInput 
              apiKey={apiKey} 
              setApiKey={setApiKey}
              freeTierAvailable={freeTierAvailable}
              usageInfo={usageInfo}
            />
            <FileUpload 
              onFileUpload={handleFileUpload} 
              loading={loading}
              disabled={!canUpload}
              usageInfo={usageInfo}
              hasUserApiKey={!!apiKey.trim()}
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
    </div>
  );
}

export default App; 