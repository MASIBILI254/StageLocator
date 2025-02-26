import React, { useState, useEffect } from "react";
import TransportMap from '../components/Transportmap';
import axios from "axios";
import "./Home.css";
import cdb from "../images/cbd.jpeg";
import Navbar from "../navbar/Navbar";

const Home = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [transportData, setTransportData] = useState([]);
  const [showMap, setShowMap] = useState(false);
  const [selectedDestination, setSelectedDestination] = useState('');
  
  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get('http://localhost:3000/stages/getall');
        console.log(response.data);
        setTransportData(response.data);
      } catch (error) {
        console.error('Error fetching transport data:', error);
      }
    };
    fetchData();
  }, []);
  
  const handleSearch = (query) => {
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
            ...route
          });
        });
      }
      return acc;
    }, []);
    
    setSearchResults(results);
  };
  
  const handleGetDirections = (destination) => {
    setSelectedDestination(destination);
    setShowMap(true);
  };
  
  const closeMap = () => {
    setShowMap(false);
  };
  
  return (
    <div className="container" style={{ backgroundImage: `url(${cdb})`, backgroundRepeat: 'no-repeat', backgroundSize: 'cover' }}>
      <Navbar/>
      <header className="header">
        <p className="desc">find the nearest stage to your destination...</p>
      </header>
      <div className="display">
        <div className="inputs">
          <input className="search"
            type="text"
            placeholder="Enter destination"
            value={searchQuery}
            onChange={(e) => handleSearch(e.target.value)}
          />
          <button onClick={() => handleSearch(searchQuery)} className="button">Search</button>
        </div>
        <div className="grid">
          {searchResults.map((result, index) => (
            <div className="card" key={index}>
              <div className="flex-container">
                <h3>{result.companyName}</h3>
              </div>
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
                <button className="btn-pay">PAY</button>
              </div>
            </div>
          ))}
        </div>
      </div>
      
      {/* Mapbox component */}
      <TransportMap 
        destination={selectedDestination}
        showMap={showMap}
        onClose={closeMap}
      />
    </div>
  );
};

export default Home;