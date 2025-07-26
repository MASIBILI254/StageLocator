import React, { useState, useEffect } from "react";
import TransportMap from '../components/Transportmap';
import Featured from "./Featured";
import MpesaPayment from "../components/Mpesa";
import api from '../services/Api';
import "./Home.css";
import cdb from "../images/cbd.jpeg";
import Navbar from '../navbar/Navbar';
import { Link, useNavigate } from 'react-router-dom';
import UserSidebar from '../components/UserSidebar';
import { useAuth } from '../Context/AuthContext';
import ReviewModal from '../components/ReviewModal';

import { useTranslation } from 'react-i18next';
import '../i18n';


const Home = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();

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

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await api.get('/stages/getall');
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
            boardingPoint: company.boardingPoint,
            ...route
          });
        });
      }
      return acc;
    }, []);

    setSearchResults(results);

    const uniqueStageNames = [...new Set(results.map(r => r.companyName))];
    uniqueStageNames.forEach(async (stageName) => {
      try {
        await api.post('/stages/increment-searchcount', { stageName });
      } catch (err) {
        console.error('Failed to increment search count for', stageName, err);
      }
    });
  };

  const handleGetDirections = (destination) => {
    setSelectedDestination(destination);
    setShowMap(true);

    const stage = transportData.find(company =>
      company.routes.some(route => route.destination === destination)
    );

    if (stage) {
      localStorage.setItem('lastSearchedStage', JSON.stringify(stage));
      setReviewStage(stage);
      if (user) {
        api.post('/users/last-searched-stage', { stageId: stage._id });
      }
    }
  };

  const closeMap = () => {
    setShowMap(false);
  };

  const handleMapClose = () => {
    if (reviewStage) {
      setShowReviewModal(true);
    }
  };

  const closeReviewModal = () => {
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
            <Navbar />

            <header className="home-header">
              <p className="home-desc">{t('home.welcome')}</p>
            </header>

            <div className="display">
              <div className="inputs">
                <input
                  className="search"
                  type="text"
                  placeholder={t('home.enterDestination')}
                  value={searchQuery}
                  onChange={(e) => handleSearch(e.target.value)}
                />
                <button onClick={() => handleSearch(searchQuery)} className="button">
                  {t('home.search')}
                </button>
              </div>

              <div className="home-grid">
                {searchResults.map((result, index) => (
                  <div className="card" key={index}>
                    <div className="flex-container" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                      <h3 style={{ margin: 0 }}>{result.companyName}</h3>
                      {result.boardingPoint && (
                    <p style={{ margin: 0, fontWeight: 500, color: '#FFD700' }}>Boarding Point: {result.boardingPoint}</p>
                  )}
                      {result.img && (
                        <img
                          src={result.img}
                          alt={result.companyName}
                          style={{ width: '200px', marginBottom: '0px', height: '200px', borderRadius: '10px', objectFit: 'cover' }}
                        />
                      )}
                    </div>
                    <div className="center-container">
                      <div className="glass">
                         {result.number !== undefined && (
                          <p>Route Number: {result.number}</p>
                        )}
                        <p>{t('home.destination')}: {result.destination}</p>
                       
                        <p>{t('home.Estimated fare')}: {result.fare}</p>
                        <p>{t('home.duration')}: {result.duration}</p>
                        <button
                          className="btn"
                          onClick={() => handleGetDirections(result.destination)}
                        >
                          {t('home.getDirections')}
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Mapbox */}
            <TransportMap
              stageName={selectedDestination}
              showMap={showMap}
              onClose={closeMap}
              onMapClose={handleMapClose}
            />

            {/* M-Pesa Payment */}
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

            <Featured />
          </div>
        </div>
      </div>
    </>
  );
};

export default Home;
