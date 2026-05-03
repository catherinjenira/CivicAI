import { useState } from 'react';
import { Search, BookOpen, ChevronRight, Filter } from 'lucide-react';
import { MOCK_RESPONSES } from '../mockData';
import './Resources.css';

export default function Resources() {
  const [searchTerm, setSearchTerm] = useState('');

  const filteredResources = Object.entries(MOCK_RESPONSES)
    .filter(([key]) => key !== 'default' && key.toLowerCase().includes(searchTerm.toLowerCase()))
    .map(([key, value]) => ({ title: key, description: value }));

  return (
    <div className="resources-page">
      <header className="page-header">
        <h1>Resource Hub</h1>
        <p>Comprehensive information on everything election-related.</p>
      </header>

      <div className="search-container">
        <Search className="search-icon" size={20} />
        <input 
          type="text" 
          placeholder="Search resources (e.g. 'registration', 'ballot', 'rights')..." 
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
        <button className="filter-btn"><Filter size={18} /></button>
      </div>

      <div className="resource-grid">
        {filteredResources.map((res, i) => (
          <div key={i} className="resource-card">
            <div className="res-header">
              <BookOpen size={18} color="var(--primary-light)" />
              <h3 className="res-title">{res.title}</h3>
            </div>
            <p className="res-desc">{res.description}</p>
            <div className="res-footer">
              <span>Read more</span>
              <ChevronRight size={14} />
            </div>
          </div>
        ))}
      </div>
      
      {filteredResources.length === 0 && (
        <div className="no-results">
          <h3>No resources found matching "{searchTerm}"</h3>
          <p>Try searching for broader terms like "vote" or "election".</p>
        </div>
      )}
    </div>
  );
}
