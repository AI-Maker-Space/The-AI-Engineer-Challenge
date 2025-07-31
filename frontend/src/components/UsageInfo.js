import React from 'react';
import { Zap, Gift } from 'lucide-react';
import './UsageInfo.css';

const UsageInfo = ({ usageInfo, serviceAvailable }) => {
  if (!usageInfo && !serviceAvailable) return null;

  const renderServiceInfo = () => (
    <div className="usage-card service-tier">
      <div className="usage-header">
        <Gift className="tier-icon" size={24} />
        <div className="tier-info">
          <h3>Free AI-Powered Service</h3>
          <p>Transform your PRDs into test cases instantly!</p>
        </div>
      </div>
      
      <div className="usage-stats">
        <div className="stat">
          <span className="stat-label">Daily Limit</span>
          <span className="stat-value">{usageInfo?.daily_limit || 5}</span>
        </div>
        <div className="stat">
          <span className="stat-label">Used Today</span>
          <span className="stat-value">{usageInfo?.used_today || 0}</span>
        </div>
        <div className="stat">
          <span className="stat-label">Remaining</span>
          <span className={`stat-value ${(usageInfo?.remaining_today || 5) <= 1 ? 'warning' : ''}`}>
            {usageInfo?.remaining_today || 5}
          </span>
        </div>
      </div>
      
      <div className="usage-progress">
        <div 
          className="progress-bar"
          style={{
            width: `${((usageInfo?.used_today || 0) / (usageInfo?.daily_limit || 5)) * 100}%`
          }}
        />
      </div>
      
      {(usageInfo?.remaining_today || 5) === 0 && (
        <div className="limit-reached">
          ⏰ Daily limit reached! Come back tomorrow for more free uses.
        </div>
      )}
    </div>
  );

  return (
    <div className="usage-info">
      {renderServiceInfo()}
    </div>
  );
};

export default UsageInfo; 