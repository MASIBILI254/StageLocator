import React, { useState, useEffect } from 'react';
import api from '../services/Api';
import AdminSidebar from './AdminSidebar';
import {
  Table, TableBody, TableCell, TableContainer, TableHead, TableRow,
  Paper, Typography, Box, CircularProgress
} from '@mui/material';

export const AdminReviewList = () => {
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchReviews = async () => {
      try {
        const res = await api.get('/reviews/all');
        setReviews(res.data);
      } catch (err) {
        console.error('API Error:', err);
        setError('Failed to load reviews');
      } finally {
        setLoading(false);
      }
    };
    fetchReviews();
  }, []);

  return (
    <Box display="flex" minHeight="100vh">
      <AdminSidebar />
      <Box
        flex={1}
        sx={{
          p: 4,
          ml: { xs: 0, sm: '180px' },
          maxWidth: 'calc(100% - 180px)',
          overflowX: 'auto',
        }}
      >
        {loading ? (
          <Box display="flex" justifyContent="center" alignItems="center" minHeight="80vh">
            <CircularProgress />
          </Box>
        ) : error ? (
          <Typography color="error">{error}</Typography>
        ) : (
          <>
            <Typography variant="h5" gutterBottom fontWeight="bold" color="primary">
              All User Reviews
            </Typography>

            {reviews.length === 0 ? (
              <Typography>No reviews found.</Typography>
            ) : (
              <TableContainer
                component={Paper}
                sx={{
                  borderRadius: 2,
                  mt: 2,
                  boxShadow: 3,
                  overflowX: 'auto',
                  maxHeight: '75vh',
                }}
              >
                <Table stickyHeader>
                  <TableHead sx={{ backgroundColor: '#f3f4f6' }}>
                    <TableRow>
                      <TableCell><strong>User</strong></TableCell>
                      <TableCell><strong>Stage Searched</strong></TableCell>
                      <TableCell><strong>Rating</strong></TableCell>
                      <TableCell><strong>Comment</strong></TableCell>
                      <TableCell><strong>Date</strong></TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {reviews.map((r) => (
                      <TableRow key={r._id} hover>
                        <TableCell>{r.user?.username || 'User'}</TableCell>
                        <TableCell>{r.stage?.name || 'Stage'}</TableCell>
                        <TableCell>{r.rating ?? 'N/A'}</TableCell>
                        <TableCell>{r.comment ?? 'No comment'}</TableCell>
                        <TableCell>
                          {r.createdAt
                            ? new Date(r.createdAt).toLocaleString()
                            : 'Unknown'}
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </TableContainer>
            )}
          </>
        )}
      </Box>
    </Box>
  );
};
