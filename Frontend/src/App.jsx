import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import LoginPage from './pages/Login';
import Home from './pages/Home';
import Registration from './pages/Registration'
import { isAuthenticated, getRole } from './auth';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<LoginPage />} />
        <Route path="/register" element={<Registration />} />
        <Route path="/user" element={
           <Home /> 
        } />
    
      </Routes>
    </BrowserRouter>
  );
}

export default App;