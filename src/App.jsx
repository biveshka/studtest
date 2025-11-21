import React, { useState } from 'react';
import TestSelection from './components/TestSelection';
import AdminLogin from './components/AdminLogin';
import AdminPanel from './components/AdminPanel';
import './App.css';

function App() {
  const [currentView, setCurrentView] = useState('role-selection');
  const [userRole, setUserRole] = useState(null);

  const handleRoleSelect = (role) => {
    console.log('Выбрана роль:', role);
    if (role === 'admin') {
      setCurrentView('admin-login');
    } else {
      setUserRole('user');
      setCurrentView('test-selection');
    }
  };

  const handleAdminLogin = (success) => {
    console.log('Результат входа администратора:', success);
    if (success) {
      setUserRole('admin');
      setCurrentView('admin-panel');
    } else {
      // Ошибка уже обработана в AdminLogin
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

  const handleStartTest = (testId) => {
    alert(`Запуск теста ID: ${testId}\n\nФункционал тестирования в разработке...`);
    // Здесь будет логика начала теста
  };

  // Добавим отладочную информацию
  console.log('Текущий вид:', currentView, 'Роль:', userRole);

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
        <TestSelection 
          onRoleChange={handleRoleChange}
          onStartTest={handleStartTest}
        />
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

      {/* Если что-то пошло не так - покажем отладочную информацию */}
      {currentView === 'admin-panel' && !userRole && (
        <div style={{ color: 'red', padding: '20px' }}>
          <h2>Ошибка: не определена роль пользователя</h2>
          <button onClick={handleBackToRoleSelection}>
            Вернуться к выбору роли
          </button>
        </div>
      )}
    </div>
  );
}

export default App;