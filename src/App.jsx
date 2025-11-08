import React, { useState, useEffect } from 'react';
import './App.css';

// Демо данные тестов
const DEMO_TESTS = [
  {
    id: 1,
    title: "Тест по JavaScript",
    description: "Проверьте свои знания JavaScript",
    question_count: 3,
    max_score: 6,
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
    question_count: 3,
    max_score: 6,
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
        question_text: "Как изменить цвет текста на красный в CSS?",
        options: ["text-color: red", "font-color: red", "color: red", "text: red"],
        correct_answer: 2,
        points: 2
      }
    ]
  },
  {
    id: 3,
    title: "Тест по Python",
    description: "Основы программирования на Python",
    question_count: 3,
    max_score: 6,
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

// Локальное хранилище для результатов
const saveResultsToLocalStorage = (results) => {
  localStorage.setItem('quizResults', JSON.stringify(results));
};

const getResultsFromLocalStorage = () => {
  const results = localStorage.getItem('quizResults');
  return results ? JSON.parse(results) : [];
};

function App() {
  const [currentScreen, setCurrentScreen] = useState('testList');
  const [tests] = useState(DEMO_TESTS);
  const [currentTest, setCurrentTest] = useState(null);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [userAnswers, setUserAnswers] = useState({});
  const [userName, setUserName] = useState('');
  const [showNameModal, setShowNameModal] = useState(false);
  const [results, setResults] = useState([]);
  const [showResults, setShowResults] = useState(false);

  // Загрузка результатов при старте
  useEffect(() => {
    const savedResults = getResultsFromLocalStorage();
    setResults(savedResults);
  }, []);

  // Сброс состояния теста
  const resetTest = () => {
    setCurrentTest(null);
    setCurrentQuestionIndex(0);
    setUserAnswers({});
    setUserName('');
    setShowNameModal(false);
    setCurrentScreen('testList');
    setShowResults(false);
  };

  // Начать тест
  const startTest = (test) => {
    setCurrentTest(test);
    setShowNameModal(true);
  };

  // Подтвердить имя и начать тест
  const confirmNameAndStart = () => {
    if (!userName.trim()) {
      alert('Пожалуйста, введите ваше имя');
      return;
    }
    setShowNameModal(false);
    setCurrentScreen('test');
  };

  // Выбрать ответ
  const selectAnswer = (questionId, answerIndex) => {
    setUserAnswers(prev => ({
      ...prev,
      [questionId]: answerIndex
    }));
  };

  // Следующий вопрос
  const nextQuestion = () => {
    if (currentQuestionIndex < currentTest.questions.length - 1) {
      setCurrentQuestionIndex(prev => prev + 1);
    }
  };

  // Предыдущий вопрос
  const prevQuestion = () => {
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex(prev => prev - 1);
    }
  };

  // Рассчитать результат
  const calculateScore = () => {
    let score = 0;
    currentTest.questions.forEach(question => {
      const userAnswer = userAnswers[question.id];
      if (userAnswer !== undefined && question.correct_answer === userAnswer) {
        score += question.points;
      }
    });
    return score;
  };

  // Завершить тест
  const finishTest = () => {
    const score = calculateScore();
    const maxScore = currentTest.max_score;
    
    // Сохраняем результат
    const newResult = {
      id: Date.now(),
      test_id: currentTest.id,
      test_title: currentTest.title,
      user_name: userName,
      score: score,
      max_score: maxScore,
      completed_at: new Date().toISOString()
    };

    const updatedResults = [...results, newResult];
    setResults(updatedResults);
    saveResultsToLocalStorage(updatedResults);
    
    setCurrentScreen('results');
  };

  // Показать историю результатов
  const showResultsHistory = () => {
    setShowResults(true);
  };

  // Получить цвет для результата
  const getScoreColor = (score, maxScore) => {
    const percentage = (score / maxScore) * 100;
    if (percentage >= 80) return 'high-score';
    if (percentage >= 60) return 'medium-score';
    return 'low-score';
  };

  // Рендер списка тестов
  const renderTestList = () => (
    <div className="test-list-container">
      <div className="header-section">
        <h1>Система тестирования</h1>
        <p>Проверьте свои знания с помощью наших тестов</p>
        <button 
          onClick={showResultsHistory}
          className="results-history-btn"
        >
          История результатов
        </button>
      </div>

      <div className="tests-grid">
        {tests.map((test) => (
          <div key={test.id} className="test-card">
            <div className="test-header">
              <h3>{test.title}</h3>
              <span className="test-badge">{test.question_count} вопросов</span>
            </div>
            <p className="test-description">{test.description}</p>
            <div className="test-info">
              <div className="info-item">
                <span className="info-label">Вопросов:</span>
                <span className="info-value">{test.question_count}</span>
              </div>
              <div className="info-item">
                <span className="info-label">Баллов:</span>
                <span className="info-value">{test.max_score}</span>
              </div>
            </div>
            <button
              onClick={() => startTest(test)}
              className="start-test-btn"
            >
              Начать тест
            </button>
          </div>
        ))}
      </div>
    </div>
  );

  // Рендер ввода имени
  const renderNameInput = () => (
    <div className="modal-overlay">
      <div className="modal">
        <h2>Введите ваше имя</h2>
        <input
          type="text"
          value={userName}
          onChange={(e) => setUserName(e.target.value)}
          placeholder="Ваше имя"
          className="name-input"
          onKeyPress={(e) => e.key === 'Enter' && confirmNameAndStart()}
        />
        <div className="modal-actions">
          <button onClick={() => setShowNameModal(false)} className="cancel-btn">
            Отмена
          </button>
          <button onClick={confirmNameAndStart} className="confirm-btn">
            Начать тест
          </button>
        </div>
      </div>
    </div>
  );

  // Рендер вопроса теста
  const renderTest = () => {
    if (!currentTest) return null;
    
    const question = currentTest.questions[currentQuestionIndex];
    const progress = ((currentQuestionIndex + 1) / currentTest.questions.length) * 100;
    const isLastQuestion = currentQuestionIndex === currentTest.questions.length - 1;

    return (
      <div className="test-container">
        <div className="test-header">
          <h2>{currentTest.title}</h2>
          <div className="progress-section">
            <div className="progress-info">
              <span>Вопрос {currentQuestionIndex + 1} из {currentTest.questions.length}</span>
              <span className="points">{question.points} баллов</span>
            </div>
            <div className="progress-bar">
              <div 
                className="progress-fill" 
                style={{ width: `${progress}%` }}
              ></div>
            </div>
          </div>
        </div>

        <div className="question-section">
          <h3 className="question-text">{question.question_text}</h3>
          
          <div className="answers-grid">
            {question.options.map((option, index) => (
              <button
                key={index}
                onClick={() => selectAnswer(question.id, index)}
                className={`answer-option ${
                  userAnswers[question.id] === index ? 'selected' : ''
                }`}
              >
                <span className="option-letter">
                  {String.fromCharCode(65 + index)}
                </span>
                <span className="option-text">{option}</span>
              </button>
            ))}
          </div>
        </div>

        <div className="navigation-section">
          <button
            onClick={prevQuestion}
            disabled={currentQuestionIndex === 0}
            className="nav-btn prev-btn"
          >
            ← Назад
          </button>

          {isLastQuestion ? (
            <button
              onClick={finishTest}
              className="nav-btn finish-btn"
            >
              Завершить тест ✓
            </button>
          ) : (
            <button
              onClick={nextQuestion}
              className="nav-btn next-btn"
            >
              Далее →
            </button>
          )}
        </div>
      </div>
    );
  };

  // Рендер результатов
  const renderResults = () => {
    if (!currentTest) return null;
    
    const score = calculateScore();
    const maxScore = currentTest.max_score;
    const percentage = Math.round((score / maxScore) * 100);
    const scoreClass = getScoreColor(score, maxScore);

    return (
      <div className="results-container">
        <div className="results-card">
          <div className="results-header">
            <h2>Тест завершен!</h2>
            <div className={`score-display ${scoreClass}`}>
              <span className="score-number">{score}/{maxScore}</span>
              <span className="score-percentage">{percentage}%</span>
            </div>
          </div>
          
          <div className="results-info">
            <p className="user-greeting">Поздравляем, <strong>{userName}</strong>!</p>
            <p className="test-completed">Вы завершили тест: <strong>{currentTest.title}</strong></p>
            
            <div className="performance">
              {percentage >= 80 && (
                <div className="performance-excellent">Отличный результат! 🎉</div>
              )}
              {percentage >= 60 && percentage < 80 && (
                <div className="performance-good">Хороший результат! 👍</div>
              )}
              {percentage < 60 && (
                <div className="performance-average">Попробуйте еще раз! 💪</div>
              )}
            </div>
          </div>

          <div className="results-actions">
            <button onClick={resetTest} className="action-btn primary">
              Пройти другой тест
            </button>
            <button onClick={showResultsHistory} className="action-btn secondary">
              Посмотреть историю
            </button>
          </div>
        </div>
      </div>
    );
  };

  // Рендер истории результатов
  const renderResultsHistory = () => (
    <div className="history-container">
      <div className="history-header">
        <h2>История результатов</h2>
        <button onClick={() => setShowResults(false)} className="back-btn">
          ← Назад к тестам
        </button>
      </div>

      {results.length === 0 ? (
        <div className="no-results">
          <p>Пока нет результатов тестирования</p>
          <p>Пройдите тест, чтобы увидеть здесь свои результаты!</p>
        </div>
      ) : (
        <div className="results-list">
          {results
            .slice()
            .reverse()
            .map((result, index) => (
            <div key={result.id} className="result-item">
              <div className="result-main">
                <div className="result-user">
                  <strong>{result.user_name}</strong>
                  <span className="result-test">{result.test_title}</span>
                </div>
                <div className={`result-score ${getScoreColor(result.score, result.max_score)}`}>
                  {result.score}/{result.max_score}
                </div>
              </div>
              <div className="result-date">
                {new Date(result.completed_at).toLocaleDateString('ru-RU', {
                  day: 'numeric',
                  month: 'long',
                  year: 'numeric',
                  hour: '2-digit',
                  minute: '2-digit'
                })}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );

  return (
    <div className="app">
      {showNameModal && renderNameInput()}
      
      {showResults ? renderResultsHistory() : (
        <>
          {currentScreen === 'testList' && renderTestList()}
          {currentScreen === 'test' && renderTest()}
          {currentScreen === 'results' && renderResults()}
        </>
      )}
    </div>
  );
}

export default App;