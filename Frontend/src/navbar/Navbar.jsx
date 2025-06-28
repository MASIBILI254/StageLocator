import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../Context/AuthContext';
import logo from '../images/ma3.jpeg';
import './Navbar.css';

const Navbar = () => {
  const { user, logout } = useAuth();

  const handleLogout = () => {
    logout();
  };

  return (
    <nav className="navbar">
      <div className="navbar-logo">
        <img src={logo} alt="StageLocator Logo" />
        <Link to="/" className="navbar-brand" onClick={handleLogout}>StageLocator</Link>
      </div>

      <ul className="navbar-links">
        {user ? (
          <li className="user-info">
            <span className="username">Welcome, {user.username || user.name || 'User'}</span>
            <button className="logout-button" onClick={handleLogout}>
              Logout
            </button>
          </li>
        ) : (
          <li>
            <Link to="/user">
              <button className="login-button">Login</button>
            </Link>
          </li>
        )}
      </ul>
    </nav>
  );
};

export default Navbar;
