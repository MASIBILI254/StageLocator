import React, { useState, useEffect } from "react";
import axios from "axios";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";

const TransportMap = () => {
    const [stages, setStages] = useState([]);

    useEffect(() => {
      const fetchStages = async () => {
        try {
        const res = await axios.get("http://localhost:3000/stages/getAll");
        console.log(res.data);
        setStages(res.data);
            
        } catch (error) {
            return error;
        }
      };
      fetchStages();
    }, []);

    return (
        <div>
            <MapContainer center={[51.505, -0.09]} zoom={13} scrollWheelZoom={false}>
                
            </MapContainer>
        </div>
    );
};
export default TransportMap;
