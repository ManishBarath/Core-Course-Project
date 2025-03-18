import { Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { useState } from 'react';
import Header from './components/Header';
import LoginPage from './Pages/LoginPage';
import HomePage from './Pages/HomePage';
import UploadPage from './Pages/UploadPage';
import SearchPage from './Pages/SearchPage';
import './App.css';

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const location = useLocation();

  const handleLogin = () => {
    setIsAuthenticated(true);
  };

  const handleLogout = () => {
    setIsAuthenticated(false);
  };

  return (
    <div className="App">
      {isAuthenticated && <Header onLogout={handleLogout} />}
      <main className="main-content">
        <Routes>
          <Route 
            path="/" 
            element={
              !isAuthenticated ? (
                <LoginPage onLogin={handleLogin} />
              ) : (
                <Navigate to="/home" replace />
              )
            } 
          />
          <Route 
            path="/home" 
            element={
              isAuthenticated ? (
                <HomePage />
              ) : (
                <Navigate to="/" state={{ from: location }} replace />
              )
            } 
          />
          <Route 
            path="/upload" 
            element={
              isAuthenticated ? (
                <UploadPage />
              ) : (
                <Navigate to="/" state={{ from: location }} replace />
              )
            } 
          />
          <Route 
            path="/search" 
            element={
              isAuthenticated ? (
                <SearchPage />
              ) : (
                <Navigate to="/" state={{ from: location }} replace />
              )
            } 
          />
        </Routes>
      </main>
    </div>
  );
}

export default App;