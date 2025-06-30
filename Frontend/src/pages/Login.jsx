import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../Context/AuthContext';
import api from '../services/Api';
import './Login.css'; 

const Login = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [message, setMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  const { login } = useAuth();

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!username || !password) {
      setMessage('Username and password are required');
      return;
    }

    setIsLoading(true);
    setMessage('');

    try {
      const response = await api.post('/users/login', { username, password });
      const { token, role, username: userUsername } = response.data;
      
      // Create user object from response data
      const user = {
        username: userUsername,
        role: role
      };
      
      // Login the user
      login(user, token);
      
      // Check for pending review and submit it
      const pendingReview = localStorage.getItem('pendingReview');
      if (pendingReview) {
        try {
          console.log('Found pending review, submitting...');
          const { stageId, rating, comment, stageName } = JSON.parse(pendingReview);
          
          // Submit the review
          await api.post('/reviews/add', { stageId, rating, comment });
          
          // Remove the pending review from localStorage
          localStorage.removeItem('pendingReview');
          
          // Show success message
          setMessage(`Login successful! Thank you for your review of ${stageName || 'the stage'}.`);
          
          // Navigate after a short delay to show the success message
          setTimeout(() => {
            if (user.role === 'admin') {
              navigate('/Admin');
            } else {
              navigate('/home');
            }
          }, 2000);
          
        } catch (reviewErr) {
          console.error('Failed to submit pending review:', reviewErr);
          setMessage('Login successful, but failed to submit your review. You can submit it again later.');
          
          // Navigate after showing the error message
          setTimeout(() => {
            if (user.role === 'admin') {
              navigate('/Admin');
            } else {
              navigate('/home');
            }
          }, 3000);
        }
      } else {
        // No pending review, just show login success
        setMessage('Login successful!');
        
        // Navigate immediately
        if (user.role === 'admin') {
          navigate('/Admin');
        } else {
          navigate('/home');
        }
      }
      
    } catch (err) {
      console.error('Login error:', err);
      setMessage(err.response?.data?.message || 'Login failed. Please check your credentials.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="login-container">
      <h2 className="login-title">Login</h2>
      {message && (
        <p className={`login-message ${message.includes('successful') ? 'success' : 'error'}`}>
          {message}
        </p>
      )}
      <form onSubmit={handleSubmit} className="login-form">
        <div className="input-container">
          <label className="input-label">Username</label>
          <input
            type="text"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            required
            className="input-field1"
            disabled={isLoading}
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
            disabled={isLoading}
          />
        </div>
        <button 
          type="submit" 
          className="submit-button"
          disabled={isLoading}
        >
          {isLoading ? 'Logging in...' : 'Login'}
        </button>
      </form>

      <div className="redirect-message">
        <p>Don't have an account? <Link to="/register" className="register-link">Register here</Link></p>
      </div>
    </div>
  );
};

export default Login;
