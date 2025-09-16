import React, { useState, useEffect } from 'react';
import api from '../services/Api';
import AdminSidebar from '../components/AdminSidebar';
import '../components/StageList.css';

const STATUS_OPTIONS = ['pending', 'in review', 'resolved'];

function IncidentReports() {
  const [reports, setReports] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [updateStatus, setUpdateStatus] = useState({});
  const [updateResponse, setUpdateResponse] = useState({});
  const [saving, setSaving] = useState({});

  useEffect(() => {
    fetchReports();
  }, []);

  const fetchReports = async () => {
    setLoading(true);
    setError('');
    try {
      const res = await api.get('/incident-reports/all');
      setReports(res.data);
    } catch (err) {
      setError('Failed to fetch incident reports');
    }
    setLoading(false);
  };

  const handleStatusChange = (id, value) => {
    setUpdateStatus(prev => ({ ...prev, [id]: value }));
  };
  const handleResponseChange = (id, value) => {
    setUpdateResponse(prev => ({ ...prev, [id]: value }));
  };

  const handleSave = async (id) => {
    setSaving(prev => ({ ...prev, [id]: true }));
    try {
      await api.patch(`/incident-reports/${id}`, {
        status: updateStatus[id],
        adminResponse: updateResponse[id],
      });
      fetchReports();
    } catch (err) {
      alert('Failed to update report');
    }
    setSaving(prev => ({ ...prev, [id]: false }));
  };

  if (loading) return <div>Loading incident reports...</div>;
  if (error) return <div style={{ color: 'red' }}>{error}</div>;

  return (
    <>
    <AdminSidebar />
      <div className="stage-list-container">
        
        <h2 className="stage-list-title">Incident Reports</h2>
        <table className="stage-list-table">
          <thead>
            <tr>
              <th>Type</th>
              <th>User</th>
              <th>Description</th>
              <th>Contact</th>
              <th>Status</th>
              <th>Admin Response</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {reports.length === 0 ? (
              <tr>
                <td colSpan="7" className="stage-list-no-data">No incident reports found.</td>
              </tr>
            ) : (
              reports.map(report => (
                <tr key={report._id} style={{ background: report.status === 'resolved' ? 'green' : 'red' }}>
                  <td>{report.type}</td>
                  <td>{report.userId?.username || 'Anonymous'}</td>
                  <td style={{ maxWidth: 200, wordBreak: 'break-word' }}>{report.description}</td>
                  <td>{report.contactInfo || '-'}</td>
                  <td>
                    <select
                      value={updateStatus[report._id] ?? report.status}
                      onChange={e => handleStatusChange(report._id, e.target.value)}
                      style={{ padding: 4, borderRadius: 4 }}
                    >
                      {STATUS_OPTIONS.map(opt => (
                        <option key={opt} value={opt}>{opt}</option>
                      ))}
                    </select>
                  </td>
                  <td>
                    <input
                      type="text"
                      value={updateResponse[report._id] ?? (report.adminResponse || '')}
                      onChange={e => handleResponseChange(report._id, e.target.value)}
                      style={{ width: '100%', padding: 4, borderRadius: 4 }}
                      placeholder="Response..."
                    />
                  </td>
                  <td className="stage-list-actions">
                    <button
                      onClick={() => handleSave(report._id)}
                      disabled={saving[report._id]}
                      className="stage-list-edit-btn"
                    >
                      {saving[report._id] ? 'Saving...' : 'Save'}
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </>
  );
}

export default IncidentReports; 