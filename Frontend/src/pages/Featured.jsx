import React, { useState, useEffect } from 'react'
import axios from 'axios';
import './Featured.css'

function Featured() {
  const [stages, setStages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

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

  return (
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
                {stage.img}
                {stage.routes && stage.routes.length > 0 && (
                  <div className="routes">
                    <h2 >Routes</h2>
                    <div className="flex flex-wrap gap-2">
                      {stage.routes.map((route, index) => (
                        <div key={index} className='Card'>
                          <p>Destination: {route.destination}</p>
                          <p>Fare: {route.fare}</p>
                          <p> Duration:{route.duration}</p>
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
  );
}

export default Featured;