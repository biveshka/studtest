import React from 'react';

const AdminPanel = ({ user, onRoleChange }) => {
  return (
    <div className="admin-panel">
      <div className="container">
        <div className="admin-header">
          <h1>Панель администратора</h1>
          <button className="role-change-btn" onClick={onRoleChange}>Сменить роль</button>
        </div>
        <div className="stats-grid">
          <div className="stat-card">
            <div className="stat-value">150</div>
            <div className="stat-label">Пользователей</div>
          </div>
          <div className="stat-card">
            <div className="stat-value">45</div>
            <div className="stat-label">Тестов</div>
          </div>
          <div className="stat-card">
            <div className="stat-value">76%</div>
            <div className="stat-label">Средний балл</div>
          </div>
          <div className="stat-card">
            <div className="stat-value">320</div>
            <div className="stat-label">Попыток</div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminPanel;