import React,{useState}from 'react'
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../Context/AuthContext';
import ma3 from "../images/ma3.jpeg"
//import { Menu, X, Map, Search, LogOut, User } from 'lucide-react';
import "./Navbar.css"


function Navbar() {
  return (
    <div>
      {(() => {
        const [isOpen, setIsOpen] = useState(false);
        const { user, logout } = useAuth();
        const navigate = useNavigate();

        const handleLogout = () => {
            logout();
            navigate('/login');
            setIsOpen(false);
        };

        const navLinks = [
            { name: 'Home', path: '/' },
            { name: 'Search Stages', path: '/search'},
        ];

        return (
            <nav className="Navbar">
                <div className="container">
                    <div className="Logo">
                        {/* Logo and Desktop Navigation */}
                        <div className="item">
                            <Link to="/" className="Home">
                              <img src={ma3} alt="" /> 
                              <span className="heading">StageLocator</span>
                            </Link>
                        </div>

                        {/* User Menu - Desktop */}
                        <div className="Menu">
                            {user ? (
                                <div className="user">
                                    <span className="name">
                                        {user.username}
                                    </span>
                                    <button
                                        onClick={handleLogout}
                                        className="butt"
                                    >
                                        Logout
                                    </button>
                                </div>
                            ) : (
                                <Link
                                    to="/login"
                                    className="butt"
                                >
                                    Login
                                </Link>
                            )}
                        </div>
                    </div>
                </div>
            </nav>
        );
      })()}
    </div>
  )
}

export default Navbar