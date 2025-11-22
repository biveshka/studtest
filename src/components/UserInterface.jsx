import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { resultsAPI } from '../services/api';

const UserInterface = ({ tests, onBackToRoleSelection, loading }) => {
  const navigate = useNavigate();
  const [currentScreen, setCurrentScreen] = useState('testList');
  const [currentTest, setCurrentTest] = useState(null);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [userAnswers, setUserAnswers] = useState({});
  const [userName, setUserName] = useState('');
  const [showNameModal, setShowNameModal] = useState(false);
  const [saving, setSaving] = useState(false);
  const [selectedTag, setSelectedTag] = useState(null);

  // Получаем уникальные теги из всех тестов
  const allTags = [];
  tests.forEach(test => {
    if (test.tags) {
      test.tags.forEach(tag => {
        if (!allTags.some(t => t.id === tag.id)) {
          allTags.push(tag);
        }
      });
    }
  });

  // Фильтруем тесты по выбранному тегу
  const filteredTests = selectedTag 
    ? tests.filter(test => test.tags?.some(tag => tag.id === selectedTag.id))
    : tests;

  const startTest = (test) => {
    setCurrentTest(test);
    setShowNameModal(true);
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
      if (userAnswer !== undefined && question.correct_answer === userAnswer) {
        score += question.points;
      }
    });
    return score;
  };

  const finishTest = async () => {
    try {
      setSaving(true);
      const score = calculateScore();
      const maxScore = currentTest.max_score;
      
      // Сохраняем результат в Supabase
      await resultsAPI.saveResult({
        test_id: currentTest.id,
        user_name: userName,
        score: score,
        max_score: maxScore,
        answers: Object.entries(userAnswers).map(([questionId, answerIndex]) => ({
          question_id: questionId,
          answer_index: answerIndex
        }))
      });

      // Переходим на страницу результатов
      navigate(`/results/${currentTest.id}`, {
        state: { 
          score, 
          maxScore, 
          userName,
          testTitle: currentTest.title
        }
      });
    } catch (error) {
      console.error('Error saving result:', error);
      alert('Ошибка сохранения результата: ' + error.message);
    } finally {
      setSaving(false);
    }
  };

  const resetTest = () => {
    setCurrentTest(null);
    setCurrentQuestionIndex(0);
    setUserAnswers({});
    setUserName('');
    setCurrentScreen('testList');
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
        {allTags.length > 0 && (
          <div className="mb-8">
            <h3 className="text-lg font-semibold text-gray-800 mb-4">Фильтр по тегам:</h3>
            <div className="flex flex-wrap gap-2">
              <button
                onClick={() => setSelectedTag(null)}
                className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
                  !selectedTag 
                    ? 'bg-blue-600 text-white' 
                    : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                }`}
              >
                Все тесты
              </button>
              {allTags.map(tag => (
                <button
                  key={tag.id}
                  onClick={() => setSelectedTag(tag)}
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
                  onClick={() => setSelectedTag(null)}
                  className="ml-2 text-blue-600 hover:text-blue-800"
                >
                  × Сбросить
                </button>
              </div>
            )}
          </div>
        )}

        {loading ? (
          <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
          </div>
        ) : (
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {filteredTests.map((test) => (
              <div key={test.id} className="bg-white rounded-lg shadow-lg p-6 hover:shadow-xl transition-shadow duration-300">
                <div className="flex justify-between items-start mb-3">
                  <h3 className="text-xl font-semibold text-gray-800 flex-1">
                    {test.title}
                  </h3>
                  {test.average_rating > 0 && (
                    <div className="flex items-center gap-1 bg-yellow-50 px-2 py-1 rounded">
                      <span className="text-yellow-600">★</span>
                      <span className="text-sm font-medium text-yellow-700">
                        {test.average_rating?.toFixed(1) || '0.0'}
                      </span>
                      <span className="text-xs text-yellow-600">({test.review_count || 0})</span>
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
                    Вопросов: {test.question_count || 0}
                  </span>
                  <span className="text-sm text-gray-500">
                    Баллов: {test.max_score || 0}
                  </span>
                </div>
                
                <button
                  onClick={() => startTest(test)}
                  className="w-full bg-blue-600 text-white text-center py-2 px-4 rounded-lg hover:bg-blue-700 transition-colors duration-200"
                >
                  Начать тест
                </button>
              </div>
            ))}
          </div>
        )}

        {filteredTests.length === 0 && !loading && (
          <div className="text-center py-12">
            <p className="text-gray-500 text-lg">Нет доступных тестов</p>
            <p className="text-gray-400">Попробуйте выбрать другой фильтр</p>
          </div>
        )}
      </div>
    </div>
  );

  const renderTest = () => {
    if (!currentTest || !currentTest.questions) return null;
    
    const question = currentTest.questions[currentQuestionIndex];
    const progress = ((currentQuestionIndex + 1) / currentTest.questions.length) * 100;
    const isLastQuestion = currentQuestionIndex === currentTest.questions.length - 1;

    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 py-8">
        <div className="container mx-auto px-4">
          <div className="max-w-2xl mx-auto bg-white rounded-lg shadow-lg p-6">
            {/* Заголовок и кнопка назад */}
            <div className="flex justify-between items-center mb-6">
              <h1 className="text-2xl font-bold text-gray-800">{currentTest.title}</h1>
              <button
                onClick={() => {
                  if (window.confirm('Вы уверены, что хотите прервать тест? Ваши ответы не сохранятся.')) {
                    resetTest();
                  }
                }}
                className="bg-gray-500 text-white px-4 py-2 rounded-lg hover:bg-gray-600 transition-colors"
              >
                Прервать тест
              </button>
            </div>

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
                {question.options && question.options.map((option, index) => (
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
                  disabled={saving}
                  className="px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors disabled:opacity-50"
                >
                  {saving ? 'Сохранение...' : 'Завершить тест'}
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

  return (
    <div>
      {showNameModal && renderNameInput()}
      {currentScreen === 'testList' && renderTestList()}
      {currentScreen === 'test' && renderTest()}
    </div>
  );
};

export default UserInterface;