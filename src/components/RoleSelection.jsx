// src/components/RoleSelection.jsx
import React from 'react';

const RoleSelection = ({ onRoleSelect }) => {
  return (
    <div className="role-selection">
      <div className="container">
        <h1>Система тестирования</h1>
        <div className="role-cards">
          <div className="role-card" onClick={() => onRoleSelect('user')}>
            <div className="role-icon">👨‍🎓</div>
            <h3>Учащийся</h3>
            <p>Пройти тестирование</p>
          </div>
          <div className="role-card" onClick={() => onRoleSelect('admin')}>
            <div className="role-icon">👨‍💼</div>
            <h3>Администратор</h3>
            <p>Управление системой</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RoleSelection;