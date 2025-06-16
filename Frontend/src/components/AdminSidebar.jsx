import { NavLink } from "react-router-dom";
import './AdminSidebar.css';
import { MdDashboard } from "react-icons/md";
import { MdAddLocationAlt } from "react-icons/md";
import { SiVirustotal } from "react-icons/si";
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
          <MdDashboard/> Dashboard
        </NavLink>
        <NavLink
          to="/admin/stages"
          className={({ isActive }) =>
            isActive ? "nav-link active" : "nav-link"
          }
        >
         <SiVirustotal/> All Stages
        </NavLink>
        <NavLink
          to="/admin/stages/create"
          className={({ isActive }) =>
            isActive ? "nav-link active" : "nav-link"
          }
        >
         <MdAddLocationAlt/> Add New Stage
        </NavLink>
      </nav>
    </aside>
  );
};
export default AdminSidebar;
