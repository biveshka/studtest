import React, { useState, useEffect } from 'react';
import AdminPanel from './components/AdminPanel';
import AdminLogin from './components/AdminLogin';
import UserInterface from './components/UserInterface';
import { API_BASE_URL } from './config';

function App() {
  const [currentView, setCurrentView] = useState('roleSelection');
  const [tests, setTests] = useState([]);
  const [tags, setTags] = useState([]);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [user, setUser] = useState(null);
  const [filteredTests, setFilteredTests] = useState([]);
  const [selectedTag, setSelectedTag] = useState(null);
  const [loading, setLoading] = useState(true);

  // Загрузка данных при запуске
  useEffect(() => {
    loadInitialData();
  }, []);

  const loadInitialData = async () => {
    try {
      const [testsResponse, tagsResponse] = await Promise.all([
        fetch(`${API_BASE_URL}/tests`),
        fetch(`${API_BASE_URL}/tags`)
      ]);

      const testsData = await testsResponse.json();
      const tagsData = await tagsResponse.json();

      setTests(testsData);
      setFilteredTests(testsData);
      setTags(tagsData);
    } catch (error) {
      console.error('Ошибка загрузки данных:', error);
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

  const handleAdminLogin = async (userData) => {
    setIsAuthenticated(true);
    setUser(userData);
    setCurrentView('admin');
  };

  const handleAdminLogout = () => {
    setIsAuthenticated(false);
    setUser(null);
    setCurrentView('roleSelection');
  };

  const handleAddTest = async (newTest) => {
    try {
      const response = await fetch(`${API_BASE_URL}/tests`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...newTest,
          created_by: user?.id
        })
      });

      const result = await response.json();

      if (result.success) {
        // Перезагружаем тесты
        await loadInitialData();
      } else {
        alert('Ошибка при создании теста: ' + result.error);
      }
    } catch (error) {
      console.error('Ошибка:', error);
      alert('Ошибка при создании теста');
    }
  };

  const handleUpdateTest = async (updatedTest) => {
    try {
      const response = await fetch(`${API_BASE_URL}/tests/${updatedTest.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...updatedTest,
          updated_by: user?.id
        })
      });

      const result = await response.json();

      if (result.success) {
        // Перезагружаем тесты
        await loadInitialData();
      } else {
        alert('Ошибка при обновлении теста: ' + result.error);
      }
    } catch (error) {
      console.error('Ошибка:', error);
      alert('Ошибка при обновлении теста');
    }
  };

  const handleDeleteTest = async (testId) => {
    if (!window.confirm('Вы уверены, что хотите удалить этот тест?')) {
      return;
    }

    try {
      const response = await fetch(`${API_BASE_URL}/tests/${testId}`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          user_id: user?.id
        })
      });

      const result = await response.json();

      if (result.success) {
        // Перезагружаем тесты
        await loadInitialData();
      } else {
        alert('Ошибка при удалении теста: ' + result.error);
      }
    } catch (error) {
      console.error('Ошибка:', error);
      alert('Ошибка при удалении теста');
    }
  };

  const handleAddReview = async (testId, review) => {
    try {
      const response = await fetch(`${API_BASE_URL}/reviews`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          test_id: testId,
          ...review
        })
      });

      const result = await response.json();

      if (result.success) {
        // Перезагружаем тесты для обновления рейтинга
        await loadInitialData();
      } else {
        alert('Ошибка при сохранении отзыва: ' + result.error);
      }
    } catch (error) {
      console.error('Ошибка:', error);
      alert('Ошибка при сохранении отзыва');
    }
  };

  const handleTagFilter = (tag) => {
    setSelectedTag(selectedTag?.id === tag.id ? null : tag);
  };

  // Фильтрация тестов по выбранному тегу
  useEffect(() => {
    if (selectedTag) {
      setFilteredTests(tests.filter(test => 
        test.tags?.some(t => t.id === selectedTag.id)
      ));
    } else {
      setFilteredTests(tests);
    }
  }, [selectedTag, tests]);

  const renderRoleSelection = () => (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center">
      <div className="bg-white rounded-2xl shadow-2xl p-8 max-w-md w-full mx-4">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-800 mb-4">
            Система тестирования
          </h1>
          <p className="text-gray-600">
            Выберите режим входа в систему
          </p>
        </div>

        <div className="space-y-4">
          <button
            onClick={() => handleRoleSelection(false)}
            className="w-full bg-blue-600 text-white py-4 px-6 rounded-xl hover:bg-blue-700 transition-colors duration-200 font-semibold text-lg"
          >
            🎓 Студент
            <div className="text-sm font-normal mt-1 opacity-90">
              Пройти тестирование
            </div>
          </button>

          <button
            onClick={() => handleRoleSelection(true)}
            className="w-full bg-green-600 text-white py-4 px-6 rounded-xl hover:bg-green-700 transition-colors duration-200 font-semibold text-lg"
          >
            ⚙️ Администратор
            <div className="text-sm font-normal mt-1 opacity-90">
              Управление тестами
            </div>
          </button>
        </div>

        <div className="mt-6 text-center text-gray-500 text-sm">
          Версия 2.0 с полной интеграцией Supabase
        </div>
      </div>
    </div>
  );

  if (loading) {
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
          tests={filteredTests}
          tags={tags}
          selectedTag={selectedTag}
          onTagFilter={handleTagFilter}
          onAddReview={handleAddReview}
          onBackToRoleSelection={() => setCurrentView('roleSelection')}
        />
      )}
      {currentView === 'adminLogin' && (
        <AdminLogin 
          onLogin={handleAdminLogin}
          onBack={() => setCurrentView('roleSelection')}
        />
      )}
      {currentView === 'admin' && (
        <AdminPanel 
          tests={tests}
          tags={tags}
          onAddTest={handleAddTest}
          onUpdateTest={handleUpdateTest}
          onDeleteTest={handleDeleteTest}
          onLogout={handleAdminLogout}
          user={user}
        />
      )}
    </div>
  );
}

export default App;