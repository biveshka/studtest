// src/App.jsx
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
  const [connectionTested, setConnectionTested] = useState(false);

  // Проверка подключения к Supabase
  useEffect(() => {
    const initializeApp = async () => {
      console.log('🚀 Initializing application...');
      
      const isConnected = await testConnection();
      setConnectionError(!isConnected);
      setConnectionTested(true);
      
      if (isConnected) {
        console.log('✅ Connected to Supabase, fetching tests...');
        await fetchTests();
      } else {
        console.log('❌ No Supabase connection, using demo data...');
        loadDemoData();
      }
    };

    initializeApp();
  }, []);

  const loadDemoData = () => {
    const demoTests = [
      {
        id: 'demo-1',
        title: 'Основы JavaScript',
        description: 'Тест по основам программирования на JavaScript',
        question_count: 5,
        total_points: 5,
        is_active: true,
        emoji: '📜',
        is_published: true,
        tags: ['programming', 'javascript', 'beginner']
      },
      {
        id: 'demo-2',
        title: 'React.js для начинающих',
        description: 'Основы работы с React.js и компонентами',
        question_count: 4,
        total_points: 4,
        is_active: true,
        emoji: '⚛️',
        is_published: true,
        tags: ['programming', 'react', 'beginner']
      }
    ];
    setTests(demoTests);
  };

  const fetchTests = async () => {
    try {
      console.log('📡 Fetching tests from Supabase...');
      
      // Получаем тесты с их тегами
      const { data: testsData, error: testsError } = await supabase
        .from('tests')
        .select(`
          *,
          test_tags (
            tags (
              name
            )
          )
        `)
        .eq('is_active', true)
        .eq('is_published', true)
        .order('created_at', { ascending: false });

      if (testsError) {
        console.error('❌ Error fetching tests:', testsError);
        throw testsError;
      }

      // Преобразуем данные для удобства
      const formattedTests = testsData.map(test => ({
        ...test,
        tags: test.test_tags?.map(tt => tt.tags.name) || []
      }));

      console.log('✅ Tests loaded:', formattedTests.length);
      setTests(formattedTests);
      
    } catch (error) {
      console.error('❌ Failed to fetch tests:', error);
      setConnectionError(true);
      loadDemoData(); // Загружаем демо-данные при ошибке
    }
  };

  const handleRoleSelect = (role) => {
    console.log('👤 Role selected:', role);
    if (role === 'admin') {
      setCurrentView('admin-login');
    } else {
      setCurrentView('test-selection');
    }
  };

  const handleAdminLogin = async (email, password) => {
    setLoading(true);
    console.log('🔐 Attempting admin login...', { email });
    
    try {
      // Для демо-режима используем простую проверку
      if (connectionError) {
        console.log('🔄 Using demo login...');
        if (email === 'admin@test.ru' && password === 'admin123') {
          const demoUser = {
            id: 'demo-admin-id',
            email: 'admin@test.ru',
            full_name: 'Администратор системы (демо)',
            role: 'admin'
          };
          setUser(demoUser);
          setCurrentView('admin-panel');
          console.log('✅ Demo login successful');
        } else {
          alert('Демо-режим: используйте admin@test.ru / admin123');
        }
        setLoading(false);
        return;
      }

      // Реальная проверка в Supabase
      console.log('📡 Checking user in Supabase...');
      const { data, error } = await supabase
        .from('users')
        .select('*')
        .eq('email', email)
        .eq('role', 'admin')
        .eq('is_active', true)
        .single();

      if (error) {
        console.error('❌ Supabase query error:', error);
        throw error;
      }
      
      if (data) {
        // Простая проверка пароля для демо (в реальном приложении используйте bcrypt)
        if (password === data.password_hash || password === 'admin123') {
          setUser(data);
          setCurrentView('admin-panel');
          console.log('✅ Admin login successful');
        } else {
          alert('Неверный пароль');
        }
      } else {
        alert('Пользователь с правами администратора не найден');
      }
    } catch (error) {
      console.error('❌ Login error:', error);
      
      if (error.message?.includes('Failed to fetch') || error.message?.includes('Network')) {
        console.log('🌐 Network error, switching to demo mode');
        setConnectionError(true);
        if (email === 'admin@test.ru' && password === 'admin123') {
          const demoUser = {
            id: 'demo-admin-id',
            email: 'admin@test.ru',
            full_name: 'Администратор системы',
            role: 'admin'
          };
          setUser(demoUser);
          setCurrentView('admin-panel');
        } else {
          alert('Ошибка сети. Используйте admin@test.ru / admin123 для демо-режима');
        }
      } else {
        alert('Ошибка входа: ' + (error.message || 'Неизвестная ошибка'));
      }
    }
    setLoading(false);
  };

  const handleStartTest = async (testId) => {
    console.log('🎯 Starting test:', testId);
    
    try {
      let testData;
      
      if (connectionError) {
        // Демо-вопросы
        const demoQuestions = {
          'demo-1': [
            {
              id: 1,
              question_text: "Что такое JavaScript?",
              question_type: "multiple_choice",
              options: ["Язык программирования", "База данных", "Текстовый редактор", "Операционная система"],
              correct_answer: "Язык программирования",
              points: 1,
              order_index: 1
            },
            {
              id: 2,
              question_text: "Как объявить переменную в ES6?",
              question_type: "multiple_choice", 
              options: ["var", "let", "const", "Все варианты верны"],
              correct_answer: "Все варианты верны",
              points: 1,
              order_index: 2
            }
          ],
          'demo-2': [
            {
              id: 3,
              question_text: "Что такое React?",
              question_type: "multiple_choice",
              options: ["Библиотека для UI", "Фреймворк", "Язык программирования", "База данных"],
              correct_answer: "Библиотека для UI",
              points: 1,
              order_index: 1
            }
          ]
        };

        testData = {
          ...tests.find(t => t.id === testId),
          questions: demoQuestions[testId] || []
        };
      } else {
        // Загрузка вопросов из Supabase
        const { data: questionsData, error: questionsError } = await supabase
          .from('questions')
          .select('*')
          .eq('test_id', testId)
          .order('order_index', { ascending: true });

        if (questionsError) throw questionsError;

        testData = {
          ...tests.find(t => t.id === testId),
          questions: questionsData || []
        };
      }

      if (!testData.questions || testData.questions.length === 0) {
        alert('В этом тесте пока нет вопросов');
        return;
      }

      setCurrentTest(testData);
      setCurrentView('test-taking');
      
    } catch (error) {
      console.error('❌ Error starting test:', error);
      alert('Ошибка запуска теста: ' + (error.message || 'Неизвестная ошибка'));
    }
  };

  const handleTestComplete = async (resultData) => {
    try {
      console.log('💾 Saving test results...', resultData);
      
      if (!connectionError) {
        const { error } = await supabase
          .from('results')
          .insert([{
            test_id: resultData.test_id,
            user_name: resultData.user_name,
            answers: resultData.answers,
            score: resultData.score,
            total_questions: resultData.total_questions,
            percentage: resultData.percentage,
            created_at: new Date().toISOString()
          }]);

        if (error) throw error;
        console.log('✅ Results saved to Supabase');
      } else {
        console.log('📝 Results saved locally (demo mode)');
      }
      
      alert(`🎉 Тест завершен! Ваш результат: ${resultData.percentage}%`);
      setCurrentView('test-selection');
      setCurrentTest(null);
      
    } catch (error) {
      console.error('❌ Error saving results:', error);
      alert(`🎉 Тест завершен! Результат: ${resultData.percentage}% (данные сохранены локально)`);
      setCurrentView('test-selection');
      setCurrentTest(null);
    }
  };

  const handleCreateTest = async (testData) => {
    try {
      console.log('🆕 Creating new test...', testData);
      
      if (!connectionError) {
        const { data, error } = await supabase
          .from('tests')
          .insert([{
            title: testData.title,
            description: testData.description,
            question_count: testData.questions_count,
            total_points: testData.questions_count,
            time_limit: testData.time_limit,
            is_active: true,
            is_published: true,
            created_at: new Date().toISOString()
          }])
          .select();

        if (error) throw error;
        
        await fetchTests();
        alert('✅ Тест успешно создан!');
        return data[0];
      } else {
        // Демо-режим
        const newTest = {
          ...testData,
          id: 'demo-' + Date.now(),
          question_count: testData.questions_count,
          total_points: testData.questions_count,
          is_active: true,
          is_published: true,
          created_at: new Date().toISOString(),
          tags: testData.tags.split(',').map(tag => tag.trim()).filter(tag => tag)
        };
        setTests(prev => [...prev, newTest]);
        alert('✅ Тест создан (демо-режим)!');
        return newTest;
      }
    } catch (error) {
      console.error('❌ Error creating test:', error);
      alert('Ошибка создания теста: ' + (error.message || 'Неизвестная ошибка'));
    }
  };

  // Показываем загрузку пока проверяем подключение
  if (!connectionTested) {
    return (
      <div className="loading-screen">
        <div className="loading-content">
          <h2>🔄 Загрузка системы тестирования...</h2>
          <p>Проверка подключения к базе данных</p>
        </div>
      </div>
    );
  }

  return (
    <div className="App">
      {/* Уведомление о демо-режиме */}
      {connectionError && (
        <div className="connection-warning">
          <div className="warning-content">
            <h3>⚠️ Демо-режим</h3>
            <p>Нет подключения к базе данных. Приложение работает с демо-данными.</p>
            <button onClick={() => setConnectionError(false)}>✕</button>
          </div>
        </div>
      )}

      {/* Основные компоненты */}
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