import React, { useState } from 'react';
import axios from 'axios';
import { Toaster, toast } from 'react-hot-toast';
import FileUpload from './components/FileUpload';
import TestCaseTable from './components/TestCaseTable';
import Header from './components/Header';
import ApiKeyInput from './components/ApiKeyInput';
import './App.css';

function App() {
  const [apiKey, setApiKey] = useState('');
  const [testCases, setTestCases] = useState([]);
  const [loading, setLoading] = useState(false);
  const [hasResults, setHasResults] = useState(false);

  const handleFileUpload = async (file) => {
    if (!apiKey.trim()) {
      toast.error('Please enter your Gemini API key first');
      return;
    }

    setLoading(true);
    const formData = new FormData();
    formData.append('file', file);
    formData.append('gemini_api_key', apiKey);

    try {
      const response = await axios.post('/api/upload-prd', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      if (response.data.success) {
        setTestCases(response.data.test_cases);
        setHasResults(true);
        toast.success(response.data.message);
      } else {
        toast.error('Failed to generate test cases');
      }
    } catch (error) {
      console.error('Error uploading file:', error);
      if (error.response?.data?.detail) {
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
    toast.success('Ready for new upload');
  };

  return (
    <div className="App">
      <Toaster position="top-right" />
      <Header />
      
      <div className="container">
        {!hasResults ? (
          <div className="upload-section">
            <ApiKeyInput apiKey={apiKey} setApiKey={setApiKey} />
            <FileUpload 
              onFileUpload={handleFileUpload} 
              loading={loading}
              disabled={!apiKey.trim()}
            />
          </div>
        ) : (
          <div className="results-section">
            <TestCaseTable 
              testCases={testCases} 
              onDownloadCSV={handleDownloadCSV}
              onReset={handleReset}
            />
          </div>
        )}
      </div>
    </div>
  );
}

export default App; 