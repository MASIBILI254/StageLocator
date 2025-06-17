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
  CircularProgress
} from '@mui/material';
import AdminSidebar from './AdminSidebar';
import './StageAnalytics.css';

const StageAnalytics = () => {
  const [analytics, setAnalytics] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchAnalytics = async () => {
      try {
        const data = await getStageAnalytics();
        setAnalytics(data);
        setLoading(false);
      } catch (err) {
        setError(err.message || 'Failed to fetch analytics');
        setLoading(false);
      }
    };

    fetchAnalytics();
  }, []);

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="400px">
        <CircularProgress />
      </Box>
    );
  }

  if (error) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="400px">
        <Typography color="error">{error}</Typography>
      </Box>
    );
  }

  return (
    <><AdminSidebar /><Box p={3}>
      <Typography variant="h4" gutterBottom>
        Stage Analytics
      </Typography>
      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell><strong>Stage Name</strong></TableCell>
              <TableCell align="right"><strong>Total Searches</strong></TableCell>
              <TableCell align="right"><strong>Last Searched</strong></TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {analytics.map((stage) => (
              <TableRow key={stage.stageId}>
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
    </Box></>
  );
};

export default StageAnalytics; 