import React, { useState, useEffect } from 'react';
import { getStageAnalytics } from '../services/stageService';
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Typography,
  Box,
  CircularProgress,
} from '@mui/material';
import AdminSidebar from './AdminSidebar';
import api from '../services/Api';

const AdminReviewList = () => {
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchReviews = async () => {
      try {
        const res = await api.get('/reviews/all');
        setReviews(res.data);
      } catch (err) {
        setError('Failed to load reviews');
      }
      setLoading(false);
    };
    fetchReviews();
  }, []);

  if (loading) return <div>Loading reviews...</div>;
  if (error) return <div style={{ color: 'red' }}>{error}</div>;

  return (
    <div style={{ marginTop: 32 }}>
      <h3>All User Reviews</h3>
      {reviews.length === 0 ? (
        <div>No reviews found.</div>
      ) : (
        <table style={{ width: '100%', borderCollapse: 'collapse', marginTop: 16,background:'whitesmoke', borderRadius:'10px' }}>
          <thead>
            <tr style={{ background: '#f3f4f6' }}>
              <th style={{ border: '1px solid #e5e7eb', padding: 8 }}>User</th>
              <th style={{ border: '1px solid #e5e7eb', padding: 8 }}>Stage</th>
              <th style={{ border: '1px solid #e5e7eb', padding: 8 }}>Rating</th>
              <th style={{ border: '1px solid #e5e7eb', padding: 8 }}>Comment</th>
              <th style={{ border: '1px solid #e5e7eb', padding: 8 }}>Date</th>
            </tr>
          </thead>
          <tbody>
            {reviews.map(r => (
              <tr key={r._id}>
                <td style={{ border: '1px solid #e5e7eb', padding: 8 }}>{r.user?.username || 'User'}</td>
                <td style={{ border: '1px solid #e5e7eb', padding: 8 }}>{r.stage?.name || 'Stage'}</td>
                <td style={{ border: '1px solid #e5e7eb', padding: 8 }}>{r.rating}</td>
                <td style={{ border: '1px solid #e5e7eb', padding: 8 }}>{r.comment}</td>
                <td style={{ border: '1px solid #e5e7eb', padding: 8 }}>{new Date(r.createdAt).toLocaleString()}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
};

const StageAnalytics = () => {
  const [analytics, setAnalytics] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchAnalytics = async () => {
      try {
        const data = await getStageAnalytics();
        setAnalytics(data);
      } catch (err) {
        setError(err.message || 'Failed to fetch analytics');
      } finally {
        setLoading(false);
      }
    };

    fetchAnalytics();
  }, []);

  const renderContent = () => {
    if (loading) {
      return (
        <Box display="flex" justifyContent="center" alignItems="center" minHeight="60vh">
          <CircularProgress />
        </Box>
      );
    }

    if (error) {
      return (
        <Box display="flex" justifyContent="center" alignItems="center" minHeight="60vh">
          <Typography color="error" variant="h6">
            {error}
          </Typography>
        </Box>
      );
    }

    return (
      <Box>
        <Typography variant="h4" gutterBottom sx={{ fontWeight: 'bold', mb: 3 }}>
          Stage Analytics
        </Typography>

        <TableContainer component={Paper} sx={{ borderRadius: 3, boxShadow: 2 }}>
          <Table>
            <TableHead sx={{ backgroundColor: '#f5f5f5' }}>
              <TableRow>
                <TableCell sx={{ fontWeight: 'bold' }}>Stage Name</TableCell>
                <TableCell align="right" sx={{ fontWeight: 'bold' }}>Total Searches</TableCell>
                <TableCell align="right" sx={{ fontWeight: 'bold' }}>Last Searched</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {analytics.map((stage) => (
                <TableRow key={stage.stageId} hover>
                  <TableCell>{stage.stageName}</TableCell>
                  <TableCell align="right">{stage.totalSearches}</TableCell>
                  <TableCell align="right">
                    {new Date(stage.lastSearched).toLocaleString()}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </Box>
    );
  };

  return (
    <Box display="flex">
      <AdminSidebar />
      <Box
        component="main"
        sx={{
          flexGrow: 1,
          p: 4,
          ml: { sm: '180px' },
          backgroundColor: '#2d3748',
          borderRadius:'10px',
          minHeight: '100vh',
        }}
      >
        {renderContent()}
        <AdminReviewList />
      </Box>
    </Box>
  );
};

export default StageAnalytics;
