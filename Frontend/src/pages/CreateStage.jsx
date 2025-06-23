import { useState } from "react";
import api from "../services/Api";
import { useNavigate } from "react-router-dom";
import './CreateStage.css';
import ImageUpload from '../components/ImageUpload';

const CreateStage = () => {
  const [formData, setFormData] = useState({
    name: "",
    img: "",
    decs: "",
    location: {
      type: "Point",
      coordinates: ["", ""],
    },
    routes: [
      { destination: "", fare: "", duration: "" },
    ],
  });

  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;

    if (name === "lng" || name === "lat") {
      const [lng, lat] = formData.location.coordinates;
      const coords = name === "lng" ? [value, lat] : [lng, value];
      setFormData({
        ...formData,
        location: { ...formData.location, coordinates: coords },
      });
    } else {
      setFormData({ ...formData, [name]: value });
    }
  };

  const handleRouteChange = (index, e) => {
    const { name, value } = e.target;
    const updatedRoutes = [...formData.routes];
    updatedRoutes[index][name] = value;
    setFormData({ ...formData, routes: updatedRoutes });
  };

  const addRoute = () => {
    setFormData({
      ...formData,
      routes: [...formData.routes, { destination: "", fare: "", duration: "" }],
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const payload = {
      ...formData,
      location: {
        ...formData.location,
        coordinates: [
          parseFloat(formData.location.coordinates[0]),
          parseFloat(formData.location.coordinates[1]),
        ],
      },
      routes: formData.routes.map((r) => ({
        destination: r.destination,
        fare: parseFloat(r.fare),
        duration: r.duration,
      })),
    };

    try {
      await api.post("/stages/add", payload);
      alert("Stage created successfully!");
      navigate("/admin");
    } catch (err) {
      console.error("Error creating stage", err);
      alert("Failed to create stage.");
    }
  };

  const handleImageUpload = (images) => {
    setFormData({ ...formData, img: images[0]?.url || '' });
  };

  return (
    <div className="add-page">
      <h2 className="heading">Add New Stage</h2>
      <form onSubmit={handleSubmit} className="stage-form">
        <div className="form-group">
          <label>Stage Name</label>
          <input
            type="text"
            name="name"
            required
            value={formData.name}
            onChange={handleChange}
          />
        </div>

        <div className="form-group">
          <label>Image Upload</label>
          <ImageUpload onImageUpload={handleImageUpload} />
        </div>

        <div className="form-group full-width">
          <label>Description</label>
          <textarea
            name="decs"
            rows="3"
            value={formData.decs}
            onChange={handleChange}
          ></textarea>
        </div>

        <div className="form-group">
          <label>Longitude</label>
          <input
            type="number"
            step="any"
            name="lng"
            required
            value={formData.location.coordinates[0]}
            onChange={handleChange}
          />
        </div>

        <div className="form-group">
          <label>Latitude</label>
          <input
            type="number"
            step="any"
            name="lat"
            required
            value={formData.location.coordinates[1]}
            onChange={handleChange}
          />
        </div>

        <div className="form-group full-width">
          <h3 className="subheading">Routes</h3>
          {formData.routes.map((route, index) => (
            <div key={index} className="route-group">
              <input
                type="text"
                name="destination"
                placeholder="Destination"
                value={route.destination}
                onChange={(e) => handleRouteChange(index, e)}
              />
              <input
                type="number"
                name="fare"
                placeholder="Fare"
                value={route.fare}
                onChange={(e) => handleRouteChange(index, e)}
              />
              <input
                type="text"
                name="duration"
                placeholder="Duration"
                value={route.duration}
                onChange={(e) => handleRouteChange(index, e)}
              />
            </div>
          ))}
          <button type="button" onClick={addRoute} className="add-route-btn">
            + Add another route
          </button>
        </div>

        <div className="form-group full-width">
          <button type="submit" className="submit-btn">
            Create Stage
          </button>
        </div>
      </form>
    </div>
  );
};

export default CreateStage;
