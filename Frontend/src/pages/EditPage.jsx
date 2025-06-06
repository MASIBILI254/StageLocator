import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import api from "../services/Api";

const EditStage = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    name: "",
    img: "",
    decs: "",
    location: {
      type: "Point",
      coordinates: ["", ""], // [lng, lat]
    },
    routes: [{ destination: "", fare: "", duration: "" }],
  });

  useEffect(() => {
    api.get(`/stages/getone/${id}`)
      .then((res) => {
        const stage = res.data;

        if (!stage || !stage.location || !Array.isArray(stage.location.coordinates)) {
          console.error("Invalid stage data format", stage);
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
      .catch((err) => {
        console.error("Error loading stage", err);
        alert("Failed to load stage");
      });
  }, [id]);

  const handleChange = (e) => {
    const { name, value } = e.target;

    if (name === "lng" || name === "lat") {
      const [lng, lat] = formData.location.coordinates;
      const coords = name === "lng" ? [value, lat] : [lng, value];

      setFormData((prevData) => ({
        ...prevData,
        location: {
          ...prevData.location,
          coordinates: coords,
        },
      }));
    } else {
      setFormData((prevData) => ({
        ...prevData,
        [name]: value,
      }));
    }
  };

  const handleRouteChange = (index, e) => {
    const { name, value } = e.target;
    const newRoutes = [...formData.routes];
    newRoutes[index][name] = value;
    setFormData((prevData) => ({
      ...prevData,
      routes: newRoutes,
    }));
  };

  const addRoute = () => {
    setFormData((prevData) => ({
      ...prevData,
      routes: [...prevData.routes, { destination: "", fare: "", duration: "" }],
    }));
  };

  const removeRoute = (index) => {
    const updatedRoutes = formData.routes.filter((_, i) => i !== index);
    setFormData((prevData) => ({
      ...prevData,
      routes: updatedRoutes,
    }));
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
    } catch (err) {
      console.error("Error updating stage", err);
      alert("Failed to update stage.");
    }
  };

  return (
    <div>
      <h2 className="text-2xl font-bold mb-6">Edit Stage</h2>
      <form
        onSubmit={handleSubmit}
        className="grid grid-cols-1 md:grid-cols-2 gap-4 bg-white p-6 rounded shadow"
      >
        <div>
          <label className="block mb-1 font-medium">Stage Name</label>
          <input
            type="text"
            name="name"
            required
            value={formData.name}
            onChange={handleChange}
            className="w-full border border-gray-300 p-2 rounded"
          />
        </div>

        <div>
          <label className="block mb-1 font-medium">Image URL</label>
          <input
            type="text"
            name="img"
            value={formData.img}
            onChange={handleChange}
            className="w-full border border-gray-300 p-2 rounded"
          />
        </div>

        <div className="md:col-span-2">
          <label className="block mb-1 font-medium">Description</label>
          <textarea
            name="decs"
            rows="3"
            value={formData.decs}
            onChange={handleChange}
            className="w-full border border-gray-300 p-2 rounded"
          ></textarea>
        </div>

        <div>
          <label className="block mb-1 font-medium">Longitude</label>
          <input
            type="number"
            step="any"
            name="lng"
            required
            value={formData.location.coordinates[0]}
            onChange={handleChange}
            className="w-full border border-gray-300 p-2 rounded"
          />
        </div>

        <div>
          <label className="block mb-1 font-medium">Latitude</label>
          <input
            type="number"
            step="any"
            name="lat"
            required
            value={formData.location.coordinates[1]}
            onChange={handleChange}
            className="w-full border border-gray-300 p-2 rounded"
          />
        </div>

        <div className="md:col-span-2 mt-4">
          <h3 className="text-lg font-semibold mb-2">Routes</h3>
          {formData.routes.map((route, index) => (
            <div key={index} className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-3">
              <input
                type="text"
                name="destination"
                placeholder="Destination"
                value={route.destination}
                onChange={(e) => handleRouteChange(index, e)}
                className="border border-gray-300 p-2 rounded"
              />
              <input
                type="number"
                name="fare"
                placeholder="Fare"
                value={route.fare}
                onChange={(e) => handleRouteChange(index, e)}
                className="border border-gray-300 p-2 rounded"
              />
              <input
                type="text"
                name="duration"
                placeholder="Duration"
                value={route.duration}
                onChange={(e) => handleRouteChange(index, e)}
                className="border border-gray-300 p-2 rounded"
              />
              <div className="md:col-span-3 text-right">
                {index > 0 && (
                  <button
                    type="button"
                    onClick={() => removeRoute(index)}
                    className="text-red-500 hover:underline"
                  >
                    Remove
                  </button>
                )}
              </div>
            </div>
          ))}
          <button
            type="button"
            onClick={addRoute}
            className="text-blue-600 hover:underline"
          >
            + Add Route
          </button>
        </div>

        <div className="md:col-span-2 mt-6">
          <button
            type="submit"
            className="bg-blue-600 text-white px-6 py-2 rounded hover:bg-blue-700"
          >
            Update Stage
          </button>
        </div>
      </form>
    </div>
  );
};

export default EditStage;
