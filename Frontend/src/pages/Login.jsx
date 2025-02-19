import React,{useState} from 'react'
import { useAuth } from '../Context/AuthContext.jsx'
import { useNavigate } from 'react-router-dom'
import axios from 'axios'
import "./Login.css"

const LoginPage = () => {
    const [isLogin, setIsLogin] = useState(true);
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
            const endpoint = isLogin ? '/auth/login' : '/users';
            const response = await axios.post(`http://localhost:3000${endpoint}`, 
                isLogin ? {
                    email: formData.email,
                    password: formData.password
                } : formData
            );

            login(response.data.user, response.data.token);
            navigate('/');
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

    return (
        <div className="login">
            <div className="Input">
                <h2 className="Text">
                    {isLogin ? 'Login' : 'Register'}
                </h2>

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
                        {loading ? 'Please wait...' : (isLogin ? 'Login' : 'Register')}
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
    );};

export default LoginPage;