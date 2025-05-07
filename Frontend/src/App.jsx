import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import LoginPage from './pages/Login';
//import UserDashboard from './pages/UserDashboard';
//import AdminDashboard from './pages/AdminDashboard';
import Registration from './pages/Registration'
import { isAuthenticated, getRole } from './auth';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Registration />} />
        <Route path="/login" element={<LoginPage />} />
    
      </Routes>
    </BrowserRouter>
  );
}

export default App;
