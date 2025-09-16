import React, { useState } from 'react';
import api from '../services/Api';
import { useAuth } from '../Context/AuthContext';
import { useNavigate } from 'react-router-dom';

const ReviewModal = ({ isOpen, onClose, stageId, stageName }) => {
  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const { user } = useAuth();
  const navigate = useNavigate();


  if (!isOpen) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!user) {
      // Store the review data in localStorage
      const pendingReviewData = { stageId, stageName, rating, comment };
      console.log('User not logged in, storing pending review:', pendingReviewData);
      localStorage.setItem('pendingReview', JSON.stringify(pendingReviewData));
      
      setSuccess('Please log in to submit your review. You will be redirected to the login page.');
      setTimeout(() => {
        onClose();
        navigate('/user');
      }, 2000);
      
      return;
    }
    
    setError('');
    setSuccess('');
    setLoading(true);
    
    try {
      await api.post('/reviews/add', {
        stageId,
        rating,
        comment,
      });
      setSuccess('Thank you for your review!');
      setTimeout(() => {
        onClose();
        setComment('');
        setRating(5);
        setSuccess('');
      }, 2000);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to submit review');
    }
    setLoading(false);
  };

  const handleSkip = () => {
    onClose();
    setComment('');
    setRating(5);
    setError('');
    setSuccess('');
  };

  return (
    <div style={{
      position: 'fixed',
      top: 0,
      left: 0,
      width: '100%',
      height: '100%',
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'flex-start',
      paddingTop: '50px',
      zIndex: 2000
    }}>
      <div style={{
        padding: '40px',
        maxWidth: '600px',
        width: '90%'
      }}>
        <div style={{
          background: 'rgba(252, 252, 252, 0.95)',
          padding: '30px',
          borderRadius: '15px',
          boxShadow: '0 10px 30px rgba(0, 0, 0, 0.1)'
        }}>
          <h3 style={{ 
            marginBottom: '25px', 
            textAlign: 'center',
            fontSize: '24px',
            fontWeight: 'bold',
            color: '#1f2937',
            marginTop: 0
          }}>
            How was your experience using this application?
          </h3>
          
          <form onSubmit={handleSubmit}>
            <div style={{ marginBottom: '25px' }}>
              <label style={{ 
                display: 'block', 
                marginBottom: '10px', 
                fontWeight: '600',
                color: '#374151',
                fontSize: '16px'
              }}>
                Rating:
              </label>
              <select 
                value={rating} 
                onChange={(e) => setRating(Number(e.target.value))}
                style={{ 
                  width: '100%', 
                  padding: '12px', 
                  borderRadius: '8px', 
                  border: '2px solid #e5e7eb',
                  fontSize: '16px',
                  background: 'white'
                }}
              >
                {[1,2,3,4,5].map(n => (
                  <option key={n} value={n}>
                    {n} Star{n !== 1 ? 's' : ''} {n === 1 ? '😞' : n === 2 ? '😐' : n === 3 ? '😊' : n === 4 ? '😄' : '😍'}
                  </option>
                ))}
              </select>
            </div>
            
            <div style={{ marginBottom: '30px' }}>
              <label style={{ 
                display: 'block', 
                marginBottom: '10px', 
                fontWeight: '600',
                color: '#374151',
                fontSize: '16px'
              }}>
                Comment:
              </label>
              <textarea
                value={comment}
                onChange={(e) => setComment(e.target.value)}
                placeholder="Share your experience about this application..."
                required
                rows={4}
                style={{ 
                  width: '100%', 
                  padding: '12px', 
                  borderRadius: '8px', 
                  border: '2px solid #e5e7eb',
                  fontSize: '16px',
                  resize: 'vertical',
                  fontFamily: 'inherit'
                }}
              />
            </div>
            
            <div style={{ display: 'flex', gap: '15px', justifyContent: 'center' }}>
              <button
                type="submit"
                disabled={loading}
                style={{
                  padding: '12px 24px',
                  background: 'linear-gradient(135deg, #22c55e 0%, #16a34a 100%)',
                  color: 'white',
                  border: 'none',
                  borderRadius: '10px',
                  cursor: loading ? 'not-allowed' : 'pointer',
                  opacity: loading ? 0.7 : 1,
                  fontSize: '16px',
                  fontWeight: '600',
                  boxShadow: '0 4px 15px rgba(34, 197, 94, 0.3)'
                }}
              >
                {loading ? 'Submitting...' : 'Submit Review'}
              </button>
              <button
                type="button"
                onClick={handleSkip}
                style={{
                  padding: '12px 24px',
                  background: 'linear-gradient(135deg, #6b7280 0%, #4b5563 100%)',
                  color: 'white',
                  border: 'none',
                  borderRadius: '10px',
                  cursor: 'pointer',
                  fontSize: '16px',
                  fontWeight: '600',
                  boxShadow: '0 4px 15px rgba(107, 114, 128, 0.3)'
                }}
              >
                Skip
              </button>
            </div>
            
            {error && (
              <div style={{ 
                color: '#dc2626', 
                marginTop: '15px', 
                textAlign: 'center',
                padding: '10px',
                background: '#fef2f2',
                borderRadius: '8px',
                border: '1px solid #fecaca'
              }}>
                {error}
              </div>
            )}
            {success && (
              <div style={{ 
                color: '#059669', 
                marginTop: '15px', 
                textAlign: 'center',
                padding: '10px',
                background: '#f0fdf4',
                borderRadius: '8px',
                border: '1px solid #bbf7d0'
              }}>
                {success}
              </div>
            )}
          </form>
        </div>
      </div>
    </div>
  );
};

export default ReviewModal; 