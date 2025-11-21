import React, { useState, useEffect } from 'react';
import RoleSelection from './components/RoleSelection';
import TestSelection from './components/TestSelection';
import AdminLogin from './components/AdminLogin';
import AdminPanel from './components/AdminPanel';
import './App.css';

function App() {
  const [currentView, setCurrentView] = useState('role-selection');
  const [user, setUser] = useState(null);
  const [tests, setTests] = useState([]);
  const [loading, setLoading] = useState(false);

  // Временные мок-данные
  useEffect(() => {
    const mockTests = [
      {
        id: 1,
        title: "Основы JavaScript",
        description: "Тест по основам программирования на JavaScript",
        tags: ["programming", "javascript", "beginner"],
        questions_count: 10,
        time_limit: 30,
        difficulty: "beginner"
      },
      {
        id: 2,
        title: "React.js основы", 
        description: "Тестирование знаний по React.js и компонентам",
        tags: ["react", "frontend", "javascript"],
        questions_count: 15,
        time_limit: 45,
        difficulty: "intermediate"
      },
      {
        id: 3,
        title: "Базы данных SQL",
        description: "Тест по основам реляционных баз данных и SQL",
        tags: ["database", "sql", "backend"],
        questions_count: 20,
        time_limit: 60,
        difficulty: "intermediate"
      }
    ];
    setTests(mockTests);
  }, []);

  const handleRoleSelect = (role) => {
    if (role === 'admin') {
      setCurrentView('admin-login');
    } else {
      setCurrentView('test-selection');
    }
  };

  const handleAdminLogin = async (email, password) => {
    setLoading(true);
    // Временная мок-авторизация
    setTimeout(() => {
      if (email === 'admin@test.ru' && password === 'admin123') {
        setUser({ name: 'Администратор', email });
        setCurrentView('admin-panel');
      } else {
        alert('Неверные данные для входа');
      }
      setLoading(false);
    }, 1000);
  };

  const handleStartTest = (testId) => {
    alert(`Запуск теста ID: ${testId}\n\nФункционал тестирования в разработке...`);
  };

  console.log('Текущий вид:', currentView); // Для отладки

  return (
    <div className="App">
      {currentView === 'role-selection' && (
        <RoleSelection onRoleSelect={handleRoleSelect} />
      )}

      {currentView === 'test-selection' && (
        <TestSelection 
          tests={tests}
          onRoleChange={() => setCurrentView('role-selection')}
          onStartTest={handleStartTest}
        />
      )}

      {currentView === 'admin-login' && (
        <AdminLogin 
          onBack={() => setCurrentView('role-selection')}
          onLogin={handleAdminLogin}
          loading={loading}
        />
      )}

      {currentView === 'admin-panel' && (
        <AdminPanel 
          user={user}
          onRoleChange={() => setCurrentView('role-selection')}
        />
      )}

      {/* Если ничего не отображается */}
      {!currentView && (
        <div style={{ padding: '50px', textAlign: 'center' }}>
          <h1>Ошибка загрузки</h1>
          <button onClick={() => setCurrentView('role-selection')}>
            Вернуться к выбору роли
          </button>
        </div>
      )}
    </div>
  );
}

export default App;