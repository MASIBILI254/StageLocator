import React, { useState, useEffect } from 'react';
import api from '../services/Api';
import StageList from '../components/StageList';
import './AdminDashBoard.css';

const AdminDashboard = () => {
  const [stages, setStages] = useState([]);
  const [analytics, setAnalytics] = useState(null);
  const [mostSearched, setMostSearched] = useState([]);
  const [loading, setLoading] = useState(true);

  // Fetch all data
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);

        const [stagesRes, analyticsRes, searchedRes] = await Promise.all([
          api.get('/stages/getall'),
          api.get('/stages/analytics'),
          api.get('/stages/most-searched'),
        ]);

        setStages(stagesRes.data);
        setAnalytics(analyticsRes.data);
        setMostSearched(searchedRes.data);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching dashboard data:', error);
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  return (
    <div className="admin-dashboard">
      <h2 className="dashboard-title">Dashboard</h2>

      {loading ? (
        <p>Loading...</p>
      ) : (
        <>
          <div className="dashboard-widgets">
            <div className="widget-card">
              <h3>Most Searched Stages</h3>
              <ul>
                {(mostSearched || []).map((stage) => (
                  <li key={stage._id}>
                    {stage.name} — {stage.searchCount} searches
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* Stage Table */}
          <StageList stages={stages} />
        </>
      )}
    </div>
  );
};

export default AdminDashboard;
