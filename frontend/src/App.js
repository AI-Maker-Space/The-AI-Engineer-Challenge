import React, { useState } from 'react';
import { Toaster } from 'react-hot-toast';
import { ThemeProvider } from './contexts/ThemeContext';
import TabNavigation from './components/TabNavigation';
import PRDGenerator from './components/PRDGenerator';
import ReleaseAgent from './components/ReleaseAgent';
import DataPromoAgent from './components/DataPromoAgent';
import './themes.css';
import './App.css';

function App() {
  const [activeTab, setActiveTab] = useState('prd-generator');

  const renderActiveTab = () => {
    switch (activeTab) {
      case 'prd-generator':
        return <PRDGenerator />;
      case 'release-agent':
        return <ReleaseAgent />;
      case 'data-promo-agent':
        return <DataPromoAgent />;
      default:
        return <PRDGenerator />;
    }
  };

  return (
    <ThemeProvider>
      <div className="App">
        <Toaster 
          position="top-right" 
          toastOptions={{
            style: {
              background: 'var(--color-bg-elevated)',
              color: 'var(--color-text-primary)',
              border: '1px solid var(--color-border-primary)'
            }
          }}
        />
        <TabNavigation activeTab={activeTab} onTabChange={setActiveTab} />
        <div className="tab-content-container">
          {renderActiveTab()}
        </div>
      </div>
    </ThemeProvider>
  );
}

export default App; 