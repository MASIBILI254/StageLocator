import React, { useState, useEffect } from "react";
import TransportMap from '../components/Transportmap';
import Featured from "./Featured";
import MpesaPayment from "../components/Mpesa";
import api from '../services/Api';
import "./Home.css";
import cdb from "../images/cbd.jpeg";
import Navbar from '../navbar/Navbar';
import { Link } from 'react-router-dom';
import UserSidebar from '../components/UserSidebar';
import { useAuth } from '../Context/AuthContext';
import ReviewModal from '../components/ReviewModal';


const Home = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [transportData, setTransportData] = useState([]);
  const [showMap, setShowMap] = useState(false);
  const [selectedDestination, setSelectedDestination] = useState('');
  
  const [showPayment, setShowPayment] = useState(false);
  const [paymentDetails, setPaymentDetails] = useState({
    amount: 0,
    destination: '',
    companyName: ''
  });
  
  const { user } = useAuth();
  
  const [showReviewModal, setShowReviewModal] = useState(false);
  const [reviewStage, setReviewStage] = useState(null);
  
  const [showIncidentModal, setShowIncidentModal] = useState(false);
  const [incidentStage, setIncidentStage] = useState(null);
  
  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await api.get('/stages/getall');
        console.log('Fetched data:', response.data);
        setTransportData(response.data);
      } catch (error) {
        console.error('Error fetching transport data:', error);
      }
    };
    fetchData();
  }, []);
  
  const handleSearch = async (query) => {
    setSearchQuery(query);
    
    if (!query.trim()) {
      setSearchResults([]);
      return;
    }
    
    const results = transportData.reduce((acc, company) => {
      const matchingRoutes = company.routes.filter(route =>
        route.destination.toLowerCase().includes(query.toLowerCase())
      );
      
      if (matchingRoutes.length > 0) {
        matchingRoutes.forEach(route => {
          acc.push({
            companyName: company.name,
            img: company.img,
            ...route
          });
        });
      }
      return acc;
    }, []);
    
    setSearchResults(results);

    // Increment searchCount for each unique companyName (stage name) in results
    const uniqueStageNames = [...new Set(results.map(r => r.companyName))];
    uniqueStageNames.forEach(async (stageName) => {
      try {
        await api.post('/stages/increment-searchcount', { stageName });
      } catch (err) {
        // Optionally handle error
        console.error('Failed to increment search count for', stageName, err);
      }
    });
  };
  
  const handleGetDirections = (destination) => {
    console.log('Getting directions for destination:', destination);
    setSelectedDestination(destination);
    setShowMap(true);
    // Find the stage (company) for this destination
    const stage = transportData.find(company =>
      company.routes.some(route => route.destination === destination)
    );
    console.log('Found stage:', stage);
    if (stage) {
      localStorage.setItem('lastSearchedStage', JSON.stringify(stage));
      setReviewStage(stage);
      console.log('Set reviewStage to:', stage.name);
      // If user is logged in, update backend
      if (user) {
        api.post('/users/last-searched-stage', { stageId: stage._id });
      }
    }
  };
  
  const closeMap = () => {
    setShowMap(false);
  };
  
  const handleMapClose = () => {
    console.log('=== handleMapClose called ===');
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
    <>
      <div style={{ display: 'flex' }}>
        <UserSidebar />
        <div style={{ flex: 1 }}>
          <div className="home-container" style={{ backgroundImage: `url(${cdb})`, backgroundRepeat: 'no-repeat', backgroundSize: 'cover' }}>
            <Navbar/>
            <header className="home-header">
              <p className="home-desc">Find the nearest stage to your destination...</p>
            </header>
            
            <div className="display">
              <div className="inputs">
                <input className="search"
                  type="text"
                  placeholder="Enter destination"
                  value={searchQuery}
                  onChange={(e) => handleSearch(e.target.value)} />
                <button onClick={() => handleSearch(searchQuery)} className="button">Search</button>
              </div>
              <div className="home-grid">
                {searchResults.map((result, index) => (
                  <div className="card" key={index}>
                    <div className="flex-container" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                      <h3 style={{ margin: 0 }}>{result.companyName}</h3>
                      {result.img && (
                        <img src={result.img} alt={result.companyName} style={{width: '200px',marginBottom:'0px', height: '200px', borderRadius: '10px', objectFit: 'cover'}} />
                      )}
                    </div>
                    <div className="center-container">
                      <div className="glass">
                        <p>Destination: {result.destination}</p>
                        <p>Fare: {result.fare}</p>
                        <p>Duration: {result.duration}</p>
                        <button
                          className="btn"
                          onClick={() => handleGetDirections(result.destination)}
                        >
                          Get Directions
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Mapbox component */}
            <TransportMap
              stageName={selectedDestination}
              showMap={showMap}
              onClose={closeMap}
              onMapClose={handleMapClose}
            />

            {/* M-Pesa Payment Component */}
            <MpesaPayment
              isOpen={showPayment}
              onClose={closePayment}
              amount={paymentDetails.amount}
              destination={paymentDetails.destination}
              companyName={paymentDetails.companyName} />

            {/* Review Modal */}
            <ReviewModal
              isOpen={showReviewModal}
              onClose={closeReviewModal}
              stageId={reviewStage?._id}
              stageName={reviewStage?.name}
            />
            <Featured />
          </div>
        </div>
      </div>
    </>
  );
};

export default Home;