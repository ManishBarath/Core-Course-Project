import React from 'react';
import { Link } from 'react-router-dom';
import './Header.css';

interface HeaderProps {
  onLogout: () => void;
}

const Header: React.FC<HeaderProps> = ({ onLogout }) => {
  return (
    <header className="header">
      <div className="header-logo">
        <h1>Data Explorer</h1>
      </div>
      <nav className="header-nav">
        <Link to="/home">Home</Link>
        <Link to="/upload">Upload</Link>
        <Link to="/search">Search</Link>
        <button onClick={onLogout}>Logout</button>
      </nav>
    </header>
  );
};

export default Header;