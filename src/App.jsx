import React, { useState, useEffect } from 'react';
import AdminPanel from './components/AdminPanel';
import AdminLogin from './components/AdminLogin';
import UserInterface from './components/UserInterface';
import { testsAPI, usersAPI } from './services/api';

function App() {
  const [currentView, setCurrentView] = useState('roleSelection');
  const [tests, setTests] = useState([]);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  // Загрузка тестов из Supabase
  useEffect(() => {
    loadTests();
  }, []);

  const loadTests = async () => {
    try {
      setLoading(true);
      const testsData = await testsAPI.getTests();
      setTests(testsData);
    } catch (err) {
      setError('Ошибка загрузки тестов: ' + err.message);
      console.error('Error loading tests:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleRoleSelection = (isAdmin) => {
    if (isAdmin) {
      setCurrentView('adminLogin');
    } else {
      setCurrentView('user');
    }
  };

  const handleAdminLogin = async (email, password) => {
    try {
      setLoading(true);
      const userData = await usersAPI.adminLogin(email, password);
      setIsAuthenticated(true);
      setUser(userData);
      setCurrentView('admin');
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleAdminLogout = () => {
    setIsAuthenticated(false);
    setUser(null);
    setCurrentView('roleSelection');
  };

  const handleAddTest = async (newTest) => {
    try {
      setLoading(true);
      const testWithUser = {
        ...newTest,
        created_by: user?.id || null
      };
      const createdTest = await testsAPI.createTest(testWithUser);
      setTests(prev => [...prev, createdTest]);
    } catch (err) {
      setError('Ошибка создания теста: ' + err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateTest = async (updatedTest) => {
    try {
      setLoading(true);
      const result = await testsAPI.updateTest(updatedTest.id, updatedTest);
      setTests(prev => prev.map(test => 
        test.id === updatedTest.id ? result : test
      ));
    } catch (err) {
      setError('Ошибка обновления теста: ' + err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteTest = async (testId) => {
    try {
      setLoading(true);
      await testsAPI.deleteTest(testId);
      setTests(prev => prev.filter(test => test.id !== testId));
    } catch (err) {
      setError('Ошибка удаления теста: ' + err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const renderRoleSelection = () => (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center">
      <div className="bg-white rounded-2xl shadow-2xl p-8 max-w-md w-full mx-4">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-800 mb-4">
            Система тестирования
          </h1>
          <p className="text-gray-600">
            Данные сохраняются в облачной базе и доступны на всех устройствах
          </p>
        </div>

        {error && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-3 mb-4">
            <p className="text-red-600 text-sm">{error}</p>
          </div>
        )}

        <div className="space-y-4">
          <button
            onClick={() => handleRoleSelection(false)}
            className="w-full bg-blue-600 text-white py-4 px-6 rounded-xl hover:bg-blue-700 transition-colors duration-200 font-semibold text-lg"
            disabled={loading}
          >
            🎓 Студент
            <div className="text-sm font-normal mt-1 opacity-90">
              Пройти тестирование
            </div>
          </button>

          <button
            onClick={() => handleRoleSelection(true)}
            className="w-full bg-green-600 text-white py-4 px-6 rounded-xl hover:bg-green-700 transition-colors duration-200 font-semibold text-lg"
            disabled={loading}
          >
            ⚙️ Администратор
            <div className="text-sm font-normal mt-1 opacity-90">
              Управление тестами
            </div>
          </button>
        </div>

        <div className="mt-6 text-center text-gray-500 text-sm">
          Cloud Sync Enabled ✓
        </div>
      </div>
    </div>
  );

  if (loading && currentView === 'roleSelection') {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Загрузка данных...</p>
        </div>
      </div>
    );
  }

  return (
    <div>
      {currentView === 'roleSelection' && renderRoleSelection()}
      {currentView === 'user' && (
        <UserInterface 
          tests={tests} 
          onBackToRoleSelection={() => setCurrentView('roleSelection')}
          loading={loading}
        />
      )}
      {currentView === 'adminLogin' && (
        <AdminLogin 
          onLogin={handleAdminLogin}
          onBack={() => setCurrentView('roleSelection')}
          loading={loading}
          error={error}
        />
      )}
      {currentView === 'admin' && (
        <AdminPanel 
          tests={tests}
          onAddTest={handleAddTest}
          onUpdateTest={handleUpdateTest}
          onDeleteTest={handleDeleteTest}
          onLogout={handleAdminLogout}
          user={user}
          loading={loading}
          onRefresh={loadTests}
        />
      )}
    </div>
  );
}

export default App;