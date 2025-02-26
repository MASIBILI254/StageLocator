import React from 'react'
import './App.css'
import Home from './pages/Home'
import { AuthProvider } from './Context/AuthContext'
import LoginPage from './pages/Login'
import ProtectedRoute from './components/ProtectedRoute'
import {BrowserRouter, Router, Routes,Route} from 'react-router-dom'
function App() {

  return (
    <>
      <div>
        <AuthProvider>
          <BrowserRouter>
            <Routes>
              <Route path='/login' element={<LoginPage/>}/>
              <Route path='/' element={<ProtectedRoute><Home/></ProtectedRoute>}/>
            </Routes>
          </BrowserRouter>
        </AuthProvider>
      </div>
    </>
  )
}

export default App
