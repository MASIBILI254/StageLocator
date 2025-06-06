import React, { useState, useEffect } from 'react';
import api from '../services/Api';
import AdminSidebar from '../components/AdminSidebar';
import StageList from '../components/StageList';
import './AdminDashboard.css'; // Make sure this CSS file exists

const AdminDashboard = () => {
  const [stages, setStages] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const response = await api.get('/stages/getall');
        console.log(response.data);
        setStages(response.data);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching stages data:', error);
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  return (
    <div className="admin-dashboard">
      <h2 className="dashboard-title">Dashboard</h2>
      <StageList />
    </div>
  );
};

export default AdminDashboard;
