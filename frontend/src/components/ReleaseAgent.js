import React, { useState } from 'react';
import { GitBranch, Zap, CheckCircle, Clock, AlertCircle, Github, Settings, Rocket } from 'lucide-react';
import './ReleaseAgent.css';

const ReleaseAgent = () => {
  const [selectedRepos, setSelectedRepos] = useState([]);
  
  // Mock repository data based on your Confluence document
  const repositories = [
    'piq-customer-ui', 'platform-ui', 'niffler-api', 'aeon-api', 've-api',
    'export-tracking-api', 'covered-wagon', 'linkedin-api', 'bacchus-api',
    'hermes-api', 'company-search-api', 'taxonomy-api', 'talaria-api',
    'company-match-api', 'hg-force-api', 'scoring-api', 'overseer',
    'overlord-api', 'overlord-ui'
  ];

  const features = [
    {
      icon: <CheckCircle size={24} />,
      title: 'JIRA Integration',
      description: 'Auto-fetch tickets from "Ready to Deploy" column',
      status: 'coming-soon'
    },
    {
      icon: <Github size={24} />,
      title: 'GitHub Status Check',
      description: 'Verify repo health, CI status, and latest releases',
      status: 'coming-soon'
    },
    {
      icon: <Settings size={24} />,
      title: 'Release Plan Generator',
      description: 'Generate complete Confluence release documents',
      status: 'coming-soon'
    },
    {
      icon: <Rocket size={24} />,
      title: 'Deployment Automation',
      description: 'One-click deployment scripts and validations',
      status: 'coming-soon'
    }
  ];

  const handleRepoToggle = (repo) => {
    setSelectedRepos(prev => 
      prev.includes(repo) 
        ? prev.filter(r => r !== repo)
        : [...prev, repo]
    );
  };

  return (
    <div className="release-agent">
      <div className="tab-header">
        <div className="tab-header-icon">
          <GitBranch size={24} />
        </div>
        <div className="tab-header-content">
          <h2>Release Agent</h2>
          <p>Automate your release planning, deployment, and documentation workflows. Connect with JIRA, GitHub, and Confluence to streamline your release process.</p>
          <div className="status-badge coming-soon">
            <Clock size={16} />
            Coming Soon - In Development
          </div>
        </div>
      </div>

      <div className="tab-content">
        <div className="release-agent-content">
          
          {/* Repository Selection Preview */}
          <div className="section">
            <h3 className="section-title">
              <Github size={20} />
              Repository Selection
            </h3>
            <p className="section-description">
              Select the repositories you want to deploy in this release
            </p>
            <div className="repo-grid">
              {repositories.map((repo) => (
                <button
                  key={repo}
                  className={`repo-card ${selectedRepos.includes(repo) ? 'selected' : ''}`}
                  onClick={() => handleRepoToggle(repo)}
                  disabled
                >
                  <div className="repo-info">
                    <span className="repo-name">{repo}</span>
                    <span className="repo-status coming-soon">Preview Mode</span>
                  </div>
                  <div className={`repo-checkbox ${selectedRepos.includes(repo) ? 'checked' : ''}`}>
                    {selectedRepos.includes(repo) && <CheckCircle size={16} />}
                  </div>
                </button>
              ))}
            </div>
            {selectedRepos.length > 0 && (
              <div className="selection-summary">
                <strong>{selectedRepos.length}</strong> repositories selected for deployment
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
              <Rocket size={20} />
              Planned Workflow
            </h3>
            <div className="workflow-preview">
              <div className="workflow-step">
                <div className="step-number">1</div>
                <div className="step-content">
                  <h4>Repository Analysis</h4>
                  <p>Auto-check GitHub status, CI builds, and latest releases for selected repos</p>
                </div>
              </div>
              <div className="workflow-arrow">→</div>
              <div className="workflow-step">
                <div className="step-number">2</div>
                <div className="step-content">
                  <h4>JIRA Integration</h4>
                  <p>Fetch tickets from "Ready to Deploy", validate DoD requirements</p>
                </div>
              </div>
              <div className="workflow-arrow">→</div>
              <div className="workflow-step">
                <div className="step-number">3</div>
                <div className="step-content">
                  <h4>Release Plan Generation</h4>
                  <p>Generate complete Confluence release document with all details</p>
                </div>
              </div>
              <div className="workflow-arrow">→</div>
              <div className="workflow-step">
                <div className="step-number">4</div>
                <div className="step-content">
                  <h4>One-Click Actions</h4>
                  <p>Bulk JIRA updates, Slack notifications, deployment scripts</p>
                </div>
              </div>
            </div>
          </div>

          {/* Coming Soon CTA */}
          <div className="cta-section">
            <div className="cta-card">
              <AlertCircle size={32} />
              <h3>Release Agent in Development</h3>
              <p>
                This powerful automation tool will save you 4-6 hours per release by automating:
                repository status checks, JIRA integration, release plan generation, and deployment workflows.
              </p>
              <div className="cta-features">
                <span>✅ JIRA API Integration</span>
                <span>✅ GitHub Status Monitoring</span>
                <span>✅ Confluence Template Generation</span>
                <span>✅ Slack Automation</span>
              </div>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
};

export default ReleaseAgent;
