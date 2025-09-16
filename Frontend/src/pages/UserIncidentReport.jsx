import React, { useState } from 'react';
import api from '../services/Api';
import ImageUpload from '../components/ImageUpload';
import { useAuth } from '../Context/AuthContext';
import { useNavigate } from 'react-router-dom';
import UserSidebar from '../components/UserSidebar';

const INCIDENT_TYPES = [
  { value: 'harassment', label: 'Harassment' },
  { value: 'lost item', label: 'Lost Item' },
  { value: 'accident', label: 'Accident' },
  { value: 'other', label: 'Other' },
];

const UserIncidentReport = () => {
  const [type, setType] = useState('harassment');
  const [description, setDescription] = useState('');
  const [contactInfo, setContactInfo] = useState('');
  const [photo, setPhoto] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const { user } = useAuth();
  const navigate = useNavigate();

  const handleImageUpload = (images) => {
    setPhoto(images);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    setLoading(true);
    try {
      await api.post('/incident-reports/submit', {
        type,
        description,
        photoUrl: photo[0]?.url || '',
        contactInfo,
      });
      setSuccess('Incident report submitted successfully! Thank you for reporting.');
      setTimeout(() => {
        navigate('/home');
      }, 3000);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to submit incident report');
    }
    setLoading(false);
  };

  const handleCancel = () => {
    navigate('/');
  };

  return (
    <div style={{ display: 'flex', minHeight: '100vh',marginTop:0 }}>
      <UserSidebar />
      <div style={{ 
        flex: 1, 
        padding: '20px',
        minHeight: '100vh'
      }}>
        <div style={{
          maxWidth: '800px',
          padding: '40px 20px'
        }}>
          <div style={{
            marginTop:'0px',
            background: 'rgba(252, 252, 252, 0.97)',
            padding: '40px',
            borderRadius: '20px',
            boxShadow: '0 20px 40px rgba(0, 0, 0, 0.1)'
          }}>
            <h2 style={{
              marginBottom: '30px',
              textAlign: 'center',
              fontSize: '28px',
              fontWeight: 'bold',
              color: '#1f2937',
              marginTop: 0
            }}>
              Report an Incident
            </h2>
            
            <p style={{
              textAlign: 'center',
              color: '#6b7280',
              marginBottom: '30px',
              fontSize: '16px'
            }}>
              Help us maintain a safe environment by reporting any incidents you've experienced.
            </p>

            <form onSubmit={handleSubmit}>
              <div style={{ marginBottom: '25px' }}>
                <label style={{ 
                  display: 'block', 
                  marginBottom: '10px', 
                  fontWeight: 600,
                  color: '#374151',
                  fontSize: '16px'
                }}>
                  Incident Type: *
                </label>
                <select
                  value={type}
                  onChange={e => setType(e.target.value)}
                  style={{ 
                    width: '100%', 
                    padding: '12px', 
                    borderRadius: '10px', 
                    border: '2px solid #e5e7eb', 
                    fontSize: '16px',
                    background: 'white'
                  }}
                  required
                >
                  {INCIDENT_TYPES.map(opt => (
                    <option key={opt.value} value={opt.value}>{opt.label}</option>
                  ))}
                </select>
              </div>

              <div style={{ marginBottom: '25px' }}>
                <label style={{ 
                  display: 'block', 
                  marginBottom: '10px', 
                  fontWeight: 600,
                  color: '#374151',
                  fontSize: '16px'
                }}>
                  Description: *
                </label>
                <textarea
                  value={description}
                  onChange={e => setDescription(e.target.value)}
                  placeholder="Please provide a detailed description of the incident..."
                  required
                  rows={6}
                  style={{ 
                    width: '100%', 
                    padding: '12px', 
                    borderRadius: '10px', 
                    border: '2px solid #e5e7eb', 
                    fontSize: '16px', 
                    resize: 'vertical', 
                    fontFamily: 'inherit',
                    background: 'white'
                  }}
                />
              </div>

              <div style={{ marginBottom: '25px' }}>
                <label style={{ 
                  display: 'block', 
                  marginBottom: '10px', 
                  fontWeight: 600,
                  color: '#374151',
                  fontSize: '16px'
                }}>
                  Photo Evidence (optional):
                </label>
                <ImageUpload onImageUpload={handleImageUpload} initialImage={null} />
              </div>

              <div style={{ marginBottom: '30px' }}>
                <label style={{ 
                  display: 'block', 
                  marginBottom: '10px', 
                  fontWeight: 600,
                  color: '#374151',
                  fontSize: '16px'
                }}>
                  Contact Information (optional):
                </label>
                <input
                  type="text"
                  value={contactInfo}
                  onChange={e => setContactInfo(e.target.value)}
                  placeholder="Email or phone number for follow-up"
                  style={{ 
                    width: '100%', 
                    padding: '12px', 
                    borderRadius: '10px', 
                    border: '2px solid #e5e7eb', 
                    fontSize: '16px',
                    background: 'white'
                  }}
                />
              </div>

              <div style={{ display: 'flex', gap: '20px', justifyContent: 'center' }}>
                <button
                  type="submit"
                  disabled={loading}
                  style={{
                    padding: '14px 28px',
                    background: 'linear-gradient(135deg, #f59e42 0%, #f97316 100%)',
                    color: 'white',
                    border: 'none',
                    borderRadius: '12px',
                    cursor: loading ? 'not-allowed' : 'pointer',
                    opacity: loading ? 0.7 : 1,
                    fontSize: '16px',
                    fontWeight: '600',
                    boxShadow: '0 4px 15px rgba(251, 146, 60, 0.2)',
                    transition: 'all 0.3s ease'
                  }}
                >
                  {loading ? 'Submitting...' : 'Submit Report'}
                </button>
                <button
                  type="button"
                  onClick={handleCancel}
                  style={{
                    padding: '14px 28px',
                    background: 'linear-gradient(135deg, #6b7280 0%, #4b5563 100%)',
                    color: 'white',
                    border: 'none',
                    borderRadius: '12px',
                    cursor: 'pointer',
                    fontSize: '16px',
                    fontWeight: '600',
                    boxShadow: '0 4px 15px rgba(107, 114, 128, 0.3)',
                    transition: 'all 0.3s ease'
                  }}
                >
                  Cancel
                </button>
              </div>

              {error && (
                <div style={{ 
                  color: '#dc2626', 
                  marginTop: '20px', 
                  textAlign: 'center', 
                  padding: '15px', 
                  background: '#fef2f2', 
                  borderRadius: '10px', 
                  border: '1px solid #fecaca',
                  fontSize: '14px'
                }}>
                  {error}
                </div>
              )}
              
              {success && (
                <div style={{ 
                  color: '#16a34a', 
                  marginTop: '20px', 
                  textAlign: 'center', 
                  padding: '15px', 
                  background: '#f0fdf4', 
                  borderRadius: '10px', 
                  border: '1px solid #bbf7d0',
                  fontSize: '14px'
                }}>
                  {success}
                </div>
              )}
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserIncidentReport; 