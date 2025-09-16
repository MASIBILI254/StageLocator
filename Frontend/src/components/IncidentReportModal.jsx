import React, { useState } from 'react';
import api from '../services/Api';
import ImageUpload from './ImageUpload';
import { useAuth } from '../Context/AuthContext';

const INCIDENT_TYPES = [
  { value: 'harassment', label: 'Harassment' },
  { value: 'lost item', label: 'Lost Item' },
  { value: 'accident', label: 'Accident' },
  { value: 'other', label: 'Other' },
];

const IncidentReportModal = ({ isOpen, onClose, stageId = null, stageName = '' }) => {
  const [type, setType] = useState('harassment');
  const [description, setDescription] = useState('');
  const [contactInfo, setContactInfo] = useState('');
  const [photo, setPhoto] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const { user } = useAuth();

  if (!isOpen) return null;

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
        stageId,
        type,
        description,
        photoUrl: photo[0]?.url || '',
        contactInfo,
      });
      setSuccess('Incident report submitted. Thank you!');
      setTimeout(() => {
        onClose();
        setType('harassment');
        setDescription('');
        setContactInfo('');
        setPhoto([]);
        setSuccess('');
      }, 2000);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to submit incident report');
    }
    setLoading(false);
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
          background: 'rgba(252, 252, 252, 0.97)',
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
            Report an Incident {stageName && `at ${stageName}`}
          </h3>
          <form onSubmit={handleSubmit}>
            <div style={{ marginBottom: '20px' }}>
              <label style={{ display: 'block', marginBottom: '8px', fontWeight: 600 }}>Type:</label>
              <select
                value={type}
                onChange={e => setType(e.target.value)}
                style={{ width: '100%', padding: '10px', borderRadius: '8px', border: '2px solid #e5e7eb', fontSize: '16px' }}
                required
              >
                {INCIDENT_TYPES.map(opt => (
                  <option key={opt.value} value={opt.value}>{opt.label}</option>
                ))}
              </select>
            </div>
            <div style={{ marginBottom: '20px' }}>
              <label style={{ display: 'block', marginBottom: '8px', fontWeight: 600 }}>Description:</label>
              <textarea
                value={description}
                onChange={e => setDescription(e.target.value)}
                placeholder="Describe the incident..."
                required
                rows={4}
                style={{ width: '100%', padding: '10px', borderRadius: '8px', border: '2px solid #e5e7eb', fontSize: '16px', resize: 'vertical', fontFamily: 'inherit' }}
              />
            </div>
            <div style={{ marginBottom: '20px' }}>
              <label style={{ display: 'block', marginBottom: '8px', fontWeight: 600 }}>Photo (optional):</label>
              <ImageUpload onImageUpload={handleImageUpload} initialImage={null} />
            </div>
            <div style={{ marginBottom: '20px' }}>
              <label style={{ display: 'block', marginBottom: '8px', fontWeight: 600 }}>Contact Info (optional):</label>
              <input
                type="text"
                value={contactInfo}
                onChange={e => setContactInfo(e.target.value)}
                placeholder="Email or phone (optional)"
                style={{ width: '100%', padding: '10px', borderRadius: '8px', border: '2px solid #e5e7eb', fontSize: '16px' }}
              />
            </div>
            <div style={{ display: 'flex', gap: '15px', justifyContent: 'center' }}>
              <button
                type="submit"
                disabled={loading}
                style={{
                  padding: '12px 24px',
                  background: 'linear-gradient(135deg, #f59e42 0%, #f97316 100%)',
                  color: 'white',
                  border: 'none',
                  borderRadius: '10px',
                  cursor: loading ? 'not-allowed' : 'pointer',
                  opacity: loading ? 0.7 : 1,
                  fontSize: '16px',
                  fontWeight: '600',
                  boxShadow: '0 4px 15px rgba(251, 146, 60, 0.2)'
                }}
              >
                {loading ? 'Submitting...' : 'Submit Report'}
              </button>
              <button
                type="button"
                onClick={onClose}
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
                Cancel
              </button>
            </div>
            {error && (
              <div style={{ color: '#dc2626', marginTop: '15px', textAlign: 'center', padding: '10px', background: '#fef2f2', borderRadius: '8px', border: '1px solid #fecaca' }}>
                {error}
              </div>
            )}
            {success && (
              <div style={{ color: '#16a34a', marginTop: '15px', textAlign: 'center', padding: '10px', background: '#f0fdf4', borderRadius: '8px', border: '1px solid #bbf7d0' }}>
                {success}
              </div>
            )}
          </form>
        </div>
      </div>
    </div>
  );
};

export default IncidentReportModal; 