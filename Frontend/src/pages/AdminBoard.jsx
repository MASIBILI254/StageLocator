import React, { useState, useEffect } from 'react';
import api from '../services/Api';
import StageList from '../components/StageList';
import './AdminDashBoard.css';
import Navbar from '../navbar/Navbar';
import AdminSidebar from '../components/AdminSidebar';
import { MdLocationOn, MdReport, MdStar } from 'react-icons/md';

const AdminDashboard = () => {
  const [stages, setStages] = useState([]);
  const [mostSearched, setMostSearched] = useState([]);
  const [loading, setLoading] = useState(true);
  const [totalReports, setTotalReports] = useState(0);
  const [totalReviews, setTotalReviews] = useState(0);

  // Fetch all data
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        // Ensure token is present for protected endpoints
        const token = localStorage.getItem('token');
        if (!token) {
          setLoading(false);
          return;
        }
        const [stagesRes, searchedRes, reportsRes, reviewsRes] = await Promise.all([
          api.get('/stages/getAll'),
          api.get('/stages/most-searched'),
          api.get('/incident-reports/count'),
          api.get('/reviews/count'),
        ]);
        setStages(stagesRes.data);
        setMostSearched(searchedRes.data);
        setTotalReports(reportsRes.data.count || 0);
        setTotalReviews(reviewsRes.data.count || 0);
        setLoading(false);
      } catch (error) {
        if (error.response && (error.response.status === 401 || error.response.status === 403)) {
          // Optionally, redirect to login or show a message
          alert('Session expired or unauthorized. Please log in as admin.');
        } else {
          console.error('Error fetching dashboard data:', error);
        }
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  return (
    <>
      <Navbar />
      <div className="admin-dashboard-layout">
        <AdminSidebar />
        <main className="admin-dashboard-main">
          <h2 className="dashboard-title">Dashboard Overview</h2>
          {loading ? (
            <p>Loading...</p>
          ) : (
            <>
              <div className="dashboard-metrics">
                <div className="metric-card">
                  <MdLocationOn size={32} className="metric-icon" />
                  <div>
                    <div className="metric-value">{stages.length}</div>
                    <div className="metric-label">Total Stages</div>
                  </div>
                </div>
                <div className="metric-card">
                  <MdReport size={32} className="metric-icon" />
                  <div>
                    <div className="metric-value">{totalReports}</div>
                    <div className="metric-label">Incident Reports</div>
                  </div>
                </div>
                <div className="metric-card">
                  <MdStar size={32} className="metric-icon" />
                  <div>
                    <div className="metric-value">{totalReviews}</div>
                    <div className="metric-label">Reviews</div>
                  </div>
                </div>
              </div>
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
              <div className="dashboard-stage-list">
                
              </div>
            </>
          )}
        </main>
      </div>
    </>
  );
};

export default AdminDashboard;
