import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import './LoginPage.css';

const LoginPage: React.FC = () => {
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: '',
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    // Implement login logic here
    console.log('Logging in with', formData);
  };

  return (
    <div className="login-page">
      <h2>Login</h2>
      <form onSubmit={handleLogin} className="login-form">
        <div className="form-group">
          <label>Username</label>
          <input
            name="username"
            type="text"
            value={formData.username}
            onChange={handleChange}
            placeholder="Enter username"
            required
          />
        </div>
        <div className="form-group">
          <label>Email</label>
          <input
            name="email"
            type="email"
            value={formData.email}
            onChange={handleChange}
            placeholder="Enter email"
            required
          />
        </div>
        <div className="form-group">
          <label>Password</label>
          <input
            name="password"
            type="password"
            value={formData.password}
            onChange={handleChange}
            placeholder="Enter password"
            required
          />
        </div>
        <button type="submit" className="btn">Login</button>
      </form>
      <div className="signup">
        <p>Don't have an account? <Link to="/signup">Sign up</Link></p>
      </div>
    </div>
  );
};

export default LoginPage;