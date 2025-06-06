import { NavLink } from "react-router-dom";
import './AdminSidebar.css';

const AdminSidebar = () => {
  return (
    <aside className="admin-sidebar">
      <h1 className="admin-title">Admin Panel</h1>
      <nav className="admin-nav">
        <NavLink
          to="/admin"
          className={({ isActive }) =>
            isActive ? "nav-link active" : "nav-link"
          }
        >
          Dashboard
        </NavLink>
        <NavLink
          to="/admin/stages"
          className={({ isActive }) =>
            isActive ? "nav-link active" : "nav-link"
          }
        >
          All Stages
        </NavLink>
        <NavLink
          to="/admin/stages/create"
          className={({ isActive }) =>
            isActive ? "nav-link active" : "nav-link"
          }
        >
          Add New Stage
        </NavLink>
      </nav>
    </aside>
  );
};

export default AdminSidebar;
