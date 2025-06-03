import React from 'react';
import './Dashboard.css';

const Dashboard = () => {
  const handleLogout = () => {
    localStorage.removeItem('adminToken');
    window.location.href = '/admin/login';
  };

  return (
    <div className="admin-dashboard">
      <header className="admin-header">
        <h1>Админ-панель</h1>
        <button onClick={handleLogout} className="logout-button">
          Выйти
        </button>
      </header>
      <main className="admin-content">
        <div className="dashboard-welcome">
          <h2>Добро пожаловать в админ-панель</h2>
          <p>Здесь вы можете управлять содержимым сайта.</p>
        </div>
      </main>
    </div>
  );
};

export default Dashboard; 