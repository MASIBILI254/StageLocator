import { useEffect, useState, useCallback } from "react";
import { Link } from "react-router-dom";
import api from "../services/Api";
import './StageList.css';
import AdminSidebar from "./AdminSidebar";

const StageList = () => {
  const [stages, setStages] = useState([]);

  useEffect(() => {
    const fetchStages = async () => {
      try {
        const res = await api.get("/stages/getAll");
        setStages(res.data);
      } catch (err) {
        console.error("Failed to fetch stages", err);
      }
    };

    fetchStages();
  }, []);

  const handleDelete = useCallback(async (id) => {
    if (!window.confirm("Are you sure you want to delete this stage?")) return;

    try {
      await api.delete(`/stages/${id}`);
      setStages((prev) => prev.filter((stage) => stage._id !== id));
    } catch (err) {
      console.error("Failed to delete stage", err);
    }
  }, []);

  return (
    <div>
      <AdminSidebar/>
      <div className="stage-list-container">
        <h2 className="stage-list-title">All Registered Stages</h2>
        <table className="stage-list-table">
          <thead>
            <tr>
              <th>Name</th>
              <th>Destinations</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {stages.length === 0 ? (
              <tr>
                <td colSpan="3" className="stage-list-no-data">No stages found.</td>
              </tr>
            ) : (
              stages.map((stage) => {
                const destinations = stage.routes?.map(r => r.destination).join(', ') || "No destination";

                return (
                  <tr key={stage._id}>
                    <td>{stage.name}</td>
                    <td>{destinations}</td>
                    <td className="stage-list-actions">
                      <Link to={`/admin/stages/edit/${stage._id}`} className="stage-list-edit-btn">Edit</Link>
                      <button onClick={() => handleDelete(stage._id)} className="stage-list-delete-btn">Delete</button>
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default StageList;
