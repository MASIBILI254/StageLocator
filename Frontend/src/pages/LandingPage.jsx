
import React from 'react';
import { Link } from 'react-router-dom';

const LandingPage = () => {
  const containerStyle = {
    minHeight: '100vh',
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
    background: 'linear-gradient(to bottom right, #dbeafe, #bfdbfe, #93c5fd)',
    padding: '2rem',
    boxSizing: 'border-box',
    borderRadius:'10px'
  };

  const cardStyle = {
    backgroundColor: '#ffffff',
    padding: '3rem',
    borderRadius: '1.5rem',
    boxShadow: '0 10px 30px rgba(0,0,0,0.1)',
    maxWidth: '600px',
    textAlign: 'center',
  };

  const titleStyle = {
    fontSize: '2.5rem',
    fontWeight: 'bold',
    color: '#1d4ed8',
    marginBottom: '1rem',
  };

  const textStyle = {
    fontSize: '1.1rem',
    color: '#374151',
    marginBottom: '2rem',
  };

  const buttonStyle = {
    backgroundColor: '#2563eb',
    color: '#ffffff',
    padding: '0.8rem 1.5rem',
    fontSize: '1rem',
    fontWeight: '600',
    border: 'none',
    borderRadius: '0.75rem',
    cursor: 'pointer',
    transition: 'background-color 0.3s ease',
  };

  const buttonHoverStyle = {
    backgroundColor: '#1e40af',
  };

  const footerStyle = {
    marginTop: '2rem',
    fontSize: '0.9rem',
    color: '#6b7280',
  };

  const [isHovered, setIsHovered] = React.useState(false);

  return (
    <div style={containerStyle}>
      <div style={cardStyle}>
        <h1 style={titleStyle}>Welcome to StageLocator</h1>
        <p style={textStyle}>
          Your ultimate guide to finding public transport stages. Navigate the city easily..
        </p>
        <Link to="/user">
          <button
            style={isHovered ? { ...buttonStyle, ...buttonHoverStyle } : buttonStyle}
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
          >
            Get Started
          </button>
        </Link>
      </div>

      <div style={footerStyle}>
        &copy; {new Date().getFullYear()} MasibiliK. All rights reserved.
      </div>
    </div>
  );
};

export default LandingPage;
