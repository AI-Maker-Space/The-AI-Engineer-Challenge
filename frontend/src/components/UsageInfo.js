import React from 'react';
import { Zap, Crown, Gift, TrendingUp } from 'lucide-react';
import './UsageInfo.css';

const UsageInfo = ({ usageInfo, freeTierAvailable, hasUserApiKey }) => {
  if (!usageInfo && !freeTierAvailable) return null;

  const renderFreeTierInfo = () => (
    <div className="usage-card free-tier">
      <div className="usage-header">
        <Gift className="tier-icon" size={24} />
        <div className="tier-info">
          <h3>Free Tier Active</h3>
          <p>No API key needed!</p>
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
          ⚠️ Daily limit reached! Use your own API key for unlimited access.
        </div>
      )}
    </div>
  );

  const renderUnlimitedInfo = () => (
    <div className="usage-card unlimited">
      <div className="usage-header">
        <Crown className="tier-icon" size={24} />
        <div className="tier-info">
          <h3>Unlimited Access</h3>
          <p>Using your personal API key</p>
        </div>
      </div>
      
      <div className="unlimited-benefits">
        <div className="benefit">
          <TrendingUp size={16} />
          <span>No daily limits</span>
        </div>
        <div className="benefit">
          <Zap size={16} />
          <span>Faster processing</span>
        </div>
        <div className="benefit">
          <Crown size={16} />
          <span>Priority access</span>
        </div>
      </div>
    </div>
  );

  return (
    <div className="usage-info">
      {hasUserApiKey ? renderUnlimitedInfo() : renderFreeTierInfo()}
    </div>
  );
};

export default UsageInfo; 