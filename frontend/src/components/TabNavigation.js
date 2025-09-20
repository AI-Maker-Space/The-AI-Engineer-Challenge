import React from 'react';
import { FileText, GitBranch, Database, Zap } from 'lucide-react';
import ThemeToggle from './ThemeToggle';
import './TabNavigation.css';

const TabNavigation = ({ activeTab, onTabChange }) => {
  const tabs = [
    {
      id: 'prd-generator',
      name: 'PRD to Test Cases',
      icon: <FileText size={20} />,
      description: 'Transform PRDs into comprehensive test cases'
    },
    {
      id: 'release-agent',
      name: 'Release Agent',
      icon: <GitBranch size={20} />,
      description: 'Automate release planning & deployment'
    },
    {
      id: 'data-promo-agent',
      name: 'Data Promo Agent',
      icon: <Database size={20} />,
      description: 'Data promotion and validation automation'
    }
  ];

  return (
    <div className="tab-navigation">
      <div className="app-header">
        <div className="app-header-left">
          <div className="app-header-icon">
            <Zap size={32} />
          </div>
          <div className="app-header-content">
            <h1 className="app-title">QA Hub</h1>
            <p className="app-description">
              Your AI-powered toolkit for streamlining QA workflows
            </p>
          </div>
        </div>
        <div className="app-header-right">
          <ThemeToggle />
        </div>
      </div>
      
      <nav className="tab-nav">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            className={`tab-button ${activeTab === tab.id ? 'active' : ''}`}
            onClick={() => onTabChange(tab.id)}
          >
            <div className="tab-icon">{tab.icon}</div>
            <div className="tab-content">
              <div className="tab-name">{tab.name}</div>
              <div className="tab-description">{tab.description}</div>
            </div>
          </button>
        ))}
      </nav>
    </div>
  );
};

export default TabNavigation;
