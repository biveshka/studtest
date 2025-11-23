import React, { useState, useEffect } from 'react';
import { Routes, Route, Navigate, useNavigate, useLocation } from 'react-router-dom';
import './App.css'
import AdminPanel from './components/AdminPanel';
import AdminLogin from './components/AdminLogin';
import UserInterface from './components/UserInterface';
import Test from './components/Test';
import Results from './components/Results';
import TestReviews from './components/TestReviews';
import ResultsView from './components/ResultsView';

// Демо данные тестов с тегами и отзывами
const DEMO_TESTS = [
  {
    id: 1,
    title: "Тест по JavaScript",
    description: "Проверьте свои знания JavaScript",
    question_count: 3,
    max_score: 6,
    is_published: true,
    created_by: null,
    average_rating: 4.5,
    review_count: 12,
    tags: [
      { id: 1, name: 'JavaScript', color: '#F7DF1E' },
      { id: 3, name: 'React', color: '#61DAFB' }
    ],
    reviews: [
      {
        id: 1,
        user_name: "Иван Петров",
        rating: 5,
        comment: "Отличный тест! Очень полезные вопросы.",
        created_at: "2024-01-15T10:30:00Z",
        is_approved: true
      },
      {
        id: 2,
        user_name: "Мария Сидорова",
        rating: 4,
        comment: "Хороший тест, но можно добавить больше практических заданий.",
        created_at: "2024-01-14T15:20:00Z",
        is_approved: true
      }
    ],
    questions: [
      {
        id: 101,
        question_text: "Что такое closure в JavaScript?",
        options: ["Функция внутри функции", "Область видимости функции", "Замыкание", "Все варианты"],
        correct_answer: 2,
        points: 2
      },
      {
        id: 102,
        question_text: "Какой метод используется для создания элемента React?",
        options: ["React.createElement()", "React.newElement()", "React.makeElement()", "React.element()"],
        correct_answer: 0,
        points: 2
      },
      {
        id: 103,
        question_text: "Что возвращает функция useState в React?",
        options: ["Только значение", "Только функцию обновления", "Массив [значение, функция]", "Объект с значением и функцией"],
        correct_answer: 2,
        points: 2
      }
    ]
  },
  {
    id: 2,
    title: "Тест по HTML/CSS",
    description: "Основы веб-разработки",
    question_count: 2,
    max_score: 4,
    is_published: true,
    created_by: null,
    average_rating: 4.2,
    review_count: 8,
    tags: [
      { id: 2, name: 'HTML/CSS', color: '#E34F26' }
    ],
    reviews: [
      {
        id: 3,
        user_name: "Алексей Козлов",
        rating: 5,
        comment: "Понятные вопросы, хорошая структура теста.",
        created_at: "2024-01-13T09:15:00Z",
        is_approved: true
      }
    ],
    questions: [
      {
        id: 201,
        question_text: "Что означает CSS?",
        options: ["Computer Style Sheets", "Creative Style System", "Cascading Style Sheets", "Colorful Style Sheets"],
        correct_answer: 2,
        points: 2
      },
      {
        id: 202,
        question_text: "Какой тег используется для создания ссылки?",
        options: ["<link>", "<a>", "<href>", "<url>"],
        correct_answer: 1,
        points: 2
      }
    ]
  },
  {
    id: 3,
    title: "Тест по Python",
    description: "Основы программирования на Python",
    question_count: 5,
    max_score: 10,
    is_published: true,
    created_by: null,
    average_rating: 4.7,
    review_count: 15,
    tags: [
      { id: 4, name: 'Python', color: '#3776AB' },
      { id: 5, name: 'Алгоритмы', color: '#FF6B6B' }
    ],
    reviews: [
      {
        id: 4,
        user_name: "Дмитрий Новиков",
        rating: 5,
        comment: "Отличный тест для начинающих изучать Python!",
        created_at: "2024-01-12T14:45:00Z",
        is_approved: true
      }
    ],
    questions: [
      {
        id: 301,
        question_text: "Как создать список в Python?",
        options: ["list = ()", "list = {}", "list = []", "list = <>"],
        correct_answer: 2,
        points: 2
      },
      {
        id: 302,
        question_text: "Какой оператор используется для возведения в степень?",
        options: ["^", "**", "^^", "pow"],
        correct_answer: 1,
        points: 2
      },
      {
        id: 303,
        question_text: "Как объявить функцию в Python?",
        options: ["function myFunc()", "def myFunc()", "func myFunc()", "define myFunc()"],
        correct_answer: 1,
        points: 2
      },
      {
        id: 304,
        question_text: "Что такое декоратор Python?",
        options: ["Специальный тип комментария", "Функция, которая изменяет поведение другой функции", "Способ оформления кода", "Тип данных для декоративных строк"],
        correct_answer: 1,
        points: 2
      },
      {
        id: 305,
        question_text: "Что такое генератор в Python?",
        options: ["Функция для создания случайных чисел", "Объект по итерации для последовательности", "Функция с yield вместо return", "Модуль для работы с электроэнергией"],
        correct_answer: 2,
        points: 2
      }
    ]
  }
];

// Демо теги
const DEMO_TAGS = [
  { id: 1, name: 'JavaScript', color: '#F7DF1E' },
  { id: 2, name: 'HTML/CSS', color: '#E34F26' },
  { id: 3, name: 'React', color: '#61DAFB' },
  { id: 4, name: 'Python', color: '#3776AB' },
  { id: 5, name: 'Базы данных', color: '#336791' },
  { id: 6, name: 'Алгоритмы', color: '#FF6B6B' }
];

// Компонент выбора роли
const RoleSelection = ({ onRoleSelect }) => {
  return (
    <div style={{
        minHeight: '100vh',
        background: 'linear-gradient(135deg, #f0f9ff 0%, #e0e7ff 100%)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '1rem'
    }}>
        <div style={{
            backgroundColor: 'white',
            borderRadius: '1rem',
            boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25)',
            padding: '2rem',
            maxWidth: '28rem',
            width: '100%'
        }}>
            <div style={{
                textAlign: 'center',
                marginBottom: '2rem'
            }}>
                <h1 style={{
                    fontSize: '1.875rem',
                    fontWeight: 'bold',
                    color: '#1f2937',
                    marginBottom: '1rem'
                }}>
                    Система тестирования
                </h1>
                <p style={{
                    color: '#6b7280'
                }}>
                    Выберите режим входа в систему
                </p>
            </div>

            <div style={{
                display: 'flex',
                flexDirection: 'column',
                gap: '1rem'
            }}>
                <button
                    onClick={() => onRoleSelect('user')}
                    style={{
                        width: '100%',
                        backgroundColor: '#2563eb',
                        color: 'white',
                        padding: '1rem 1.5rem',
                        borderRadius: '0.75rem',
                        border: 'none',
                        cursor: 'pointer',
                        fontWeight: '600',
                        fontSize: '1.125rem',
                        transition: 'background-color 0.2s'
                    }}
                    onMouseOver={(e) => e.target.style.backgroundColor = '#1d4ed8'}
                    onMouseOut={(e) => e.target.style.backgroundColor = '#2563eb'}
                >
                    🎓 Студент
                    <div style={{
                        fontSize: '0.875rem',
                        fontWeight: '400',
                        marginTop: '0.25rem',
                        opacity: '0.9'
                    }}>
                        Пройти тестирование
                    </div>
                </button>

                <button
                    onClick={() => onRoleSelect('admin')}
                    style={{
                        width: '100%',
                        backgroundColor: '#16a34a',
                        color: 'white',
                        padding: '1rem 1.5rem',
                        borderRadius: '0.75rem',
                        border: 'none',
                        cursor: 'pointer',
                        fontWeight: '600',
                        fontSize: '1.125rem',
                        transition: 'background-color 0.2s'
                    }}
                    onMouseOver={(e) => e.target.style.backgroundColor = '#15803d'}
                    onMouseOut={(e) => e.target.style.backgroundColor = '#16a34a'}
                >
                    ⚙️ Администратор
                    <div style={{
                        fontSize: '0.875rem',
                        fontWeight: '400',
                        marginTop: '0.25rem',
                        opacity: '0.9'
                    }}>
                        Управление тестами
                    </div>
                </button>
            </div>

            <div style={{
                marginTop: '1.5rem',
                textAlign: 'center',
                color: '#6b7280',
                fontSize: '0.875rem'
            }}>
                Версия 2.0 с тегами и отзывами
            </div>
        </div>
    </div>
  );
};

function App() {
  const [tests, setTests] = useState(DEMO_TESTS);
  const [tags] = useState(DEMO_TAGS);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [user, setUser] = useState(null);
  const [selectedTag, setSelectedTag] = useState(null);
  const [testResults, setTestResults] = useState([]);
  
  const navigate = useNavigate();
  const location = useLocation();

  // Загрузка тестов и результатов из localStorage
  useEffect(() => {
    const savedTests = localStorage.getItem('quizTests');
    const savedResults = localStorage.getItem('quizResults');
    
    if (savedTests) {
      setTests(JSON.parse(savedTests));
    }
    if (savedResults) {
      setTestResults(JSON.parse(savedResults));
    }
  }, []);

  // Сохранение тестов в localStorage
  useEffect(() => {
    localStorage.setItem('quizTests', JSON.stringify(tests));
  }, [tests]);

  // Сохранение результатов в localStorage
  useEffect(() => {
    localStorage.setItem('quizResults', JSON.stringify(testResults));
  }, [testResults]);

  const handleRoleSelection = (role) => {
    if (role === 'admin') {
      navigate('/admin/login');
    } else {
      navigate('/user');
    }
  };

  const handleAdminLogin = (userData) => {
    setIsAuthenticated(true);
    setUser(userData);
    navigate('/admin');
  };

  const handleAdminLogout = () => {
    setIsAuthenticated(false);
    setUser(null);
    navigate('/');
  };

  const handleAddTest = (newTest) => {
    const testWithId = {
      ...newTest,
      id: Date.now(),
      question_count: newTest.questions.length,
      max_score: newTest.questions.reduce((sum, q) => sum + q.points, 0),
      is_published: true,
      created_by: user?.id || null,
      average_rating: 0,
      review_count: 0,
      reviews: []
    };
    setTests(prev => [...prev, testWithId]);
    navigate('/admin');
  };

  const handleUpdateTest = (updatedTest) => {
    setTests(prev => prev.map(test => 
      test.id === updatedTest.id ? {
        ...updatedTest,
        question_count: updatedTest.questions.length,
        max_score: updatedTest.questions.reduce((sum, q) => sum + q.points, 0)
      } : test
    ));
    navigate('/admin');
  };

  const handleDeleteTest = (testId) => {
    setTests(prev => prev.filter(test => test.id !== testId));
  };

  const handleAddReview = (testId, review) => {
    setTests(prev => prev.map(test => {
      if (test.id === testId) {
        const newReview = {
          ...review,
          id: Date.now(),
          user_name: 'Вы',
          created_at: new Date().toISOString(),
          is_approved: true
        };
        
        const updatedReviews = [...(test.reviews || []), newReview];
        const average_rating = updatedReviews.reduce((sum, r) => sum + r.rating, 0) / updatedReviews.length;
        
        return {
          ...test,
          reviews: updatedReviews,
          average_rating: parseFloat(average_rating.toFixed(1)),
          review_count: updatedReviews.length
        };
      }
      return test;
    }));
  };

  // Новая функция для сохранения результатов теста
  const handleSaveTestResult = (resultData) => {
    const newResult = {
      id: Date.now(),
      ...resultData,
      completedAt: new Date().toISOString()
    };
    
    console.log('Сохранение результата:', newResult);
    
    setTestResults(prev => [...prev, newResult]);
    
    // Переходим на страницу результатов
    navigate(`/results/${resultData.testId}`);
  };

  const handleTagFilter = (tag) => {
    setSelectedTag(selectedTag?.id === tag.id ? null : tag);
  };

  const filteredTests = selectedTag ? 
    tests.filter(test => test.tags?.some(tag => tag.id === selectedTag.id)) 
    : tests;

  return (
    <div className="App">
      <Routes>
        {/* Главная страница - выбор роли */}
        <Route path="/" element={<RoleSelection onRoleSelect={handleRoleSelection} />} />
        
        {/* Маршруты для студента */}
        <Route 
          path="/user" 
          element={
            <UserInterface 
              tests={filteredTests.filter(test => test.is_published)} 
              tags={tags}
              selectedTag={selectedTag}
              onTagFilter={handleTagFilter}
              onAddReview={handleAddReview}
              onBackToRoleSelection={() => navigate('/')}
            />
          } 
        />

        {/* Маршрут для прохождения теста */}
        <Route 
          path="/test/:id" 
          element={
            <Test 
              tests={tests} 
              onSaveResult={handleSaveTestResult}
            />
          } 
        />

        {/* Маршрут для просмотра результатов */}
        <Route 
          path="/results/:testId" 
          element={
            <Results 
              testResults={testResults}
              tests={tests}
            />
          } 
        />

        {/* Маршрут для отзывов */}
        <Route 
          path="/reviews/:testId" 
          element={
            <TestReviews 
              test={tests.find(t => t.id === parseInt(location.pathname.split('/').pop()))}
              onAddReview={handleAddReview}
              onBack={() => navigate(-1)}
            />
          } 
        />

        {/* Маршруты для администратора */}
        <Route 
          path="/admin/login" 
          element={
            <AdminLogin 
              onLogin={handleAdminLogin}
              onBack={() => navigate('/')}
            />
          } 
        />
        
        <Route 
          path="/admin" 
          element={
            isAuthenticated ? (
              <AdminPanel 
                tests={tests}
                tags={tags}
                onAddTest={handleAddTest}
                onUpdateTest={handleUpdateTest}
                onDeleteTest={handleDeleteTest}
                onLogout={handleAdminLogout}
                user={user}
              />
            ) : (
              <Navigate to="/admin/login" replace />
            )
          } 
        />

        {/* Маршрут для просмотра результатов администратором */}
        <Route 
          path="/admin/results" 
          element={
            isAuthenticated ? (
              <ResultsView 
                tests={tests}
                testResults={testResults}
                onBack={() => navigate('/admin')}
              />
            ) : (
              <Navigate to="/admin/login" replace />
            )
          } 
        />

        {/* Резервный маршрут */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </div>
  );
}

export default App;