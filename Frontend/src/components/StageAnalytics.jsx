import React, { useState, useEffect } from 'react';
import {
  Table, TableBody, TableCell, TableContainer, TableHead, TableRow,
  Paper, Typography, Box, CircularProgress, Avatar, Card, CardContent,
  Grid, Chip
} from '@mui/material';
import AdminSidebar from './AdminSidebar';
import { getStageAnalytics } from '../services/stageService';
import api from '../services/Api';



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
        <Typography variant="h4" gutterBottom sx={{ fontWeight: 'bold', mb: 3, color: 'white' }}>
          Stage Analytics
        </Typography>

        <Grid container spacing={3}>
          {analytics.map((stage) => (
            <Grid item xs={12} md={4} sm={6} key={stage.stageId}>
              <Card sx={{ borderRadius: 3, p: 2, background: '#f9fafb',marginRight:12 }}>
                <Box display="flex" alignItems="center" gap={2}>
                  <Box>
                    <Typography variant="h6" fontWeight="bold">{stage.stageName}</Typography>
                    <Typography variant="body2" color="textSecondary">{stage.desc}</Typography>
                    <Typography variant="body2" color="#2d3748">
                      Last searched: {new Date(stage.lastSearched).toLocaleString()}
                    </Typography>
                    <Chip label={`Searches: ${stage.searchCount}`} sx={{ mt: 1, background:"#2d3748",color:"whitesmoke"}} />
                  </Box>
                </Box>

                <Box mt={2}>
                  <Typography variant="subtitle2" fontWeight="bold">Routes</Typography>
                  <Table size="small">
                    <TableHead>
                      <TableRow>
                        <TableCell>Destination</TableCell>
                        <TableCell>Fare (KES)</TableCell>
                        <TableCell>Duration</TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {stage.routes?.map((route) => (
                        <TableRow key={route._id}>
                          <TableCell>{route.destination}</TableCell>
                          <TableCell>{route.fare}</TableCell>
                          <TableCell>{route.duration}</TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </Box>
              </Card>
            </Grid>
          ))}
        </Grid>
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
          borderRadius: '10px',
          minHeight: '100vh',
          color: 'white'
        }}
      >
        {renderContent()}
    
      </Box>
    </Box>
  );
};

export default StageAnalytics;
