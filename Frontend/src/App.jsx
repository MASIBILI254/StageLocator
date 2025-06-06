import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import LoginPage from './pages/Login';
import Home from './pages/Home';
import Registration from './pages/Registration'
import { isAuthenticated, getRole } from './auth';
import AdminDashboard from './pages/AdminBoard';
import CreateStage from './pages/CreateStage';
import EditStage from './pages/EditPage';
import StageList from './components/StageList';
function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<LoginPage />} />
        <Route path="/register" element={<Registration />} />
        <Route path="/user" element={   <Home /> } />
        <Route path="/admin" element={   <AdminDashboard /> } />
        <Route path="/admin/stages/create" element={<CreateStage />} />
        <Route path="/admin/stages/edit/:id" element={<EditStage />} />
        <Route path='/admin/stages' element ={<StageList/>} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;