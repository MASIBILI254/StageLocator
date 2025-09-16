import { NavLink } from "react-router-dom";
import './AdminSidebar.css';
import { MdDashboard } from "react-icons/md";
import { HiDocumentReport } from "react-icons/hi";
import { MdAlignHorizontalLeft } from "react-icons/md";
import { MdAnalytics } from "react-icons/md";
import { MdAddChart } from "react-icons/md";
import { MdStar } from "react-icons/md";

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
          <MdDashboard size={20} style={{
            background: 'rgba(56, 191, 248, 0.54)',
            borderRadius: '8px',
            padding: 4,
            marginRight:'8px',
            color: 'white',
            boxShadow: '0 2px 8px rgba(102, 126, 234, 0.2)'
         }}/> Dashboard
        </NavLink>
        <NavLink
          to="/admin/stages"
          className={({ isActive }) =>
            isActive ? "nav-link active" : "nav-link"
          }
        >
         <MdAlignHorizontalLeft size={20} style={{
            background: 'rgba(56, 191, 248, 0.54)',
            borderRadius: '8px',
            padding: 4,
            marginRight:'8px',
            color: 'white',
            boxShadow: '0 2px 8px rgba(102, 126, 234, 0.2)'
         }}/> All Stages
        </NavLink>
        <NavLink
          to="/admin/stages/create"
          className={({ isActive }) =>
            isActive ? "nav-link active" : "nav-link"
          }
        >
         <MdAddChart size={20} style={{
            background: 'rgba(56, 191, 248, 0.54)',
            borderRadius: '8px',
            padding: 2,
            color: 'white',
            marginRight:'8px',
            boxShadow: '0 2px 8px rgba(102, 126, 234, 0.2)'
         }}/> Add Stage
        </NavLink>
        <NavLink
          to="/admin/analytics"
          className={({ isActive }) =>
            isActive ? "nav-link active" : "nav-link"
          }
        >
        <MdAnalytics size={20} style={{
            background: 'rgba(56, 191, 248, 0.54)',
            borderRadius: '8px',
            padding: 4,
            color: 'white',
            marginRight:'8px',
            boxShadow: '0 2px 8px rgba(102, 126, 234, 0.2)'
         }}/>  Analytics
        </NavLink>
        <NavLink
          to="/admin/incident-reports"
          className={({ isActive }) =>
            isActive ? "nav-link active" : "nav-link"
          }
        >
         <HiDocumentReport size={20} style={{
            background: 'rgba(56, 191, 248, 0.54)',
            borderRadius: '8px',
            padding: 4,
            color: 'white',
            marginRight:'8px',
            boxShadow: '0 2px 8px rgba(102, 126, 234, 0.2)'
         }}/>Reports
        </NavLink>
         <NavLink
          to="/reviews"
          className={({ isActive }) =>
            isActive ? "nav-link active" : "nav-link"
          }
        >
            <MdStar size={20} style={{
            background: 'rgba(56, 191, 248, 0.54)',
            borderRadius: '8px',
            padding: 4,
            color: 'white',
            marginRight:'8px',
            boxShadow: '0 2px 8px rgba(102, 126, 234, 0.2)'
         }} /> reviews
        </NavLink>
      </nav>
    </aside>
  );
};
export default AdminSidebar;
