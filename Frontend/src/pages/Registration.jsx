import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../Context/AuthContext';
import './Register.css';
import api from '../services/Api';
import { Link } from 'react-router-dom';

const Register = () => {
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState('user');
  const [message, setMessage] = useState('');
  const navigate = useNavigate();
  const { login } = useAuth();

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!username || !email || !password) {
      setMessage('All fields are required');
      return;
    }

    try {
      const response = await api.post('/users/register', {
        username,
        email,
        password,
        role,
      });

      // After successful registration, automatically log the user in
      const loginResponse = await api.post('/users/login', { username, password });
      const { token, role: userRole, username: userUsername } = loginResponse.data;
      
      // Create user object and log in
      const user = {
        username: userUsername,
        role: userRole
      };
      
      login(user, token);

      setMessage('Registration successful! Redirecting...');
      setTimeout(() => navigate('/user'), 1500);
    } catch (err) {
      console.log(err)
      setMessage(err.response?.data?.message || 'Registration failed');
    }
  };

  return (
    <div className="register-container">
      <h2>Register</h2>
      {message && <p className="error-message">{message}</p>}
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label>Username</label>
          <input
            type="text"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            required
            className="input-field"
          />
        </div>
        <div className="form-group">
          <label>Email</label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            className="input-field"
          />
        </div>
        <div className="form-group">
          <label>Password</label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            className="input-field"
          />
        </div>
        <div className="form-group">
          <label>Role</label>
          <select
            value={role}
            onChange={(e) => setRole(e.target.value)}
            className="form-select"
          >
            <option value="admin">Admin</option>
            <option value="user">User</option>
          </select>
        </div>
        <button type="submit" className="submit-btn1">Register</button>
        <div className="redirect-message">
        <p>Do have an account? <Link to="/user" className="register-link">Login</Link></p>
      </div>
      </form>
    </div>
  );
};

export default Register;
