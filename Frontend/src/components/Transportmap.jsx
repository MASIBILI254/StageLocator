import React, { useState, useEffect } from "react";
import axios from "axios";
import ReactMapGl from 'react-map-gl/mapbox';

const TransportMap = () => {
    const [stages, setStages] = useState([]);
    const[viewport, setViewport] = useState({
        latitude: -1.2810399,
        longitude: 36.8235669,
        width: "100vw",
        height: "100vh",
        zoom: 11,
      });
    const Key= "pk.eyj1IjoibGVpZ2hoYWxsaW4iLCJhIjoiY2xqM3ZqYmZhMDBiZzNrcW54ZmN2Zm9nZyJ9.qB9X5Zq34QZ1Z7z7tO9Z3w"
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
       <ReactMapGl {...viewport}>
        markers here
       </ReactMapGl>
    );
};export default TransportMap;
