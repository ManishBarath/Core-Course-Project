import React from 'react';
import { useNavigate } from 'react-router-dom';
import './HomePage.css';

const HomePage: React.FC = () => {
  const navigate = useNavigate();

  return (
    <div className="home-page">
      <div className="cards-container">
        <div 
          className="card search-card" 
          onClick={() => navigate('/search')}
        >
          <div className="card-content">
            <div className="card-icon">🔍</div>
            <h3>Search Data</h3>
            <p>Explore and analyze your data with powerful search capabilities</p>
          </div>
          <div className="card-overlay">
            <span>Search Now</span>
          </div>
        </div>

        <div 
          className="card upload-card" 
          onClick={() => navigate('/upload')}
        >
          <div className="card-content">
            <div className="card-icon">📤</div>
            <h3>Upload Data</h3>
            <p>Upload and manage your Excel files securely</p>
          </div>
          <div className="card-overlay">
            <span>Upload Now</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HomePage;