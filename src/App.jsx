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
    question_count: 5,
    max_score: 10,
    is_published: true,
    created_by: null,
    average_rating: 4.6,
    review_count: 5,
    tags: [
      { id: 1, name: 'JavaScript', color: '#F7DF1E' },
      { id: 3, name: 'React', color: '#61DAFB' }
    ],
    reviews: [
      {
        id: 1,
        user_name: "Филиппов Александр",
        rating: 5,
        comment: "Отличный тест! Очень полезные вопросы по JavaScript и React. Особенно понравились вопросы про замыкания и useState.",
        created_at: "2025-11-12T10:30:00Z",
        is_approved: true
      },
      {
        id: 2,
        user_name: "Загидуллин Дамир",
        rating: 4,
        comment: "Хороший тест, но можно добавить больше практических заданий. Вопросы про методы массива были полезными.",
        created_at: "2025-11-14T15:20:00Z",
        is_approved: true
      },
      {
        id: 3,
        user_name: "Илькаев Наиль",
        rating: 5,
        comment: "Лучший тест по JavaScript что я проходил! Вопросы охватывают все основные темы. Особенно понравился вопрос про typeof null.",
        created_at: "2025-11-18T11:45:00Z",
        is_approved: true
      },
      {
        id: 4,
        user_name: "Сидоров Даниил",
        rating: 4,
        comment: "Хороший баланс теории и практики. Вопрос про React.createElement был неожиданным, но полезным.",
        created_at: "2025-11-20T09:15:00Z",
        is_approved: true
      },
      {
        id: 5,
        user_name: "Стуков Артем",
        rating: 5,
        comment: "Идеальный тест для подготовки к собеседованию на фронтенд-разработчика. Рекомендую всем!",
        created_at: "2025-11-22T16:40:00Z",
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
      },
      {
        id: 104,
        question_text: "Какой метод массива НЕ изменяет исходный массив?",
        options: ["push()", "pop()", "splice()", "concat()"],
        correct_answer: 3,
        points: 2
      },
      {
        id: 105,
        question_text: "Что выведет следующий код? console.log(typeof null);",
        options: ['"object"', '"null"', '"undefined"', '"number"'],
        correct_answer: 0,
        points: 2
      }
    ]
  },
  {
    id: 2,
    title: "Тест по HTML/CSS",
    description: "Основы веб-разработки",
    question_count: 6,
    max_score: 10,
    is_published: true,
    created_by: null,
    average_rating: 4.3,
    review_count: 8,
    tags: [
      { id: 2, name: 'HTML/CSS', color: '#E34F26' }
    ],
    reviews: [
      {
        id: 6,
        user_name: "Загидуллин Дамир",
        rating: 4,
        comment: "Хороший базовый тест по HTML/CSS. Вопрос про специфичность селекторов был очень полезным.",
        created_at: "2025-11-13T14:10:00Z",
        is_approved: true
      },
      {
        id: 7,
        user_name: "Илькаев Наиль",
        rating: 5,
        comment: "Отличный тест! Особенно понравились вопросы про семантическую верстку и булевые атрибуты.",
        created_at: "2025-11-15T16:30:00Z",
        is_approved: true
      },
      {
        id: 8,
        user_name: "Сидоров Даниил",
        rating: 4,
        comment: "Понятные вопросы, хорошая структура теста. Можно добавить больше вопросов про Flexbox и Grid.",
        created_at: "2025-11-17T11:20:00Z",
        is_approved: true
      },
      {
        id: 9,
        user_name: "Филиппов Александр",
        rating: 5,
        comment: "Идеальный тест для начинающих верстальщиков. Все основные темы охвачены.",
        created_at: "2025-11-19T09:15:00Z",
        is_approved: true
      },
      {
        id: 10,
        user_name: "Стуков Артем",
        rating: 4,
        comment: "Хороший тест, но некоторые вопросы могли бы быть сложнее. В целом полезно для повторения основ.",
        created_at: "2025-11-21T13:45:00Z",
        is_approved: true
      },
      {
        id: 11,
        user_name: "Илькаев Наиль",
        rating: 4,
        comment: "Прошел тест второй раз для закрепления. Вопрос про position: absolute запомнился хорошо.",
        created_at: "2025-11-23T10:05:00Z",
        is_approved: true
      },
      {
        id: 12,
        user_name: "Сидоров Даниил",
        rating: 5,
        comment: "После этого теста лучше понимаю разницу между <main> и <article>. Спасибо!",
        created_at: "2025-11-24T15:50:00Z",
        is_approved: true
      },
      {
        id: 13,
        user_name: "Загидуллин Дамир",
        rating: 4,
        comment: "Хорошо структурированный тест. Рекомендую новичкам в веб-разработке.",
        created_at: "2025-11-25T12:30:00Z",
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
      },
      {
        id: 203,
        question_text: "Какой CSS-селектор имеет наивысшую специфичность (приоритет) для элемента <p class=\"text\" id=\"main-text\">?",
        options: ["p", ".text", "p.text", "#main-text"],
        correct_answer: 3,
        points: 2
      },
      {
        id: 204,
        question_text: "Что произойдет, если для элемента задать position: absolute; без указания свойств top, left, right или bottom?",
        options: [
          "Он останется на том же месте, как будто у него position: static;.",
          "Он будет удален из потока документа и помещен в левый верхний угол ближайшего расположенного предка.",
          "Он останется в потоке документа на своем обычном месте.",
          "Он будет помещен в левый верхний угол окна браузера (viewport)."
        ],
        correct_answer: 0,
        points: 2
      },
      {
        id: 205,
        question_text: "Какой HTML-тег следует использовать для семантического обозначения основной, уникальной части содержимого страницы (например, статьи или блога)?",
        options: ["<section>", "<main>", "<div>", "<article>"],
        correct_answer: 1,
        points: 1
      },
      {
        id: 206,
        question_text: "Какой из следующих атрибутов тега <input> является булевым (не требует значения)?",
        options: ["type", "placeholder", "required", "value"],
        correct_answer: 2,
        points: 1
      }
    ]
  },
  {
    id: 3,
    title: "Тест по Python",
    description: "Основы программирования на Python",
    question_count: 3,
    max_score: 6,
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
        id: 14,
        user_name: "Филиппов Александр",
        rating: 5,
        comment: "Отличный тест для начинающих изучать Python! Вопросы охватывают самые основы языка.",
        created_at: "2025-11-12T08:20:00Z",
        is_approved: true
      },
      {
        id: 15,
        user_name: "Илькаев Наиль",
        rating: 5,
        comment: "Простой и понятный тест. Идеально для тех, кто только начинает путь в программировании.",
        created_at: "2025-11-13T16:45:00Z",
        is_approved: true
      },
      {
        id: 16,
        user_name: "Сидоров Даниил",
        rating: 4,
        comment: "Хороший базовый тест, но хотелось бы больше вопросов про функции и их параметры.",
        created_at: "2025-11-14T11:30:00Z",
        is_approved: true
      },
      {
        id: 17,
        user_name: "Загидуллин Дамир",
        rating: 5,
        comment: "После этого теста стало понятно, как создавать списки и функции в Python. Спасибо!",
        created_at: "2025-11-15T14:15:00Z",
        is_approved: true
      },
      {
        id: 18,
        user_name: "Стуков Артем",
        rating: 5,
        comment: "Лучший тест для повторения основ Python. Особенно полезен перед собеседованием.",
        created_at: "2025-11-16T09:40:00Z",
        is_approved: true
      },
      {
        id: 19,
        user_name: "Филиппов Александр",
        rating: 4,
        comment: "Хороший тест, но оператор возведения в степень можно было объяснить подробнее.",
        created_at: "2025-11-17T13:25:00Z",
        is_approved: true
      },
      {
        id: 20,
        user_name: "Илькаев Наиль",
        rating: 5,
        comment: "Прошел тест третий раз - всегда полезно освежить знания по основам Python.",
        created_at: "2025-11-18T17:50:00Z",
        is_approved: true
      },
      {
        id: 21,
        user_name: "Сидоров Даниил",
        rating: 5,
        comment: "Тест помог понять разницу между разными способами создания функций. Спасибо!",
        created_at: "2025-11-19T10:05:00Z",
        is_approved: true
      },
      {
        id: 22,
        user_name: "Загидуллин Дамир",
        rating: 4,
        comment: "Полезный тест, но можно добавить вопросы про циклы и условные операторы.",
        created_at: "2025-11-20T15:20:00Z",
        is_approved: true
      },
      {
        id: 23,
        user_name: "Стуков Артем",
        rating: 5,
        comment: "Идеально для быстрой проверки знаний основ Python. Рекомендую всем начинающим.",
        created_at: "2025-11-21T12:10:00Z",
        is_approved: true
      },
      {
        id: 24,
        user_name: "Филиппов Александр",
        rating: 5,
        comment: "После этого теста решил углубиться в изучение Python. Отличный старт!",
        created_at: "2025-11-22T14:35:00Z",
        is_approved: true
      },
      {
        id: 25,
        user_name: "Илькаев Наиль",
        rating: 4,
        comment: "Хороший тест, но три вопроса - это маловато. Хотелось бы больше практики.",
        created_at: "2025-11-23T16:55:00Z",
        is_approved: true
      },
      {
        id: 26,
        user_name: "Сидоров Даниил",
        rating: 5,
        comment: "Тест помог подготовиться к экзамену по основам программирования. Спасибо!",
        created_at: "2025-11-24T11:40:00Z",
        is_approved: true
      },
      {
        id: 27,
        user_name: "Загидуллин Дамир",
        rating: 5,
        comment: "Лучший тест по Python для новичков! Все четко и по делу.",
        created_at: "2025-11-25T10:15:00Z",
        is_approved: true
      },
      {
        id: 28,
        user_name: "Стуков Артем",
        rating: 4,
        comment: "Хороший тест, но можно добавить вопросы про импорты и модули.",
        created_at: "2025-11-25T14:45:00Z",
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

            
        </div>
    </div>
  );
};

// Функция для нормализации результатов
const normalizeResults = (results) => {
  if (!results) return [];
  
  return results.map(result => ({
    id: result.id,
    testId: result.test_id || result.testId,
    testTitle: result.test_title || result.testTitle,
    userName: result.user_name || result.userName,
    score: result.score || 0,
    maxScore: result.max_score || result.maxScore || 1,
    percentage: result.percentage || ((result.max_score || result.maxScore || 1) > 0 ? 
      Math.round(((result.score || 0) / (result.max_score || result.maxScore || 1)) * 100) : 0),
    completedAt: result.completed_at || result.completedAt
  }));
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
      try {
        const parsedTests = JSON.parse(savedTests);
        if (parsedTests && parsedTests.length > 0) {
          setTests(parsedTests);
        }
      } catch (error) {
        console.error('Ошибка загрузки тестов:', error);
      }
    }
    
    if (savedResults) {
      try {
        const results = normalizeResults(JSON.parse(savedResults));
        if (results && results.length > 0) {
          setTestResults(results);
          console.log('✅ Загружено результатов из localStorage:', results.length);
        }
      } catch (error) {
        console.error('Ошибка загрузки результатов:', error);
      }
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

  // Функция для обновления результатов
  const updateTestResults = () => {
    const savedResults = localStorage.getItem('quizResults');
    if (savedResults) {
      try {
        const results = normalizeResults(JSON.parse(savedResults));
        setTestResults(results);
        console.log('🔄 Обновлены результаты:', results.length);
        return results;
      } catch (error) {
        console.error('Ошибка обновления результатов:', error);
      }
    }
    return testResults;
  };

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

  // Функция для сохранения результатов теста
  const handleSaveTestResult = (resultData) => {
    console.log('📝 Получены данные для сохранения:', resultData);
    
    const maxScore = resultData.maxScore || resultData.max_score || 1;
    const score = resultData.score || 0;
    const percentage = resultData.percentage || Math.round((score / maxScore) * 100);
    
    const newResult = {
      id: Date.now(),
      testId: resultData.testId,
      testTitle: resultData.testTitle,
      userName: resultData.userName,
      score: score,
      maxScore: maxScore,
      percentage: percentage,
      completedAt: new Date().toISOString(),
      answers: resultData.answers || []
    };
    
    console.log('💾 Сохраняем результат:', newResult);
    
    // Используем функциональное обновление для гарантии актуальных данных
    setTestResults(prev => {
      // Проверяем, нет ли уже такого результата (по id или по комбинации testId + userName + completedAt)
      const existingIndex = prev.findIndex(r => 
        r.id === newResult.id || 
        (r.testId === newResult.testId && 
         r.userName === newResult.userName && 
         Math.abs(new Date(r.completedAt).getTime() - new Date(newResult.completedAt).getTime()) < 1000)
      );
      
      let updatedResults;
      if (existingIndex >= 0) {
        // Если результат уже есть, обновляем его
        updatedResults = [...prev];
        updatedResults[existingIndex] = newResult;
      } else {
        // Если результата нет, добавляем новый
        updatedResults = [...prev, newResult];
      }
      
      console.log('✅ Все результаты после сохранения:', updatedResults);
      
      // Сохраняем в localStorage сразу
      localStorage.setItem('quizResults', JSON.stringify(updatedResults));
      
      return updatedResults;
    });
    
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
              onAddReview={(review) => handleAddReview(parseInt(location.pathname.split('/').pop()), review)}
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
                testResults={testResults}
                onUpdateResults={updateTestResults}
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
                key="admin-results"
                testResults={testResults}
                tests={tests}
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