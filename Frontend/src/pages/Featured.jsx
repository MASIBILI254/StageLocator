import React, { useState, useEffect } from 'react'
import axios from 'axios';
import './Featured.css'
import TransportMap from '../components/Transportmap';
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

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const response = await axios.get('http://localhost:3000/stages/getall');
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
  const handleGetDirections = (destination) => {
    setSelectedDestination(destination);
    setShowMap(true);
  };
  
  const closeMap = () => {
    setShowMap(false);
  };
  
  // Handle payment initiation
  const handlePayment = (result) => {
    setPaymentDetails({
      amount: result.fare,
      destination: result.destination,
      companyName: result.companyName
    });
    setShowPayment(true);
  };
  
  // Close payment modal
  const closePayment = () => {
    setShowPayment(false);
  };

  return (
    <div>
      <div className="Container">
        <h2 className="text">Featured Stages</h2>
        
        {stages.length === 0 ? (
          <p className="heading">No stages available at the moment.</p>
        ) : (
          <div className="grid">
            {stages.map((stage) => (
              <div 
                key={stage._id} 
                className="content"
              >
                <div className="padding">
                  <h2>{stage.name || 'Unnamed Stage'}</h2>
                 
                  {stage.routes && stage.routes.length > 0 && (
                    <div className="routes">
                      <h2>Routes</h2>
                      <div className="flex flex-wrap gap-2">
                        {stage.routes.map((route, index) => (
                          <div key={index} className='Card'>
                            <p>Destination: {route.destination}</p>
                            <p>Fare: {route.fare}</p>
                            <p>Duration:{route.duration}</p>
                            <button 
                              className="btn" 
                              onClick={() => handleGetDirections(route.destination)}
                            >
                              Get Directions
                            </button>
                            <button 
                              className="btn-pay"
                              onClick={() => handlePayment(route)}
                            >
                              PAY
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
        onClose={closeMap}/>
      {/* M-Pesa Payment Component */}
      <MpesaPayment
        isOpen={showPayment}
        onClose={closePayment}
        amount={paymentDetails.amount}
        destination={paymentDetails.destination}
        companyName={paymentDetails.companyName}
      />
    </div>
  );
}
export default Featured;