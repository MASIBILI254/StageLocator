import React, { useState, useEffect } from "react";
import TransportMap from '../components/Transportmap';
import Featured from "./Featured";
import MpesaPayment from "../components/Mpesa";
import api from '../services/Api';
import "./Home.css";
import cdb from "../images/cbd.jpeg";

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
  
  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await api.get('/stages/getall');
        console.log(response.data);
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
    setSelectedDestination(destination);
    setShowMap(true);
  };
  
  const closeMap = () => {
    setShowMap(false);
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
  <div className="container" style={{ backgroundImage: `url(${cdb})`, backgroundRepeat: 'no-repeat', backgroundSize: 'cover' }}>

      <header className="header">
        <p className="desc">Find the nearest stage to your destination...</p>
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
        <div className="grid">
          {searchResults.map((result, index) => (
            <div className="card" key={index}>
              <div className="flex-container" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '8px' }}>
                <h3 style={{ margin: 0 }}>{result.companyName}</h3>
                {result.img && (
                  <img src={result.img} alt={result.companyName} style={{width: '400px',marginBottom:'0px', height: '400px', borderRadius: '10px', objectFit: 'cover'}} />
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
                <button
                  className="btn-pay"
                  onClick={() => handlePayment(result)}
                >
                  PAY
                </button>
              </div>
            </div>
        </div>
             
          ))}
        </div>
      </div>

      {/* Mapbox component */}
      <TransportMap
        destination={selectedDestination}
        showMap={showMap}
        onClose={closeMap} />

      {/* M-Pesa Payment Component */}
      <MpesaPayment
        isOpen={showPayment}
        onClose={closePayment}
        amount={paymentDetails.amount}
        destination={paymentDetails.destination}
        companyName={paymentDetails.companyName} />

      <Featured />
    </div></>
  );
};

export default Home;