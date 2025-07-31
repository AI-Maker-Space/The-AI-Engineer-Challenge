import React, { useState } from 'react';
import { Download, RotateCcw, Filter, ChevronDown, ChevronUp } from 'lucide-react';
import './TestCaseTable.css';

const TestCaseTable = ({ testCases, onDownloadCSV, onReset }) => {
  const [sortConfig, setSortConfig] = useState({ key: null, direction: 'asc' });
  const [filterCategory, setFilterCategory] = useState('all');
  const [filterPriority, setFilterPriority] = useState('all');
  const [expandedRows, setExpandedRows] = useState({});

  // Get unique categories and priorities for filters
  const categories = [...new Set(testCases.map(tc => tc.category))];
  const priorities = [...new Set(testCases.map(tc => tc.priority))];

  // Apply filters
  const filteredTestCases = testCases.filter(tc => {
    const categoryMatch = filterCategory === 'all' || tc.category === filterCategory;
    const priorityMatch = filterPriority === 'all' || tc.priority === filterPriority;
    return categoryMatch && priorityMatch;
  });

  // Apply sorting
  const sortedTestCases = [...filteredTestCases].sort((a, b) => {
    if (!sortConfig.key) return 0;
    
    const aVal = a[sortConfig.key];
    const bVal = b[sortConfig.key];
    
    if (aVal < bVal) return sortConfig.direction === 'asc' ? -1 : 1;
    if (aVal > bVal) return sortConfig.direction === 'asc' ? 1 : -1;
    return 0;
  });

  const handleSort = (key) => {
    setSortConfig({
      key,
      direction: sortConfig.key === key && sortConfig.direction === 'asc' ? 'desc' : 'asc'
    });
  };

  const toggleRowExpansion = (testCaseId) => {
    setExpandedRows(prev => ({
      ...prev,
      [testCaseId]: !prev[testCaseId]
    }));
  };

  const getPriorityClass = (priority) => {
    switch (priority.toLowerCase()) {
      case 'high': return 'priority-high';
      case 'medium': return 'priority-medium';
      case 'low': return 'priority-low';
      default: return '';
    }
  };

  const getCategoryClass = (category) => {
    return `category-${category.toLowerCase().replace(/[^a-z0-9]/g, '-')}`;
  };

  const truncateText = (text, maxLength = 100) => {
    return text.length > maxLength ? text.substring(0, maxLength) + '...' : text;
  };

  return (
    <div className="test-case-table-container">
      <div className="table-header">
        <div className="table-title">
          <h2>Generated Test Cases ({filteredTestCases.length})</h2>
          <p>AI-generated test cases based on your PRD</p>
        </div>
        
        <div className="table-actions">
          <button onClick={onDownloadCSV} className="action-btn download-btn">
            <Download size={20} />
            Download CSV
          </button>
          <button onClick={onReset} className="action-btn reset-btn">
            <RotateCcw size={20} />
            New Upload
          </button>
        </div>
      </div>

      <div className="table-filters">
        <div className="filter-group">
          <Filter size={16} />
          <span>Filters:</span>
        </div>
        
        <select 
          value={filterCategory} 
          onChange={(e) => setFilterCategory(e.target.value)}
          className="filter-select"
        >
          <option value="all">All Categories</option>
          {categories.map(cat => (
            <option key={cat} value={cat}>{cat}</option>
          ))}
        </select>
        
        <select 
          value={filterPriority} 
          onChange={(e) => setFilterPriority(e.target.value)}
          className="filter-select"
        >
          <option value="all">All Priorities</option>
          {priorities.map(pri => (
            <option key={pri} value={pri}>{pri}</option>
          ))}
        </select>
      </div>

      <div className="table-wrapper">
        <table className="test-case-table">
          <thead>
            <tr>
              <th></th>
              <th onClick={() => handleSort('test_case_id')} className="sortable">
                Test Case ID
                {sortConfig.key === 'test_case_id' && (
                  sortConfig.direction === 'asc' ? <ChevronUp size={16} /> : <ChevronDown size={16} />
                )}
              </th>
              <th onClick={() => handleSort('feature')} className="sortable">
                Feature
                {sortConfig.key === 'feature' && (
                  sortConfig.direction === 'asc' ? <ChevronUp size={16} /> : <ChevronDown size={16} />
                )}
              </th>
              <th>Scenario</th>
              <th onClick={() => handleSort('priority')} className="sortable">
                Priority
                {sortConfig.key === 'priority' && (
                  sortConfig.direction === 'asc' ? <ChevronUp size={16} /> : <ChevronDown size={16} />
                )}
              </th>
              <th onClick={() => handleSort('category')} className="sortable">
                Category
                {sortConfig.key === 'category' && (
                  sortConfig.direction === 'asc' ? <ChevronUp size={16} /> : <ChevronDown size={16} />
                )}
              </th>
            </tr>
          </thead>
          <tbody>
            {sortedTestCases.map((testCase) => (
              <React.Fragment key={testCase.test_case_id}>
                <tr className="test-case-row">
                  <td>
                    <button
                      onClick={() => toggleRowExpansion(testCase.test_case_id)}
                      className="expand-btn"
                      aria-label="Toggle details"
                    >
                      {expandedRows[testCase.test_case_id] ? 
                        <ChevronUp size={16} /> : <ChevronDown size={16} />
                      }
                    </button>
                  </td>
                  <td className="test-case-id">{testCase.test_case_id}</td>
                  <td className="feature">{testCase.feature}</td>
                  <td className="scenario">{truncateText(testCase.scenario)}</td>
                  <td>
                    <span className={`priority-badge ${getPriorityClass(testCase.priority)}`}>
                      {testCase.priority}
                    </span>
                  </td>
                  <td>
                    <span className={`category-badge ${getCategoryClass(testCase.category)}`}>
                      {testCase.category}
                    </span>
                  </td>
                </tr>
                {expandedRows[testCase.test_case_id] && (
                  <tr className="expanded-row">
                    <td colSpan="6">
                      <div className="expanded-content">
                        <div className="detail-section">
                          <h4>Full Scenario</h4>
                          <p>{testCase.scenario}</p>
                        </div>
                        <div className="detail-section">
                          <h4>Test Steps</h4>
                          <pre className="test-steps">{testCase.test_steps}</pre>
                        </div>
                        <div className="detail-section">
                          <h4>Expected Result</h4>
                          <p>{testCase.expected_result}</p>
                        </div>
                      </div>
                    </td>
                  </tr>
                )}
              </React.Fragment>
            ))}
          </tbody>
        </table>
      </div>

      {filteredTestCases.length === 0 && (
        <div className="no-results">
          <p>No test cases match the current filters.</p>
        </div>
      )}
    </div>
  );
};

export default TestCaseTable; 