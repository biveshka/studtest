import React, { useState, useEffect } from 'react';

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
    if (percentage >= 80) return 'text-green-600';
    if (percentage >= 60) return 'text-yellow-600';
    return 'text-red-600';
  };

  // Рендер списка тестов
  const renderTestList = () => (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 py-8">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-800 mb-4">
            Система тестирования
          </h1>
          <p className="text-lg text-gray-600 mb-6">
            Проверьте свои знания с помощью наших тестов
          </p>
          <button 
            onClick={showResultsHistory}
            className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors"
          >
            История результатов
          </button>
        </div>

        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3 max-w-6xl mx-auto">
          {tests.map((test) => (
            <div key={test.id} className="bg-white rounded-lg shadow-lg p-6 hover:shadow-xl transition-shadow duration-300">
              <div className="flex justify-between items-start mb-4">
                <h3 className="text-xl font-semibold text-gray-800">{test.title}</h3>
                <span className="bg-blue-100 text-blue-800 text-sm px-3 py-1 rounded-full">
                  {test.question_count} вопросов
                </span>
              </div>
              <p className="text-gray-600 mb-4 line-clamp-2">
                {test.description}
              </p>
              <div className="flex justify-between items-center mb-6">
                <div className="text-center">
                  <div className="text-sm text-gray-500">Вопросов</div>
                  <div className="font-semibold text-gray-800">{test.question_count}</div>
                </div>
                <div className="text-center">
                  <div className="text-sm text-gray-500">Баллов</div>
                  <div className="font-semibold text-gray-800">{test.max_score}</div>
                </div>
              </div>
              <button
                onClick={() => startTest(test)}
                className="w-full bg-blue-600 text-white py-3 px-4 rounded-lg hover:bg-blue-700 transition-colors duration-200 font-semibold"
              >
                Начать тест
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );

  // Рендер ввода имени
  const renderNameInput = () => (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-lg p-6 max-w-md w-full">
        <h2 className="text-2xl font-bold mb-4 text-gray-800">Введите ваше имя</h2>
        <input
          type="text"
          value={userName}
          onChange={(e) => setUserName(e.target.value)}
          placeholder="Ваше имя"
          className="w-full p-3 border border-gray-300 rounded-lg mb-4 focus:outline-none focus:ring-2 focus:ring-blue-500"
          onKeyPress={(e) => e.key === 'Enter' && confirmNameAndStart()}
        />
        <div className="flex gap-3">
          <button 
            onClick={() => setShowNameModal(false)} 
            className="flex-1 bg-gray-500 text-white py-3 rounded-lg hover:bg-gray-600 transition-colors"
          >
            Отмена
          </button>
          <button 
            onClick={confirmNameAndStart} 
            className="flex-1 bg-blue-600 text-white py-3 rounded-lg hover:bg-blue-700 transition-colors"
          >
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
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 py-8">
        <div className="container mx-auto px-4">
          <div className="max-w-2xl mx-auto bg-white rounded-lg shadow-lg p-6">
            {/* Прогресс бар */}
            <div className="mb-6">
              <div className="flex justify-between items-center mb-2">
                <span className="text-sm text-gray-600">
                  Вопрос {currentQuestionIndex + 1} из {currentTest.questions.length}
                </span>
                <span className="text-sm font-semibold text-blue-600">
                  {question.points} баллов
                </span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div
                  className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                  style={{ width: `${progress}%` }}
                ></div>
              </div>
            </div>

            {/* Вопрос */}
            <div className="mb-6">
              <h2 className="text-xl font-semibold text-gray-800 mb-4">
                {question.question_text}
              </h2>
              
              {/* Варианты ответов */}
              <div className="space-y-3">
                {question.options.map((option, index) => (
                  <button
                    key={index}
                    onClick={() => selectAnswer(question.id, index)}
                    className={`w-full text-left p-4 rounded-lg border-2 transition-all duration-200 ${
                      userAnswers[question.id] === index
                        ? 'border-blue-500 bg-blue-50 text-blue-700'
                        : 'border-gray-200 hover:border-gray-300 hover:bg-gray-50'
                    }`}
                  >
                    {option}
                  </button>
                ))}
              </div>
            </div>

            {/* Навигация */}
            <div className="flex justify-between">
              <button
                onClick={prevQuestion}
                disabled={currentQuestionIndex === 0}
                className="px-6 py-2 border border-gray-300 rounded-lg text-gray-600 disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50 transition-colors"
              >
                Назад
              </button>

              {isLastQuestion ? (
                <button
                  onClick={finishTest}
                  className="px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
                >
                  Завершить тест
                </button>
              ) : (
                <button
                  onClick={nextQuestion}
                  className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                >
                  Далее
                </button>
              )}
            </div>
          </div>
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
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 py-8">
        <div className="container mx-auto px-4">
          <div className="max-w-2xl mx-auto">
            <div className="bg-white rounded-lg shadow-lg p-8 mb-8 text-center">
              <h2 className="text-3xl font-bold text-gray-800 mb-4">
                Тест завершен!
              </h2>
              <div className={`text-5xl font-bold mb-4 ${scoreClass}`}>
                {score} / {maxScore}
              </div>
              <p className="text-lg text-gray-600 mb-2">
                Поздравляем, {userName}!
              </p>
              <p className="text-gray-500">
                Ваш результат: {percentage}%
              </p>
              <div className="mt-4">
                {percentage >= 80 && (
                  <span className="bg-green-100 text-green-800 px-4 py-2 rounded-full text-sm font-semibold">
                    Отличный результат! 🎉
                  </span>
                )}
                {percentage >= 60 && percentage < 80 && (
                  <span className="bg-yellow-100 text-yellow-800 px-4 py-2 rounded-full text-sm font-semibold">
                    Хороший результат! 👍
                  </span>
                )}
                {percentage < 60 && (
                  <span className="bg-red-100 text-red-800 px-4 py-2 rounded-full text-sm font-semibold">
                    Попробуйте еще раз! 💪
                  </span>
                )}
              </div>
            </div>

            <div className="text-center space-y-4">
              <button
                onClick={resetTest}
                className="bg-blue-600 text-white py-3 px-8 rounded-lg hover:bg-blue-700 transition-colors mr-4"
              >
                Пройти другой тест
              </button>
              <button
                onClick={showResultsHistory}
                className="bg-gray-600 text-white py-3 px-8 rounded-lg hover:bg-gray-700 transition-colors"
              >
                Посмотреть историю
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  };

  // Рендер истории результатов
  const renderResultsHistory = () => (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 py-8">
      <div className="container mx-auto px-4">
        <div className="max-w-4xl mx-auto bg-white rounded-lg shadow-lg p-6">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-bold text-gray-800">История результатов</h2>
            <button 
              onClick={() => setShowResults(false)}
              className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors"
            >
              ← Назад к тестам
            </button>
          </div>

          {results.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-gray-500 text-lg mb-2">Пока нет результатов тестирования</p>
              <p className="text-gray-400">Пройдите тест, чтобы увидеть здесь свои результаты!</p>
            </div>
          ) : (
            <div className="space-y-4">
              {results
                .slice()
                .reverse()
                .map((result) => (
                <div key={result.id} className="border border-gray-200 rounded-lg p-4 hover:bg-gray-50 transition-colors">
                  <div className="flex justify-between items-center mb-2">
                    <div>
                      <span className="font-semibold text-gray-800">{result.user_name}</span>
                      <span className="text-gray-500 text-sm ml-2">• {result.test_title}</span>
                    </div>
                    <div className={`font-bold ${getScoreColor(result.score, result.max_score)}`}>
                      {result.score} / {result.max_score}
                    </div>
                  </div>
                  <div className="text-gray-500 text-sm">
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
      </div>
    </div>
  );

  return (
    <div>
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