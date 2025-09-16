import React, { useEffect, useState } from 'react';
import api from '../services/Api';
import { useAuth } from '../Context/AuthContext';

const ReviewSection = ({ stageId }) => {
  const { user } = useAuth();
  const [reviews, setReviews] = useState([]);
  const [avgRating, setAvgRating] = useState(null);
  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [loading, setLoading] = useState(false);

  const fetchReviews = async () => {
    try {
      const res = await api.get(`/reviews/stage/${stageId}`);
      console.log(res.data);
      setReviews(res.data);
      
    } catch (err) {
      setError('Failed to load reviews');
    }
  };

  useEffect(() => {
    if (stageId) fetchReviews();
    // eslint-disable-next-line
  }, [stageId]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    setLoading(true);
    try {
      await api.post('/reviews/add', {
        stageId,
        rating,
        comment,
      });
      setSuccess('Review submitted!');
      setComment('');
      setRating(5);
      fetchReviews();
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to submit review');
    }
    setLoading(false);
  };

  return (
    <div style={{ width: '100%', marginTop: 20 }}>
      <h3>Reviews</h3>
      {avgRating !== null && (
        <div style={{ marginBottom: 10 }}>
          <strong>Average Rating:</strong> {avgRating.toFixed(1)} / 5
        </div>
      )}
      {reviews.length === 0 ? (
        <p>No reviews yet.</p>
      ) : (
        <ul style={{ paddingLeft: 0 }}>
          {reviews.map((r) => (
            <li key={r._id} style={{ listStyle: 'none', marginBottom: 10, background: '#f4f4f4', borderRadius: 8, padding: 10 }}>
              <strong>{r.user?.username || 'User'}</strong> - <span>Rating: {r.rating}</span>
              <div>{r.comment}</div>
              <small>{new Date(r.createdAt).toLocaleString()}</small>
            </li>
          ))}
        </ul>
      )}
      {user && (
        <form onSubmit={handleSubmit} style={{ marginTop: 20 }}>
          <div>
            <label>Rating: </label>
            <select value={rating} onChange={e => setRating(Number(e.target.value))}>
              {[1,2,3,4,5].map(n => <option key={n} value={n}>{n}</option>)}
            </select>
          </div>
          <div>
            <textarea
              value={comment}
              onChange={e => setComment(e.target.value)}
              placeholder="Leave a comment"
              required
              rows={3}
              style={{ width: '100%', marginTop: 8 }}
            />
          </div>
          <button type="submit" disabled={loading} style={{ marginTop: 8 }}>
            {loading ? 'Submitting...' : 'Submit Review'}
          </button>
          {error && <div style={{ color: 'red', marginTop: 5 }}>{error}</div>}
          {success && <div style={{ color: 'green', marginTop: 5 }}>{success}</div>}
        </form>
      )}
      {!user && <div style={{ marginTop: 10, color: 'red' }}>Log in to leave a review.
        <button onClick={() => navigate('/login')} style={{ marginTop: 8 }}>Login</button>
        </div>}
    </div>
  );
};

export default ReviewSection; 