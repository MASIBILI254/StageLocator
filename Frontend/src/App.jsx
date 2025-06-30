import { BrowserRouter, Routes, Route } from 'react-router-dom';
import LoginPage from './pages/Login';
import Home from './pages/Home';
import Registration from './pages/Registration';
import AdminDashboard from './pages/AdminBoard';
import CreateStage from './pages/CreateStage';
import EditStage from './pages/EditPage';
import LandingPage from './pages/LandingPage';
import StageList from './components/StageList';
import StageAnalytics from './components/StageAnalytics';
import IncidentReports from './pages/IncidentReports';
import UserIncidentReport from './pages/UserIncidentReport';
import { AdminReviewList } from './components/ReviewsRating';
import './i18n';
import IncidentReportModal from './components/IncidentReportModal';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/home" element={<Home />} />
        <Route path="/register" element={<Registration />} />
        <Route path="/user" element={<LoginPage />} />
        <Route path="/admin" element={<AdminDashboard />} />
        <Route path="/admin/stages/create" element={<CreateStage />} />
        <Route path="/admin/stages/edit/:id" element={<EditStage />} />
        <Route path='/admin/stages' element={<StageList />} />
        <Route path='/admin/analytics' element={<StageAnalytics />} />
        <Route path="/admin/incident-reports" element={<IncidentReports />} />
        <Route path="/report" element={<UserIncidentReport />} />
         <Route path="/reviews" element={<AdminReviewList />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;