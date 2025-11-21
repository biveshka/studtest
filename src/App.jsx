import React, { useState, useEffect } from 'react';
import { supabase } from './supabase';
import RoleSelection from './components/RoleSelection';
import TestSelection from './components/TestSelection';
import AdminLogin from './components/AdminLogin';
import AdminPanel from './components/AdminPanel';
import TestTaking from './components/TestTaking';
import './App.css';

function App() {
  const [currentView, setCurrentView] = useState('role-selection');
  const [user, setUser] = useState(null);
  const [tests, setTests] = useState([]);
  const [currentTest, setCurrentTest] = useState(null);
  const [loading, setLoading] = useState(false);

  // Загрузка тестов из Supabase
  useEffect(() => {
    fetchTests();
  }, []);

  const fetchTests = async () => {
    try {
      const { data, error } = await supabase
        .from('tests')
        .select('*')
        .eq('is_active', true)
        .order('created_at', { ascending: false });

      if (error) throw error;
      setTests(data || []);
    } catch (error) {
      console.error('Error fetching tests:', error);
    }
  };

  const handleRoleSelect = (role) => {
    if (role === 'admin') {
      setCurrentView('admin-login');
    } else {
      setCurrentView('test-selection');
    }
  };

  const handleAdminLogin = async (email, password) => {
    setLoading(true);
    try {
      // Используем таблицу users вместо admins
      const { data, error } = await supabase
        .from('users')
        .select('*')
        .eq('email', email)
        .eq('password', password)
        .eq('role', 'admin') // Проверяем что это администратор
        .single();

      if (error) throw error;
      
      if (data) {
        setUser(data);
        setCurrentView('admin-panel');
      } else {
        alert('Неверные данные для входа или недостаточно прав');
      }
    } catch (error) {
      console.error('Login error:', error);
      alert('Ошибка входа: ' + error.message);
    }
    setLoading(false);
  };

  const handleStartTest = async (testId) => {
    try {
      // Загружаем тест с вопросами
      const { data: testData, error: testError } = await supabase
        .from('tests')
        .select('*')
        .eq('id', testId)
        .single();

      if (testError) throw testError;

      const { data: questionsData, error: questionsError } = await supabase
        .from('questions')
        .select('*')
        .eq('test_id', testId)
        .order('sort_order', { ascending: true });

      if (questionsError) throw questionsError;

      setCurrentTest({
        ...testData,
        questions: questionsData || []
      });
      setCurrentView('test-taking');
    } catch (error) {
      console.error('Error starting test:', error);
      alert('Ошибка запуска теста');
    }
  };

  const handleTestComplete = async (resultData) => {
    try {
      // Сохраняем результат теста
      const { error } = await supabase
        .from('test_results')
        .insert([{
          ...resultData,
          created_at: new Date().toISOString()
        }]);

      if (error) throw error;

      alert(`Тест завершен! Ваш результат: ${resultData.score}%`);
      setCurrentView('test-selection');
      setCurrentTest(null);
    } catch (error) {
      console.error('Error saving result:', error);
      alert('Ошибка сохранения результата');
    }
  };

  const handleCreateTest = async (testData) => {
    try {
      const { data, error } = await supabase
        .from('tests')
        .insert([{
          ...testData,
          created_at: new Date().toISOString()
        }])
        .select();

      if (error) throw error;

      await fetchTests(); // Обновляем список тестов
      alert('Тест успешно создан!');
      return data[0]; // Возвращаем созданный тест с ID
    } catch (error) {
      console.error('Error creating test:', error);
      alert('Ошибка создания теста');
    }
  };

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

      {currentView === 'test-taking' && currentTest && (
        <TestTaking 
          test={currentTest}
          onComplete={handleTestComplete}
          onBack={() => setCurrentView('test-selection')}
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
          tests={tests}
          onRoleChange={() => setCurrentView('role-selection')}
          onCreateTest={handleCreateTest}
          onRefreshTests={fetchTests}
        />
      )}
    </div>
  );
}

export default App;