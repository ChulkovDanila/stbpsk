import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Info from './pages/Info';
import Search from './pages/Search';
import Login from './admin/components/Login/Login';
import Dashboard from './admin/pages/Dashboard';
import ProtectedRoute from './admin/components/ProtectedRoute';
import './App.css'

function App() {
  return (
    <Router>
      <Routes>
        {/* Публичные маршруты */}
        <Route path="/" element={<Info />} />
        <Route path="/search" element={<Search />} />
        
        {/* Админ-маршруты */}
        <Route path="/admin/login" element={<Login />} />
        <Route 
          path="/admin/dashboard" 
          element={
            <ProtectedRoute>
              <Dashboard />
            </ProtectedRoute>
          } 
        />
        
        {/* Редирект для несуществующих маршрутов */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </Router>
  );
}

export default App;
