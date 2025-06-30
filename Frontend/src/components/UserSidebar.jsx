import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../Context/AuthContext';
import api from '../services/Api';
import TransportMap from './Transportmap';
import ReviewModal from './ReviewModal';
import { CgMenuGridR } from "react-icons/cg";
import { MdOutlineAccessAlarms } from "react-icons/md";
import IncidentReportModal from './IncidentReportModal';
import { CgDanger } from "react-icons/cg";
import { Link } from 'react-router-dom';


const UserSidebar = () => {
  const [lastStage, setLastStage] = useState(null);
  const [showMap, setShowMap] = useState(false);
  const [selectedDestination, setSelectedDestination] = useState('');
  const { user } = useAuth();
  const navigate = useNavigate();
  const [showIncidentModal, setShowIncidentModal] = useState(false);
  const [showReviewModal, setShowReviewModal] = useState(false);
  const [reviewStage, setReviewStage] = useState(null);

  const fetchLastStage = async () => {
    if (user) {
      try {
        const res = await api.get('/users/last-searched-stage');
        setLastStage(res.data);
        return;
      } catch (err) {
        setLastStage(null);
        return;
      }
    }
    const last = localStorage.getItem('lastSearchedStage');
    if (last) {
      try {
        setLastStage(JSON.parse(last));
      } catch (err) {
        setLastStage(null);
      }
    } else {
      setLastStage(null);
    }
  };

  useEffect(() => {
    fetchLastStage();
  }, [user]);

  useEffect(() => {
    const handleStorageChange = () => {
      fetchLastStage();
    };

    window.addEventListener('storage', handleStorageChange);
    const interval = setInterval(fetchLastStage, 3000);

    return () => {
      window.removeEventListener('storage', handleStorageChange);
      clearInterval(interval);
    };
  }, [user]);

  const handleGetDirections = (destination) => {
    setSelectedDestination(destination);
    setShowMap(true);
    if (lastStage && lastStage.routes && lastStage.routes.some(route => route.destination === destination)) {
      setReviewStage(lastStage);
    }
  };

  const closeMap = () => {
    setShowMap(false);
  };

  const handleMapClose = () => {
    console.log('=== handleMapClose called from UserSidebar ===');
    console.log('Map closed, reviewStage:', reviewStage);
    if (reviewStage) {
      console.log('Showing review modal for stage:', reviewStage.name);
      setShowReviewModal(true);
    } else {
      console.log('No reviewStage set, not showing modal');
    }
  };

  const closeReviewModal = () => {
    console.log('Closing review modal');
    setShowReviewModal(false);
    setReviewStage(null);
  };

  return (
    <>
      <aside   style={{
      width: 180,
      background: 'rgba(30,41,59,0.6)',
      borderRight: '1px solid',
      minHeight: '100vh',
      marginLeft: 10,
  }}>
        <Link to='/home' style={{textDecoration:'none'}}>
        <h2 style={{
          fontSize: 20,
          marginBottom: 32,
          marginLeft: 0,
          color: 'white',
          display: 'flex',
          alignItems: 'center',
          gap: 10
        }}>
          <CgMenuGridR size={28} style={{
            background: 'rgba(56, 191, 248, 0.54)',
            borderRadius: '8px',
            padding: 4,
            color: 'white',
            boxShadow: '0 2px 8px rgba(102, 126, 234, 0.2)'
          }}/>
          Menu
        </h2>
        
        </Link>
        <div style={{ marginBottom: 30 }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 10 }}>
            <h4 style={{
              color: 'white',
              marginBottom: 8,
              marginTop: 0,
              display: 'flex',
              alignItems: 'center',
              gap: 8,
              fontSize:18,
            }}>
              <MdOutlineAccessAlarms size={32} style={{
                color: '#38bdf8',
                background: 'rgba(56,189,248,0.1)',
                borderRadius: '6px',
                padding: 2
              }}/>
            Recent
            </h4>
          </div>
          {lastStage ? (
            <div style={{  borderRadius: 8, padding: 12,color: 'white',marginTop:'0px', marginLeft:'0.5rem' }}>
              <div><strong>{lastStage.name}</strong></div>
              <button 
                style={{ marginTop: 16, padding: '8px 16px', background: '#1e3a8a', color: 'white', border: 'none', borderRadius: '10px', cursor: 'pointer' }}
                onClick={() => handleGetDirections(lastStage.name)}
              >
                Get Directions
              </button>
            </div>
          ) : (
            <div style={{ color: '#888' }}>No recent stage</div>
          )}
        </div>
        <Link to="/report" style={{
          textDecoration: 'none',
          display: 'block',
          padding: '12px 8px',
          borderRadius: '8px',
          transition: 'background-color 0.3s ease',
          cursor: 'pointer',
          ':hover': {
            backgroundColor: 'rgba(255, 255, 255, 0.1)'
          }
        }} onMouseEnter={(e) => {
          e.target.style.backgroundColor = 'rgba(255, 255, 255, 0.1)';
        }} onMouseLeave={(e) => {
          e.target.style.backgroundColor = 'transparent';
        }}>
          <div style={{ 
            color: 'white',
            marginBottom: 8,
            marginTop: 0,
            display: 'flex',
            alignItems: 'center',
            gap: 8,
            fontSize: 18
          }}> 
            <CgDanger size={26} style={{
              color: 'red',
              background: 'rgba(106, 36, 27, 0.92)',
              borderRadius: '50%',
              marginBottom: 0,
            }}/>
            Report
          </div>
        </Link>
        
        <div>
          <IncidentReportModal isOpen={showIncidentModal} onClose={() => setShowIncidentModal(false)} />
        </div>
      </aside>
      <TransportMap 
        destination={selectedDestination}
        showMap={showMap}
        onClose={closeMap}
        onMapClose={handleMapClose}
      />
      
      {/* Review Modal */}
      <ReviewModal
        isOpen={showReviewModal}
        onClose={closeReviewModal}
        stageId={reviewStage?._id}
        stageName={reviewStage?.name}
      />
    </>
  );
};

export default UserSidebar; 