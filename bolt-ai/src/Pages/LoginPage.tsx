import React, { useState } from 'react';
import './LoginPage.css';

interface LoginPageProps {
  onLogin: () => void;
}

const LoginPage: React.FC<LoginPageProps> = ({ onLogin }) => {
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Add your authentication logic here
    onLogin();
  };

  return (
    <div className="login-page">
      <h2>Welcome Back</h2>
      <form onSubmit={handleSubmit} className="login-form">
        <div className="form-group">
          <label>Email</label>
          <input
            name="email"
            type="email"
            value={formData.email}
            onChange={handleChange}
            placeholder="Enter your email"
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
            placeholder="Enter your password"
            required
          />
        </div>
        <button type="submit" className="btn login-btn">
          Login
        </button>
      </form>
    </div>
  );
}

export default LoginPage