import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import api from "../services/Api";
import "./EditPage.css";

const EditStage = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    name: "",
    img: "",
    decs: "",
    location: {
      type: "Point",
      coordinates: ["", ""],
    },
    routes: [{ destination: "", fare: "", duration: "" }],
  });

  useEffect(() => {
    api.get(`/stages/getone/${id}`)
      .then((res) => {
        const stage = res.data;
        if (!stage || !stage.location || !Array.isArray(stage.location.coordinates)) {
          alert("Stage data is incomplete or missing.");
          return;
        }

        setFormData({
          name: stage.name || "",
          img: stage.img || "",
          decs: stage.decs || "",
          location: {
            type: "Point",
            coordinates: [
              stage.location.coordinates[0]?.toString() || "",
              stage.location.coordinates[1]?.toString() || "",
            ],
          },
          routes: stage.routes?.length ? stage.routes : [{ destination: "", fare: "", duration: "" }],
        });
      })
      .catch(() => alert("Failed to load stage"));
  }, [id]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    if (name === "lng" || name === "lat") {
      const [lng, lat] = formData.location.coordinates;
      const coords = name === "lng" ? [value, lat] : [lng, value];
      setFormData((prevData) => ({
        ...prevData,
        location: { ...prevData.location, coordinates: coords },
      }));
    } else {
      setFormData((prevData) => ({ ...prevData, [name]: value }));
    }
  };

  const handleRouteChange = (index, e) => {
    const { name, value } = e.target;
    const newRoutes = [...formData.routes];
    newRoutes[index][name] = value;
    setFormData((prevData) => ({ ...prevData, routes: newRoutes }));
  };

  const addRoute = () => {
    setFormData((prevData) => ({
      ...prevData,
      routes: [...prevData.routes, { destination: "", fare: "", duration: "" }],
    }));
  };

  const removeRoute = (index) => {
    const updatedRoutes = formData.routes.filter((_, i) => i !== index);
    setFormData((prevData) => ({ ...prevData, routes: updatedRoutes }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const payload = {
      ...formData,
      location: {
        type: "Point",
        coordinates: [
          parseFloat(formData.location.coordinates[0]),
          parseFloat(formData.location.coordinates[1]),
        ],
      },
    };

    try {
      await api.put(`/stages/${id}`, payload);
      alert("Stage updated successfully!");
      navigate("/admin");
    } catch {
      alert("Failed to update stage.");
    }
  };

  return (
    <div className="edit-stage-container">
      <h2 className="edit-stage-title">Edit Stage</h2>
      <form onSubmit={handleSubmit} className="edit-stage-form">
        <div className="form-group">
          <label className="form-label">Stage Name</label>
          <input
            type="text"
            name="name"
            required
            value={formData.name}
            onChange={handleChange}
            className="form-input"
          />
        </div>

        <div className="form-group">
          <label className="form-label">Image URL</label>
          <input
            type="text"
            name="img"
            value={formData.img}
            onChange={handleChange}
            className="form-input"
          />
        </div>

        <div className="form-group" style={{ gridColumn: "span 2" }}>
          <label className="form-label">Description</label>
          <textarea
            name="decs"
            rows="3"
            value={formData.decs}
            onChange={handleChange}
            className="form-textarea"
          />
        </div>

        <div className="form-group">
          <label className="form-label">Longitude</label>
          <input
            type="number"
            name="lng"
            required
            step="any"
            value={formData.location.coordinates[0]}
            onChange={handleChange}
            className="form-input"
          />
        </div>

        <div className="form-group">
          <label className="form-label">Latitude</label>
          <input
            type="number"
            name="lat"
            required
            step="any"
            value={formData.location.coordinates[1]}
            onChange={handleChange}
            className="form-input"
          />
        </div>

        <div className="routes-section">
          <h3>Routes</h3>
          {formData.routes.map((route, index) => (
            <div key={index} className="route-row">
              <input
                type="text"
                name="destination"
                placeholder="Destination"
                value={route.destination}
                onChange={(e) => handleRouteChange(index, e)}
                className="form-input"
              />
              <input
                type="number"
                name="fare"
                placeholder="Fare"
                value={route.fare}
                onChange={(e) => handleRouteChange(index, e)}
                className="form-input"
              />
              <input
                type="text"
                name="duration"
                placeholder="Duration"
                value={route.duration}
                onChange={(e) => handleRouteChange(index, e)}
                className="form-input"
              />
              <div className="route-actions">
                {index > 0 && (
                  <button type="button" onClick={() => removeRoute(index)} className="remove-route-btn">
                    Remove
                  </button>
                )}
              </div>
            </div>
          ))}
          <button type="button" onClick={addRoute} className="add-route-btn">
            + Add Route
          </button>
        </div>

        <div className="form-group" style={{ gridColumn: "span 2", marginTop: "1.5rem" }}>
          <button type="submit" className="submit-btn">
            Update Stage
          </button>
        </div>
      </form>
    </div>
  );
};

export default EditStage;
