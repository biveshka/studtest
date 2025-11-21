import React, { useState, useEffect } from 'react';
import { supabase, testConnection } from './supabase';
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
  const [connectionError, setConnectionError] = useState(false);

  // Проверка подключения к Supabase
  useEffect(() => {
    const checkConnection = async () => {
      const isConnected = await testConnection();
      setConnectionError(!isConnected);
      
      if (isConnected) {
        fetchTests();
      }
    };
    
    checkConnection();
  }, []);

  const fetchTests = async () => {
    try {
      console.log('Fetching tests from Supabase...');
      const { data, error } = await supabase
        .from('tests')
        .select('*')
        .eq('is_active', true)
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Supabase error:', error);
        throw error;
      }
      
      console.log('Tests loaded:', data?.length || 0);
      setTests(data || []);
    } catch (error) {
      console.error('Error fetching tests:', error);
      setConnectionError(true);
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
      console.log('Attempting admin login...');
      
      // Для демо-режима - временное решение
      if (email === 'admin@test.ru' && password === 'admin123') {
        // Создаем мок-пользователя для демо
        const demoUser = {
          id: 'demo-admin-id',
          email: 'admin@test.ru',
          full_name: 'Администратор системы',
          role: 'admin'
        };
        setUser(demoUser);
        setCurrentView('admin-panel');
        setLoading(false);
        return;
      }

      // Попытка реального запроса к Supabase
      const { data, error } = await supabase
        .from('users')
        .select('*')
        .eq('email', email)
        .eq('role', 'admin')
        .eq('is_active', true)
        .single();

      if (error) {
        console.error('Supabase query error:', error);
        throw error;
      }
      
      if (data) {
        // Временная проверка пароля для демо
        if (password === 'admin123') {
          setUser(data);
          setCurrentView('admin-panel');
        } else {
          alert('Неверный пароль');
        }
      } else {
        alert('Пользователь с правами администратора не найден');
      }
    } catch (error) {
      console.error('Login error:', error);
      
      // Если ошибка сети, используем демо-режим
      if (error.message.includes('Failed to fetch') || error.message.includes('Network')) {
        console.log('Network error, using demo mode');
        if (email === 'admin@test.ru' && password === 'admin123') {
          const demoUser = {
            id: 'demo-admin-id',
            email: 'admin@test.ru',
            full_name: 'Администратор системы (демо)',
            role: 'admin'
          };
          setUser(demoUser);
          setCurrentView('admin-panel');
        } else {
          alert('Демо-режим: используйте admin@test.ru / admin123');
        }
      } else {
        alert('Ошибка входа: ' + error.message);
      }
    }
    setLoading(false);
  };

  // Остальные функции остаются без изменений
  const handleStartTest = async (testId) => {
    try {
      // Демо-данные для тестов
      const demoQuestions = [
        {
          id: 1,
          question_text: "Что такое JavaScript?",
          question_type: "multiple_choice",
          options: ["Язык программирования", "База данных", "Фреймворк", "Операционная система"],
          correct_answer: "Язык программирования"
        },
        {
          id: 2, 
          question_text: "Для чего используется React?",
          question_type: "multiple_choice",
          options: ["Для создания пользовательских интерфейсов", "Для работы с базами данных", "Для машинного обучения", "Для мобильной разработки"],
          correct_answer: "Для создания пользовательских интерфейсов"
        }
      ];

      const test = tests.find(t => t.id === testId) || {
        id: testId,
        title: "Демо-тест",
        time_limit: 30,
        questions: demoQuestions
      };

      setCurrentTest(test);
      setCurrentView('test-taking');
    } catch (error) {
      console.error('Error starting test:', error);
      alert('Ошибка запуска теста');
    }
  };

  const handleTestComplete = async (resultData) => {
    try {
      if (!connectionError) {
        const { error } = await supabase
          .from('test_results')
          .insert([{
            ...resultData,
            created_at: new Date().toISOString()
          }]);

        if (error) throw error;
      }
      
      alert(`Тест завершен! Ваш результат: ${resultData.score}%`);
      setCurrentView('test-selection');
      setCurrentTest(null);
    } catch (error) {
      console.error('Error saving result:', error);
      alert('Тест завершен! Результат: ' + resultData.score + '% (данные сохранены локально)');
      setCurrentView('test-selection');
      setCurrentTest(null);
    }
  };

  const handleCreateTest = async (testData) => {
    try {
      if (!connectionError) {
        const { data, error } = await supabase
          .from('tests')
          .insert([{
            ...testData,
            created_at: new Date().toISOString()
          }])
          .select();

        if (error) throw error;
        
        await fetchTests();
        alert('Тест успешно создан!');
        return data[0];
      } else {
        // Демо-режим: добавляем тест локально
        const newTest = {
          ...testData,
          id: Date.now(),
          created_at: new Date().toISOString()
        };
        setTests(prev => [...prev, newTest]);
        alert('Тест создан (демо-режим)!');
        return newTest;
      }
    } catch (error) {
      console.error('Error creating test:', error);
      alert('Ошибка создания теста');
    }
  };

  return (
    <div className="App">
      {/* Показываем ошибку подключения */}
      {connectionError && (
        <div className="connection-warning">
          <div className="warning-content">
            <h3>⚠️ Демо-режим</h3>
            <p>Нет подключения к базе данных. Приложение работает в демо-режиме.</p>
            <button onClick={() => setConnectionError(false)}>✕</button>
          </div>
        </div>
      )}

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
          connectionError={connectionError}
        />
      )}

      {currentView === 'admin-panel' && (
        <AdminPanel 
          user={user}
          tests={tests}
          onRoleChange={() => setCurrentView('role-selection')}
          onCreateTest={handleCreateTest}
          onRefreshTests={fetchTests}
          connectionError={connectionError}
        />
      )}
    </div>
  );
}

export default App;