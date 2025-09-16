import React, { useState, useEffect } from 'react'
import './Featured.css';
import api from '../services/Api';
import TransportMap from '../components/Transportmap';
import ReviewModal from '../components/ReviewModal';
import MpesaPayment from '../components/Mpesa';

function Featured() {
  const [stages, setStages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [transportData, setTransportData] = useState([]);
  const [showMap, setShowMap] = useState(false);
  const [selectedDestination, setSelectedDestination] = useState('');
  // New state for M-Pesa payment
  const [showPayment, setShowPayment] = useState(false);
  const [paymentDetails, setPaymentDetails] = useState({
    amount: 0,
    destination: '',
    companyName: ''
  });
  const [showReviewModal, setShowReviewModal] = useState(false);
  const [reviewStage, setReviewStage] = useState(null);

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
        setError('Failed to load stages. Please try again later.');
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  if (loading) {
    return (
      <div className="spine">
        <div className="spinner"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="error">
        <p>{error}</p>
      </div>
    );
  }
  const handleGetDirections = async (destination) => {
    setSelectedDestination(destination);
    setShowMap(true);
    // Find the stage name for this destination
    const stage = stages.find(s => s.routes.some(r => r.destination === destination));
    if (stage) {
      setReviewStage(stage);
      try {
        await api.post('/stages/increment-searchcount', { stageName: stage.name });
      } catch (err) {
        console.error('Failed to increment search count for', stage.name, err);
      }
    }
  };
  
  const closeMap = () => {
    setShowMap(false);
  };
  
  const handleMapClose = () => {
    console.log('=== handleMapClose called from Featured ===');
    console.log('Map closed, reviewStage:', reviewStage);
    // Show review modal after map is closed
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

  const handlePayment = (result) => {
    setPaymentDetails({
      amount: result.fare,
      destination: result.destination,
      companyName: result.companyName
    });
    setShowPayment(true);
  };
  
  const closePayment = () => {
    setShowPayment(false);
  };

  return (
    <div>
      <div className="featured-container">
        <h2 className="text">Featured Stages</h2>
        
        
        {stages.length === 0 ? (
          <p className="featured-heading">No stages available at the moment.</p>
        ) : (
          <div className="featured-grid">
            {stages.map((stage) => (
              <div 
                key={stage._id} 
                className="content"
              >
                <div className="padding" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '10px' }}>
                  {stage.img && (
                    <img src={stage.img} alt={stage.name} style={{width: '400px', height: '400px', borderRadius: '12px', objectFit: 'cover'}} />
                  )}
                  <h2 style={{ margin: 0 }}>{stage.name || 'Unnamed Stage'}</h2>
                  {stage.boardingPoint && (
                    <p style={{ margin: 0, fontWeight: 500, color: '#FFD700' }}>Boarding Point: {stage.boardingPoint}</p>
                  )}
                  {stage.routes && stage.routes.length > 0 && (
                    <div className="routes">
                      <div className="flex flex-wrap gap-2">
                        {stage.routes.map((route, index) => (
                          <div key={index} className='Card'>
                            <h3>Route Number: {route.number}</h3>
                            <p>Destination: {route.destination}</p>
                            <p>Estimated Fare: {route.fare}</p>
                            <p>Duration: {route.duration}</p>
                            <button 
                              className="btn" 
                              onClick={() => handleGetDirections(route.destination)}
                            >
                              Get Directions
                            </button>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
      <TransportMap destination={selectedDestination}
        showMap={showMap}
        onClose={closeMap}
        onMapClose={handleMapClose}/>
      {/* M-Pesa Payment Component */}
      <MpesaPayment
        isOpen={showPayment}
        onClose={closePayment}
        amount={paymentDetails.amount}
        destination={paymentDetails.destination}
        companyName={paymentDetails.companyName}
      />
      {/* Review Modal */}
      <ReviewModal
        isOpen={showReviewModal}
        onClose={closeReviewModal}
        stageId={reviewStage?._id}
        stageName={reviewStage?.name}
      />
    </div>
  );
}
export default Featured;