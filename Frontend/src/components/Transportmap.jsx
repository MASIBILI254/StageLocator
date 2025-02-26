import React, { useEffect, useRef, useState } from 'react';
import mapboxgl from 'mapbox-gl';
import 'mapbox-gl/dist/mapbox-gl.css';
import './Transportmap.css';
import axios from 'axios';

// Replace with your actual Mapbox access token
mapboxgl.accessToken = 'pk.eyJ1IjoiYW1hZDE5IiwiYSI6ImNtN2s0ZG56MDBmNHUybHF4eHJtOHVmNXAifQ.mOBEf8SbwkpMAhrz64vIvg';

const TransportMap = ({ stageName, showMap, onClose }) => {
  const mapContainer = useRef(null);
  const map = useRef(null);
  const userMarker = useRef(null);
  const destinationMarker = useRef(null);
  const watchId = useRef(null);
  const [userLocation, setUserLocation] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [stages, setStages] = useState([]);
  const [selectedStage, setSelectedStage] = useState(null);
  const [isTracking, setIsTracking] = useState(false);

  // Fetch stages from backend
  useEffect(() => {
    if (!showMap) return;

    const fetchStages = async () => {
      try {
        const response = await axios.get('http://localhost:3000/stages/getall');
        console.log('Backend data:', response.data);
        
        // Set stages data from backend
        if (response.data && response.data.length > 0) {
          setStages(response.data);
          
          // If stageName was provided as prop, find and select that stage
          if (stageName) {
            const matchedStage = response.data.find(
              stage => stage.name.toLowerCase() === stageName.toLowerCase()
            );
            if (matchedStage) {
              setSelectedStage(matchedStage);
            }
          }
        }
      } catch (error) {
        console.error('Error fetching stages from backend:', error);
        setError('Failed to fetch stage data from backend');
      }
    };

    fetchStages();

    // Get user's initial location
    navigator.geolocation.getCurrentPosition(
      (position) => {
        const initialLocation = [position.coords.longitude, position.coords.latitude];
        setUserLocation(initialLocation);
        setIsLoading(false);
      },
      (geoError) => {
        console.error("Error getting location:", geoError);
        setError("Unable to get your current location. Please enable location services.");
        setIsLoading(false);
      }
    );

    // Cleanup function for component unmount
    return () => {
      if (watchId.current) {
        navigator.geolocation.clearWatch(watchId.current);
        watchId.current = null;
      }
    };
  }, [showMap, stageName]);

  // Start or stop location tracking
  const toggleTracking = () => {
    if (isTracking) {
      // Stop tracking
      if (watchId.current) {
        navigator.geolocation.clearWatch(watchId.current);
        watchId.current = null;
      }
      setIsTracking(false);
    } else {
      // Start tracking
      if ("geolocation" in navigator) {
        const trackingOptions = {
          enableHighAccuracy: true,
          maximumAge: 0,
          timeout: 5000
        };

        watchId.current = navigator.geolocation.watchPosition(
          (position) => {
            const newLocation = [position.coords.longitude, position.coords.latitude];
            setUserLocation(newLocation);
            
            // Update user marker position on map
            if (userMarker.current && map.current) {
              userMarker.current.setLngLat(newLocation);
              
              // If following mode is on, center map on user
              if (isTracking) {
                map.current.easeTo({
                  center: newLocation,
                  duration: 1000
                });
              }
            }
          },
          (watchError) => {
            console.error("Error tracking location:", watchError);
            setError("Location tracking failed. Please check your device settings.");
            setIsTracking(false);
          },
          trackingOptions
        );
        
        setIsTracking(true);
      } else {
        setError("Geolocation is not supported by your browser");
      }
    }
  };

  useEffect(() => {
    if (!showMap || !userLocation || map.current) return;

    // Initialize map
    map.current = new mapboxgl.Map({
      container: mapContainer.current,
      style: 'mapbox://styles/mapbox/streets-v11',
      center: userLocation,
      zoom: 14
    });

    // Add navigation controls
    map.current.addControl(new mapboxgl.NavigationControl(), 'top-right');

    // Add geolocate control for the user to jump to their location
    map.current.addControl(
      new mapboxgl.GeolocateControl({
        positionOptions: {
          enableHighAccuracy: true
        },
        trackUserLocation: true,
        showUserHeading: true
      }),
      'top-right'
    );

    // Create a custom user marker element with enhanced styling
    const userMarkerElement = document.createElement('div');
    userMarkerElement.className = 'user-marker';
    userMarkerElement.innerHTML = `
      <div class="user-marker-icon">
        <div class="user-marker-pulse"></div>
        <div class="user-marker-dot"></div>
      </div>
    `;

    // Add custom user location marker with enhanced styling
    userMarker.current = new mapboxgl.Marker({
      element: userMarkerElement,
      anchor: 'center'
    })
      .setLngLat(userLocation)
      .setPopup(new mapboxgl.Popup().setHTML("<p><strong>Your Location</strong></p>"))
      .addTo(map.current);

    // Add markers for all stages
    if (stages && stages.length > 0) {
      const bounds = new mapboxgl.LngLatBounds()
        .extend(userLocation);
      
      stages.forEach((stage) => {
        if (stage.location && stage.location.coordinates && stage.location.coordinates.length === 2) {
          // Note: GeoJSON format is [longitude, latitude]
          new mapboxgl.Marker({ color: '#f30' })
            .setLngLat(stage.location.coordinates)
            .setPopup(new mapboxgl.Popup().setHTML(`
              <p><strong>${stage.name}</strong></p>
              <p>Routes: ${stage.routes?.length || 0}</p>
            `))
            .addTo(map.current);
          
          bounds.extend(stage.location.coordinates);
        }
      });

      // Fit map to show all markers
      map.current.fitBounds(bounds, {
        padding: 100
      });
    }

    // If a stage was selected (either from prop or by user), get directions to it
    if (selectedStage) {
      getDirectionsToStage(selectedStage);
    }

    // Cleanup function
    return () => {
      if (map.current) {
        map.current.remove();
        map.current = null;
      }
      if (watchId.current) {
        navigator.geolocation.clearWatch(watchId.current);
        watchId.current = null;
      }
    };
  }, [userLocation, stages, selectedStage, showMap]);

  // Effect to handle changes to selectedStage after map is initialized
  useEffect(() => {
    if (map.current && selectedStage && userLocation) {
      getDirectionsToStage(selectedStage);
    }
  }, [selectedStage, userLocation]);

  // Update marker position when user location changes
  useEffect(() => {
    if (map.current && userMarker.current && userLocation) {
      userMarker.current.setLngLat(userLocation);
    }
  }, [userLocation]);

  const getDirectionsToStage = async (stage) => {
    if (!stage.location || !stage.location.coordinates || stage.location.coordinates.length !== 2) {
      setError("Selected stage doesn't have valid coordinates");
      return;
    }

    try {
      const start = userLocation;
      const end = stage.location.coordinates;
      
      // Create or update destination marker
      if (destinationMarker.current) {
        destinationMarker.current.setLngLat(end);
      } else if (map.current) {
        // Create custom destination marker element
        const destMarkerElement = document.createElement('div');
        destMarkerElement.className = 'destination-marker';
        destMarkerElement.innerHTML = `
          <div class="destination-marker-icon">
            <div class="destination-marker-flag"></div>
          </div>
        `;
        
        // Add custom destination marker
        destinationMarker.current = new mapboxgl.Marker({
          element: destMarkerElement,
          anchor: 'bottom'
        })
          .setLngLat(end)
          .setPopup(new mapboxgl.Popup().setHTML(`
            <p><strong>Destination: ${stage.name}</strong></p>
          `))
          .addTo(map.current);
      }
      
      // Get directions
      const directionsResponse = await fetch(
        `https://api.mapbox.com/directions/v5/mapbox/driving/${start[0]},${start[1]};${end[0]},${end[1]}?steps=true&geometries=geojson&access_token=${mapboxgl.accessToken}`
      );
      
      if (!directionsResponse.ok) throw new Error('Failed to get directions');
      
      const directionsData = await directionsResponse.json();
      
      if (directionsData.routes && directionsData.routes.length > 0) {
        const route = directionsData.routes[0];
        
        // Remove existing route if any
        if (map.current.getSource('route')) {
          map.current.removeLayer('route');
          map.current.removeSource('route');
        }
        
        // Add the route to the map
        map.current.addSource('route', {
          type: 'geojson',
          data: {
            type: 'Feature',
            properties: {},
            geometry: route.geometry
          }
        });
        
        map.current.addLayer({
          id: 'route',
          type: 'line',
          source: 'route',
          layout: {
            'line-join': 'round',
            'line-cap': 'round'
          },
          paint: {
            'line-color': '#3887be',
            'line-width': 5,
            'line-opacity': 0.75
          }
        });
        
        // Fit the map to show both the origin and destination
        const bounds = new mapboxgl.LngLatBounds()
          .extend(start)
          .extend(end);
        
        map.current.fitBounds(bounds, {
          padding: 100
        });
        
        // Display turn-by-turn directions
        const instructions = document.getElementById('instructions');
        if (instructions) {
          let tripInstructions = '';
          route.legs[0].steps.forEach((step, index) => {
            tripInstructions += `<li>${index + 1}. ${step.maneuver.instruction}</li>`;
          });
          
          const distance = (route.distance / 1000).toFixed(1); // Convert to km
          instructions.innerHTML = `
            <h3>Directions to ${stage.name}</h3>
            <p>Distance: ${distance} km</p>
            <p>Trip duration: ${Math.floor(route.duration / 60)} min</p>
            <ol>${tripInstructions}</ol>
          `;
        }
      }
    } catch (error) {
      console.error('Error getting directions:', error);
      setError(`Error getting directions: ${error.message}`);
    }
  };

  // Function to handle stage selection
  const handleSelectStage = (stage) => {
    setSelectedStage(stage);
  };

  // Function to recenter map on user location
  const centerOnUser = () => {
    if (map.current && userLocation) {
      map.current.flyTo({
        center: userLocation,
        zoom: 15,
        duration: 1000
      });
    }
  };

  if (!showMap) return null;

  return (
    <div className="map-modal">
      <div className="map-container">
        <button className="close-button" onClick={onClose}>×</button>
        {isLoading && <div className="loading">Loading map...</div>}
        {error && <div className="error">{error}</div>}
        
        <div className="map-controls">
          <button 
            className={`tracking-button ${isTracking ? 'active' : ''}`} 
            onClick={toggleTracking}
          >
            {isTracking ? 'Stop Tracking' : 'Track My Movement'}
          </button>
          <button className="center-button" onClick={centerOnUser}>
            Center On Me
          </button>
        </div>
        
        <div ref={mapContainer} className="mapbox-container" />
        
        <div className="map-sidebar">
          <div className="stage-list">
            <h3>Available Stages</h3>
            {stages && stages.length > 0 ? (
              <ul>
                {stages.map((stage) => (
                  <li key={stage._id}>
                    <button 
                      onClick={() => handleSelectStage(stage)}
                      className={`stage-button ${selectedStage && selectedStage._id === stage._id ? 'selected' : ''}`}
                    >
                      {stage.name} ({stage.routes?.length || 0} routes)
                    </button>
                  </li>
                ))}
              </ul>
            ) : (
              <p>No stages available</p>
            )}
          </div>
          
          <div id="instructions" className="directions-instructions">
            {!selectedStage && <p>Select a stage to see directions</p>}
          </div>
        </div>
      </div>
    </div>
  );
};

export default TransportMap;