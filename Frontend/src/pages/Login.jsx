import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import api from '../services/Api';
import './Login.css'; 

const Login = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [message, setMessage] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!username || !password) {
      setMessage('Username and password are required');
      return;
    }

    try {
      const response = await api.post('/users/login', { username, password });
      console.log("user data", response);

      localStorage.setItem('token', response.data.token);

      const userRole = response.data.role;

      if (userRole === 'admin') {
        navigate('/admin');
      } else {
        navigate('/user');
      }

      setMessage('Login successful');
    } catch (err) {
      console.error(err);
      setMessage(err.response?.data?.message || 'Login failed');
    }
  };

  return (
    <div className="login-container">
      <h2 className="login-title">Login</h2>
      {message && <p className="login-message">{message}</p>}
      <form onSubmit={handleSubmit} className="login-form">
        <div className="input-container">
          <label className="input-label">Username</label>
          <input
            type="text"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            required
            className="input-field"
          />
        </div>
        <div className="input-container">
          <label className="input-label">Password</label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            className="input-field"
          />
        </div>
        <button type="submit" className="submit-button">Login</button>
      </form>

      <div className="redirect-message">
        <p>Don't have an account? <Link to="/register" className="register-link">Register here</Link></p>
      </div>
    </div>
  );
};

export default Login;
