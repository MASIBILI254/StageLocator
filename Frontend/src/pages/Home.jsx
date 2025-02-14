import React, { useState } from "react";
import axios from "axios";

const Home = () => {
  const [stages, setStages] = useState([]);
  const [destination, setDestination] = useState("");

  const handleSearch = async (e) => {
    e.preventDefault();
      try {
      const response = await axios.get("http://localhost:3000/stages?lng=36.7689&lat=-1.3925"); // Use actual GPS coords
      console.log(response.data);
      setStages(response.data);
    } catch (err) {
      console.error(err);
    }
    
  };

  return (
    <div>
      <h1>Public Transport Locator</h1>
      <input
        type="text"
        placeholder="Enter destination"
        value={destination}
        onChange={(e) => setDestination(e.target.value)}
      />
      <button onClick={handleSearch}>Search</button>

      <div>
        <h2>Nearby Stages</h2>
        {stages.map((stage) => (
          <div key={stage._id}>
            <h3>{stage.name}</h3>
        <p>Location: {stage.location.coordinates[0]}, {stage.location.coordinates[1]}</p>
        <p>destination:{stage.routes[0].destination}</p>
        <p>price:{stage.routes[1].fare}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Home;