import React, { useState } from 'react';
import TestReviews from './TestReviews';

const API_BASE_URL = 'http://localhost:5000/api';

const UserInterface = ({ tests, tags, selectedTag, onTagFilter, onAddReview, onBackToRoleSelection }) => {
  const [currentScreen, setCurrentScreen] = useState('testList');
  const [currentTest, setCurrentTest] = useState(null);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [userAnswers, setUserAnswers] = useState({});
  const [userName, setUserName] = useState('');
  const [showNameModal, setShowNameModal] = useState(false);
  const [showReviews, setShowReviews] = useState(false);
  const [testStartTime, setTestStartTime] = useState(null);

  const resetTest = () => {
    setCurrentTest(null);
    setCurrentQuestionIndex(0);
    setUserAnswers({});
    setUserName('');
    setShowNameModal(false);
    setCurrentScreen('testList');
    setShowReviews(false);
    setTestStartTime(null);
  };

  const startTest = (test) => {
    setCurrentTest(test);
    setShowNameModal(true);
    setTestStartTime(Date.now());
  };

  const confirmNameAndStart = () => {
    if (!userName.trim()) {
      alert('Пожалуйста, введите ваше имя');
      return;
    }
    setShowNameModal(false);
    setCurrentScreen('test');
  };

  const selectAnswer = (questionId, answerIndex) => {
    setUserAnswers(prev => ({
      ...prev,
      [questionId]: answerIndex
    }));
  };

  const nextQuestion = () => {
    if (currentQuestionIndex < currentTest.questions.length - 1) {
      setCurrentQuestionIndex(prev => prev + 1);
    }
  };

  const prevQuestion = () => {
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex(prev => prev - 1);
    }
  };

  const calculateScore = () => {
    let score = 0;
    currentTest.questions.forEach(question => {
      const userAnswer = userAnswers[question.id];
      if (userAnswer !== undefined && parseInt(question.correct_answer) === userAnswer) {
        score += question.points || 1;
      }
    });
    return score;
  };

  const finishTest = async () => {
    const score = calculateScore();
    const total_questions = currentTest.questions.length;
    const percentage = Math.round((score / total_questions) * 100);
    
    try {
      // Сохраняем результат в базу данных
      const response = await fetch(`${API_BASE_URL}/results`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          test_id: currentTest.id,
          user_name: userName,
          answers: userAnswers,
          score: score,
          total_questions: total_questions,
          percentage: percentage
        })
      });

      const result = await response.json();
      
      if (result.success) {
        console.log('✅ Результат сохранен в базе:', result.data);
      } else {
        console.error('❌ Ошибка сохранения:', result.error);
      }
    } catch (error) {
      console.error('❌ Ошибка при сохранении результата:', error);
    }
    
    setCurrentScreen('results');
  };

  const getScoreColor = (score, maxScore) => {
    const percentage = (score / maxScore) * 100;
    if (percentage >= 80) return 'text-green-600';
    if (percentage >= 60) return 'text-yellow-600';
    return 'text-red-600';
  };

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

  const renderTestList = () => (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 py-8">
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-4xl font-bold text-gray-800 mb-2">
              Система тестирования
            </h1>
            <p className="text-lg text-gray-600">
              Выберите тест для прохождения
            </p>
          </div>
          <button
            onClick={onBackToRoleSelection}
            className="bg-gray-500 text-white px-6 py-3 rounded-lg hover:bg-gray-600 transition-colors"
          >
            Сменить роль
          </button>
        </div>

        {/* Фильтр по тегам */}
        <div className="mb-8">
          <h3 className="text-lg font-semibold text-gray-800 mb-4">Фильтр по тегам:</h3>
          <div className="flex flex-wrap gap-2">
            <button
              onClick={() => onTagFilter(null)}
              className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
                !selectedTag 
                  ? 'bg-blue-600 text-white' 
                  : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
              }`}
            >
              Все тесты
            </button>
            {tags.map(tag => (
              <button
                key={tag.id}
                onClick={() => onTagFilter(tag)}
                className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
                  selectedTag?.id === tag.id
                    ? 'text-white'
                    : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                }`}
                style={{
                  backgroundColor: selectedTag?.id === tag.id ? tag.color : undefined
                }}
              >
                {tag.name}
              </button>
            ))}
          </div>
          {selectedTag && (
            <div className="mt-3 text-sm text-gray-600">
              Активный фильтр: <span style={{ color: selectedTag.color }}>{selectedTag.name}</span>
              <button 
                onClick={() => onTagFilter(null)}
                className="ml-2 text-blue-600 hover:text-blue-800"
              >
                × Сбросить
              </button>
            </div>
          )}
        </div>

        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {tests.map((test) => (
            <div key={test.id} className="bg-white rounded-lg shadow-lg p-6 hover:shadow-xl transition-shadow duration-300">
              <div className="flex justify-between items-start mb-3">
                <h3 className="text-xl font-semibold text-gray-800 flex-1">
                  {test.title}
                </h3>
                {test.average_rating > 0 && (
                  <div className="flex items-center gap-1 bg-yellow-50 px-2 py-1 rounded">
                    <span className="text-yellow-600">★</span>
                    <span className="text-sm font-medium text-yellow-700">
                      {test.average_rating.toFixed(1)}
                    </span>
                    <span className="text-xs text-yellow-600">({test.review_count})</span>
                  </div>
                )}
              </div>
              
              <p className="text-gray-600 mb-4 line-clamp-2">
                {test.description}
              </p>
              
              {/* Теги теста */}
              {test.tags && test.tags.length > 0 && (
                <div className="flex flex-wrap gap-1 mb-4">
                  {test.tags.map(tag => (
                    <span
                      key={tag.id}
                      className="px-2 py-1 rounded-full text-xs font-medium text-white"
                      style={{ backgroundColor: tag.color }}
                    >
                      {tag.name}
                    </span>
                  ))}
                </div>
              )}
              
              <div className="flex justify-between items-center mb-4">
                <span className="text-sm text-gray-500">
                  Вопросов: {test.question_count}
                </span>
                <span className="text-sm text-gray-500">
                  Баллов: {test.total_points}
                </span>
              </div>
              
              <div className="flex gap-2">
                <button
                  onClick={() => startTest(test)}
                  className="flex-1 bg-blue-600 text-white text-center py-2 px-4 rounded-lg hover:bg-blue-700 transition-colors duration-200"
                >
                  Начать тест
                </button>
                <button
                  onClick={() => {
                    setCurrentTest(test);
                    setShowReviews(true);
                  }}
                  className="bg-gray-500 text-white px-3 py-2 rounded-lg hover:bg-gray-600 transition-colors"
                  title="Посмотреть отзывы"
                >
                  💬
                </button>
              </div>
            </div>
          ))}
        </div>

        {tests.length === 0 && (
          <div className="text-center py-12">
            <p className="text-gray-500 text-lg">Нет доступных тестов</p>
            <p className="text-gray-400">Попробуйте выбрать другой фильтр</p>
          </div>
        )}
      </div>
    </div>
  );

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
                  {question.points || 1} баллов
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

  const renderResults = () => {
    if (!currentTest) return null;
    
    const score = calculateScore();
    const maxScore = currentTest.total_points;
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
                onClick={() => {
                  setShowReviews(true);
                  setCurrentScreen('testList');
                }}
                className="bg-purple-600 text-white py-3 px-8 rounded-lg hover:bg-purple-700 transition-colors"
              >
                Оставить отзыв
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  };

  if (showReviews && currentTest) {
    return (
      <TestReviews
        test={currentTest}
        onAddReview={(review) => {
          onAddReview(currentTest.id, review);
          setShowReviews(false);
        }}
        onBack={() => setShowReviews(false)}
      />
    );
  }

  return (
    <div>
      {showNameModal && renderNameInput()}
      {currentScreen === 'testList' && renderTestList()}
      {currentScreen === 'test' && renderTest()}
      {currentScreen === 'results' && renderResults()}
    </div>
  );
};

export default UserInterface;