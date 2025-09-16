import api from './services/Api';

export const login = (token, role) => {
    localStorage.setItem('token', token);
    localStorage.setItem('role', role);
  };
  
  export const logout = () => {
    localStorage.clear();
    Navigate('/');
  };
  
  export const getRole = () => localStorage.getItem('role');
  export const isAuthenticated = () => !!localStorage.getItem('token');
  
  const [reviewSuccess, setReviewSuccess] = useState('');

  const handleLogin = async (e) => {
    e.preventDefault();
    // ... existing login logic ...
    // After successful login:
    const pendingReview = localStorage.getItem('pendingReview');
    if (pendingReview) {
      try {
        const { stageId, rating, comment } = JSON.parse(pendingReview);
        await api.post('/reviews/add', { stageId, rating, comment });
        setReviewSuccess('Thank you for your review!');
        localStorage.removeItem('pendingReview');
      } catch (err) {
        // Optionally handle error
      }
    }
  };

  {reviewSuccess && (
    <div style={{ color: 'green', marginTop: 10, textAlign: 'center' }}>{reviewSuccess}</div>
  )}
  