import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import './Header.css';

const Header: React.FC = () => {
  const navigate = useNavigate();

  const handleLogout = () => {
    // Add your logout logic here
    console.log('Logout clicked');
    navigate('/');
  };

  return (
    <header className="header">
      <div className="header-logo">
        <h1>My React App</h1>
      </div>
      <nav className="header-nav">
        <Link to="/">Login</Link>
        <button onClick={handleLogout}>Logout</button>
        <Link to="/upload">Upload</Link>
        <Link to="/search">Search</Link>
      </nav>
    </header>
  );
};

export default Header;