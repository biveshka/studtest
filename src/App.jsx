// src/App.jsx
import React, { useState } from 'react';
import TestSelection from './components/TestSelection';
import AdminLogin from './components/AdminLogin';
import AdminPanel from './components/AdminPanel';
import './App.css';

function App() {
  const [currentView, setCurrentView] = useState('role-selection'); // 'role-selection', 'test-selection', 'admin-login', 'admin-panel'
  const [userRole, setUserRole] = useState(null);

  const handleRoleSelect = (role) => {
    if (role === 'admin') {
      setCurrentView('admin-login');
    } else {
      setUserRole(role);
      setCurrentView('test-selection');
    }
  };

  const handleAdminLogin = (success) => {
  if (success) {
    setUserRole('admin');
    setCurrentView('admin-panel');
  } else {
    // Ошибка уже обработана в AdminLogin компоненте
    console.log('Ошибка входа администратора');
  }
};

  const handleBackToRoleSelection = () => {
    setCurrentView('role-selection');
    setUserRole(null);
  };

  const handleRoleChange = () => {
    setCurrentView('role-selection');
  };

  return (
    <div className="App">
      {currentView === 'role-selection' && (
        <div className="role-selection">
          <h1>Выберите роль</h1>
          <div className="role-buttons">
            <button onClick={() => handleRoleSelect('user')}>
              Учащийся
            </button>
            <button onClick={() => handleRoleSelect('admin')}>
              Администратор
            </button>
          </div>
        </div>
      )}

      {currentView === 'test-selection' && (
        <TestSelection onRoleChange={handleRoleChange} />
      )}

      {currentView === 'admin-login' && (
        <AdminLogin 
          onBack={handleBackToRoleSelection}
          onLogin={handleAdminLogin}
        />
      )}

      {currentView === 'admin-panel' && (
        <AdminPanel onRoleChange={handleRoleChange} />
      )}
    </div>
  );
}

export default App;