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
  const [showReset, setShowReset] = useState(false);
  const [resetEmail, setResetEmail] = useState('');
  const [resetNewPassword, setResetNewPassword] = useState('');
  const [resetConfirmPassword, setResetConfirmPassword] = useState('');
  const [resetMessage, setResetMessage] = useState('');
  const [resetLoading, setResetLoading] = useState(false);
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
        setMessage('Login successful!');
        
        
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

  const handleRequestReset = async (e) => {
    e.preventDefault();
    setResetMessage('');
    if (!resetEmail) {
      setResetMessage('Email is required');
      return;
    }
    setResetLoading(true);
    try {
      await api.post('/users/request-password-reset', { email: resetEmail });
      setResetMessage('You can now set a new password.');
    } catch (err) {
      setResetMessage('Error processing request.');
    } finally {
      setResetLoading(false);
    }
  };

  const handleResetPassword = async (e) => {
    e.preventDefault();
    setResetMessage('');
    if (!resetEmail || !resetNewPassword || !resetConfirmPassword) {
      setResetMessage('All fields are required');
      return;
    }
    if (resetNewPassword !== resetConfirmPassword) {
      setResetMessage('Passwords do not match');
      return;
    }
    setResetLoading(true);
    try {
      const res = await api.post('/users/reset-password', {
        email: resetEmail,
        newPassword: resetNewPassword,
        confirmPassword: resetConfirmPassword,
      });
      setResetMessage(res.data.message || 'Password reset successful!');
    } catch (err) {
      setResetMessage(err.response?.data?.message || 'Password reset failed.');
    } finally {
      setResetLoading(false);
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
      {!showReset && (
        <>
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
          <div style={{ marginTop: '1rem', textAlign: 'center' }}>
            <button
              type="button"
              className="forgot-password-link"
              style={{ background: 'none', border: 'none', color: '#60a5fa', cursor: 'pointer', textDecoration: 'underline', fontSize: '14px' }}
              onClick={() => setShowReset(true)}
            >
              Forgot Password?
            </button>
          </div>
        </>
      )}
      {showReset && (
        <div className="reset-password-form" style={{ marginTop: '2rem' }}>
          <h3>Reset Password</h3>
          {resetMessage && (
            <p className={`login-message ${resetMessage.includes('successful') ? 'success' : 'error'}`}>{resetMessage}</p>
          )}
          <form onSubmit={handleRequestReset}>
            <div className="input-container">
              <label className="input-label">Email</label>
              <input
                type="email"
                value={resetEmail}
                onChange={(e) => setResetEmail(e.target.value)}
                required
                className="input-field1"
                disabled={resetLoading}
              />
            </div>
            
          </form>
          <form onSubmit={handleResetPassword}>
            <div className="input-container">
              <label className="input-label">New Password</label>
              <input
                type="password"
                value={resetNewPassword}
                onChange={(e) => setResetNewPassword(e.target.value)}
                required
                className="input-field1"
                disabled={resetLoading}
              />
            </div>
            <div className="input-container">
              <label className="input-label">Confirm New Password</label>
              <input
                type="password"
                value={resetConfirmPassword}
                onChange={(e) => setResetConfirmPassword(e.target.value)}
                required
                className="input-field1"
                disabled={resetLoading}
              />
            </div>
            <button
              type="submit"
              className="submit-button"
              disabled={resetLoading}
            >
              {resetLoading ? 'Resetting...' : 'Reset Password'}
            </button>
          </form>
          <div style={{ marginTop: '1rem', textAlign: 'center' }}>
            <button
              type="button"
              className="forgot-password-link"
              style={{ background: 'none', border: 'none', color: '#60a5fa', cursor: 'pointer', textDecoration: 'underline', fontSize: '14px' }}
              onClick={() => setShowReset(false)}
            >
              Back to Login
            </button>
          </div>
        </div>
      )}
      <div className="redirect-message">
        <p>Don't have an account? <Link to="/register" className="register-link">Register here</Link></p>
      </div>
    </div>
  );
};

export default Login;
