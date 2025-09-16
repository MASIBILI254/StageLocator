import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../Context/AuthContext';
import logo from '../images/ma3.jpeg';
import './Navbar.css';
import { useTranslation } from 'react-i18next';
import  LanguageSwitcher from '../pages/LanguageSwitcher';
const Navbar = () => {
  const { user, logout } = useAuth();
  const { t} = useTranslation();

  const handleLogout = () => {
    logout();
  };


  return (
    <nav className="navbar">
      <div className="navbar-logo">
        <img src={logo} alt="StageLocator Logo" />
        <Link to="/home" className="navbar-brand">{t('navbar.brand')}</Link>
      </div>

      <ul className="navbar-links">
        {user ? (
          <li className="user-info">
            <span className="username">{t('navbar.welcome')}, {user.username || user.name || t('navbar.defaultUser')}</span>
            <button className="logout-button" onClick={handleLogout}>
              {t('navbar.logout')}
            </button>
          </li>
        ) : (
          <li>
            <Link to="/user">
              <button className="login-button">{t('navbar.login')}</button>
            </Link>
          </li>
        )}
         <LanguageSwitcher/>
      </ul>
       
    </nav>
  );
};

export default Navbar;
