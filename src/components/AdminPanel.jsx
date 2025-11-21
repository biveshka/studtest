import React from 'react';
import ResultsView from './ResultsView';

const AdminPanel = ({ onRoleChange }) => {
  return (
    <div className="admin-panel">
      <div className="admin-header">
        <h1>Панель администратора</h1>
        <button className="role-change-btn" onClick={onRoleChange}>
          Сменить роль
        </button>
      </div>
      
      <div className="admin-content">
        <ResultsView />
      </div>
    </div>
  );
};

export default AdminPanel;