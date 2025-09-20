import React, { useState } from 'react';
import { Database, Zap, CheckCircle, Clock, AlertTriangle, BarChart, Shield, RefreshCw } from 'lucide-react';
import './DataPromoAgent.css';

const DataPromoAgent = () => {
  const [selectedEnvironments, setSelectedEnvironments] = useState([]);
  
  // Mock environment data
  const environments = [
    { name: 'Development', status: 'healthy', lastSync: '2 hours ago' },
    { name: 'Staging', status: 'healthy', lastSync: '1 day ago' },
    { name: 'QA', status: 'warning', lastSync: '3 days ago' },
    { name: 'Production', status: 'healthy', lastSync: '1 week ago' },
  ];

  const features = [
    {
      icon: <Shield size={24} />,
      title: 'Data Validation',
      description: 'Automated data quality checks and validation rules',
      status: 'coming-soon'
    },
    {
      icon: <RefreshCw size={24} />,
      title: 'Environment Sync',
      description: 'Synchronized data promotion across environments',
      status: 'coming-soon'
    },
    {
      icon: <BarChart size={24} />,
      title: 'Impact Analysis',
      description: 'Analyze data changes and downstream impacts',
      status: 'coming-soon'
    },
    {
      icon: <CheckCircle size={24} />,
      title: 'Approval Workflows',
      description: 'Automated approval processes for data promotion',
      status: 'coming-soon'
    }
  ];

  const handleEnvironmentToggle = (env) => {
    setSelectedEnvironments(prev => 
      prev.includes(env) 
        ? prev.filter(e => e !== env)
        : [...prev, env]
    );
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'healthy': return <CheckCircle size={16} color="#10b981" />;
      case 'warning': return <AlertTriangle size={16} color="#f59e0b" />;
      case 'error': return <AlertTriangle size={16} color="#ef4444" />;
      default: return <Clock size={16} color="#64748b" />;
    }
  };

  return (
    <div className="data-promo-agent">
      <div className="tab-header">
        <div className="tab-header-icon">
          <Database size={24} />
        </div>
        <div className="tab-header-content">
          <h2>Data Promo Agent</h2>
          <p>Automate data promotion, validation, and synchronization across environments. Ensure data integrity and compliance with automated workflows.</p>
          <div className="status-badge coming-soon">
            <Clock size={16} />
            Coming Soon - In Development
          </div>
        </div>
      </div>

      <div className="tab-content">
        <div className="data-promo-content">
          
          {/* Environment Overview */}
          <div className="section">
            <h3 className="section-title">
              <Database size={20} />
              Environment Overview
            </h3>
            <p className="section-description">
              Monitor and manage data across different environments
            </p>
            <div className="environments-grid">
              {environments.map((env, index) => (
                <button
                  key={index}
                  className={`environment-card ${selectedEnvironments.includes(env.name) ? 'selected' : ''}`}
                  onClick={() => handleEnvironmentToggle(env.name)}
                  disabled
                >
                  <div className="env-header">
                    <div className="env-name">{env.name}</div>
                    <div className="env-status">
                      {getStatusIcon(env.status)}
                      <span className={`status-text ${env.status}`}>
                        {env.status === 'healthy' ? 'Healthy' : env.status === 'warning' ? 'Warning' : 'Error'}
                      </span>
                    </div>
                  </div>
                  <div className="env-details">
                    <span className="last-sync">Last sync: {env.lastSync}</span>
                    <span className="preview-mode">Preview Mode</span>
                  </div>
                  <div className={`env-checkbox ${selectedEnvironments.includes(env.name) ? 'checked' : ''}`}>
                    {selectedEnvironments.includes(env.name) && <CheckCircle size={16} />}
                  </div>
                </button>
              ))}
            </div>
            {selectedEnvironments.length > 0 && (
              <div className="selection-summary">
                <strong>{selectedEnvironments.length}</strong> environments selected for data promotion
              </div>
            )}
          </div>

          {/* Features Preview */}
          <div className="section">
            <h3 className="section-title">
              <Zap size={20} />
              Automation Features
            </h3>
            <div className="features-grid">
              {features.map((feature, index) => (
                <div key={index} className="feature-card">
                  <div className="feature-icon">
                    {feature.icon}
                  </div>
                  <div className="feature-content">
                    <h4 className="feature-title">{feature.title}</h4>
                    <p className="feature-description">{feature.description}</p>
                    <span className="feature-status coming-soon">Coming Soon</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Planned Workflow */}
          <div className="section">
            <h3 className="section-title">
              <RefreshCw size={20} />
              Data Promotion Workflow
            </h3>
            <div className="workflow-preview">
              <div className="workflow-step">
                <div className="step-number">1</div>
                <div className="step-content">
                  <h4>Data Validation</h4>
                  <p>Run automated quality checks and validation rules on source data</p>
                </div>
              </div>
              <div className="workflow-arrow">→</div>
              <div className="workflow-step">
                <div className="step-number">2</div>
                <div className="step-content">
                  <h4>Impact Analysis</h4>
                  <p>Analyze downstream dependencies and potential impacts</p>
                </div>
              </div>
              <div className="workflow-arrow">→</div>
              <div className="workflow-step">
                <div className="step-number">3</div>
                <div className="step-content">
                  <h4>Approval Process</h4>
                  <p>Route through automated approval workflows with stakeholders</p>
                </div>
              </div>
              <div className="workflow-arrow">→</div>
              <div className="workflow-step">
                <div className="step-number">4</div>
                <div className="step-content">
                  <h4>Safe Promotion</h4>
                  <p>Execute data promotion with rollback capabilities</p>
                </div>
              </div>
            </div>
          </div>

          {/* Mock Data Promotion Preview */}
          <div className="section">
            <h3 className="section-title">
              <BarChart size={20} />
              Data Promotion Preview
            </h3>
            <div className="promotion-preview">
              <div className="promotion-card">
                <div className="promotion-header">
                  <h4>Weekly Customer Data Sync</h4>
                  <span className="promotion-status pending">Pending</span>
                </div>
                <div className="promotion-details">
                  <div className="promotion-row">
                    <span>Source:</span>
                    <span>Production Database</span>
                  </div>
                  <div className="promotion-row">
                    <span>Target:</span>
                    <span>Staging Environment</span>
                  </div>
                  <div className="promotion-row">
                    <span>Records:</span>
                    <span>~1.2M customer records</span>
                  </div>
                  <div className="promotion-row">
                    <span>Estimated Time:</span>
                    <span>45 minutes</span>
                  </div>
                </div>
                <div className="promotion-actions">
                  <button className="action-btn" disabled>Validate Data</button>
                  <button className="action-btn primary" disabled>Start Promotion</button>
                </div>
              </div>

              <div className="promotion-card">
                <div className="promotion-header">
                  <h4>Configuration Updates</h4>
                  <span className="promotion-status completed">Completed</span>
                </div>
                <div className="promotion-details">
                  <div className="promotion-row">
                    <span>Source:</span>
                    <span>Staging Configuration</span>
                  </div>
                  <div className="promotion-row">
                    <span>Target:</span>
                    <span>QA Environment</span>
                  </div>
                  <div className="promotion-row">
                    <span>Files:</span>
                    <span>23 configuration files</span>
                  </div>
                  <div className="promotion-row">
                    <span>Completed:</span>
                    <span>2 hours ago</span>
                  </div>
                </div>
                <div className="promotion-actions">
                  <button className="action-btn" disabled>View Logs</button>
                  <button className="action-btn" disabled>Rollback</button>
                </div>
              </div>
            </div>
          </div>

          {/* Coming Soon CTA */}
          <div className="cta-section">
            <div className="cta-card">
              <Database size={32} />
              <h3>Data Promo Agent in Development</h3>
              <p>
                Streamline your data promotion workflows with automated validation, 
                impact analysis, and safe deployment capabilities. Reduce manual errors 
                and ensure data consistency across all environments.
              </p>
              <div className="cta-features">
                <span>✅ Automated Data Validation</span>
                <span>✅ Environment Synchronization</span>
                <span>✅ Impact Analysis & Reporting</span>
                <span>✅ Approval Workflow Integration</span>
              </div>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
};

export default DataPromoAgent;
