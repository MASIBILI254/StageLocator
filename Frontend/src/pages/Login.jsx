import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../Context/AuthContext';
import api from '../services/Api';
import './Login.css'; 

const Login = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [message, setMessage] = useState('');
  const navigate = useNavigate();
  const { login } = useAuth();

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!username || !password) {
      setMessage('Username and password are required');
      return;
    }

    try {
      const response = await api.post('/users/login', { username, password });
      const { token, role, username: userUsername } = response.data;
      // Create user object from response data
      const user = {
        username: userUsername,
        role: role
      };
      login(user, token);
      // --- Pending Review Submission Logic ---
      const pendingReview = localStorage.getItem('pendingReview');
      if (pendingReview) {
        try {
          const { stageId, rating, comment } = JSON.parse(pendingReview);
          await api.post('/reviews/add', { stageId, rating, comment });
          setMessage('Thank you for your review!');
          localStorage.removeItem('pendingReview');
        } catch (err) {
          setMessage('Login successful, but failed to submit your review.');
        }
      } else {
        setMessage('Login successful');
      }
      // --- End Pending Review Submission Logic ---
      if (user.role==='admin') {
        navigate('/Admin');
        console.log(user);
      } else {
        navigate('/');
      }
    } catch (err) {
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
            className="input-field1"
          />
        </div>
        <div className="input-container">
          <label className="input-label">Password</label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            className="input-field1"
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
