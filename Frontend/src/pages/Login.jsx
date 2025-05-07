import React, { useState } from 'react'
import { useAuth } from '../Context/AuthContext.jsx'
import { useNavigate } from 'react-router-dom'
import axios from 'axios'
import "./Login.css"

const LoginPage = () => {
    const [isLogin, setIsLogin] = useState(true);
    const [userType, setUserType] = useState('user'); // Added user type state (user or admin)
    const [formData, setFormData] = useState({
        username: '',
        email: '',
        password: ''
    });
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    
    const navigate = useNavigate();
    const { login } = useAuth();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setLoading(true);

        try {
            // Modified endpoint based on user type and login/register action
            let endpoint;
            if (isLogin) {
                endpoint = userType === 'admin' ? '/auth/login' : '/auth/login';
            } else {
                endpoint = userType === 'admin' ? '/users' : '/users';
            }

            const response = await axios.post(`http://localhost:3000${endpoint}`, 
                isLogin ? {
                    email: formData.email,
                    password: formData.password
                } : {
                    ...formData,
                    role: userType // Include role in registration data
                }
            );

            // Pass user type to login function
            login(response.data.user, response.data.token, userType);
            
            // Redirect based on user type
            if (userType === 'admin') {
                navigate('/admin/dashboard');
            } else {
                navigate('/');
            }
        } catch (err) {
            setError(err.response?.data?.message || 'An error occurred');
        } finally {
            setLoading(false);
        }
    };

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });
    };

    const handleUserTypeChange = (type) => {
        setUserType(type);
    };

    return (
        <div className="login">
            <div className="Input">
                <h2 className="Text">
                    {isLogin ? 'Login' : 'Register'} as {userType === 'admin' ? 'Admin' : 'User'}
                </h2>

                {/* User type selector */}
                <div className="user-type-selector">
                    <button 
                        className={`type-btn ${userType === 'user' ? 'active' : ''}`}
                        onClick={() => handleUserTypeChange('user')}
                    >
                        User
                    </button>
                    <button 
                        className={`type-btn ${userType === 'admin' ? 'active' : ''}`}
                        onClick={() => handleUserTypeChange('admin')}
                    >
                        Admin
                    </button>
                </div>

                {error && (
                    <div className="Error">
                        {error}
                    </div>
                )}

                <form onSubmit={handleSubmit} className="Form">
                    {!isLogin && (
                        <>
                            <div className="UserName">
                                <div>
                                    <label className="UserName">Username</label>
                                    <input
                                        type="text"
                                        name="username"
                                        value={formData.username}
                                        onChange={handleChange}
                                        className="Labels"
                                        required
                                    />
                                </div>
                            </div>
                        </>
                    )}

                    <div>
                        <label className="UserName">Email</label>
                        <input
                            type="email"
                            name="email"
                            value={formData.email}
                            onChange={handleChange}
                            className="Labels"
                            required
                        />
                    </div>

                    <div>
                        <label className="UserName">Password</label>
                        <input
                            type="password"
                            name="password"
                            value={formData.password}
                            onChange={handleChange}
                            className="Labels"
                            required
                        />
                    </div>

                    <button
                        type="submit"
                        className="btn1"
                        disabled={loading}
                    >
                        {loading ? 'Please wait...' : (isLogin ? `Login as ${userType}` : `Register as ${userType}`)}
                    </button>
                </form>

                <div className="mt-4 text-center">
                    <button
                        onClick={() => setIsLogin(!isLogin)}
                        className="Button"
                    >
                        {isLogin ? 'Need an account? Register' : 'Already have an account? Login'}
                    </button>
                </div>
            </div>
        </div>
    );
};

export default LoginPage;