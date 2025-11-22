import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';

const Test = ({ tests }) => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [test, setTest] = useState(null);
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [answers, setAnswers] = useState({});
  const [userName, setUserName] = useState('');
  const [showNameModal, setShowNameModal] = useState(true);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Находим тест по ID из пропсов
    const foundTest = tests.find(t => t.id === parseInt(id));
    if (foundTest) {
      setTest(foundTest);
      setLoading(false);
    } else {
      setLoading(false);
    }
  }, [id, tests]);

  const handleAnswerSelect = (questionId, answerIndex) => {
    setAnswers(prev => ({
      ...prev,
      [questionId]: answerIndex
    }));
  };

  const handleNext = () => {
    if (currentQuestion < test.questions.length - 1) {
      setCurrentQuestion(prev => prev + 1);
    }
  };

  const handlePrev = () => {
    if (currentQuestion > 0) {
      setCurrentQuestion(prev => prev - 1);
    }
  };

  const calculateScore = () => {
    let score = 0;
    test.questions.forEach(question => {
      const userAnswer = answers[question.id];
      if (userAnswer !== undefined && question.correct_answer === userAnswer) {
        score += question.points;
      }
    });
    return score;
  };

  const handleSubmit = async () => {
    if (!userName.trim()) {
      alert('Пожалуйста, введите ваше имя');
      return;
    }

    const score = calculateScore();
    const maxScore = test.questions.reduce((sum, q) => sum + q.points, 0);

    try {
      // В демо-режиме просто сохраняем в localStorage
      const results = {
        test_id: test.id,
        test_title: test.title,
        user_name: userName,
        score,
        max_score: maxScore,
        completed_at: new Date().toISOString(),
        answers: Object.entries(answers).map(([questionId, answerIndex]) => ({
          question_id: questionId,
          answer_index: answerIndex
        }))
      };

      // Сохраняем результаты в localStorage
      const existingResults = JSON.parse(localStorage.getItem('quizResults') || '[]');
      localStorage.setItem('quizResults', JSON.stringify([...existingResults, results]));

      navigate(`/results/${test.id}`, {
        state: { 
          score, 
          maxScore, 
          userName,
          test 
        }
      });
    } catch (error) {
      console.error('Error saving results:', error);
      alert('Ошибка при сохранении результатов');
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (!test) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center">
        <div className="bg-white rounded-lg shadow-lg p-8 max-w-md text-center">
          <h2 className="text-2xl font-bold text-gray-800 mb-4">Тест не найден</h2>
          <p className="text-gray-600 mb-6">Запрошенный тест не существует или был удален.</p>
          <button 
            onClick={() => navigate('/user')}
            className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors"
          >
            Вернуться к тестам
          </button>
        </div>
      </div>
    );
  }

  if (showNameModal) {
    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
        <div className="bg-white rounded-lg p-6 max-w-md w-full">
          <h2 className="text-2xl font-bold mb-4 text-gray-800">Введите ваше имя</h2>
          <p className="text-gray-600 mb-4">Перед началом теста "{test.title}"</p>
          <input
            type="text"
            value={userName}
            onChange={(e) => setUserName(e.target.value)}
            placeholder="Ваше имя"
            className="w-full p-3 border border-gray-300 rounded-lg mb-4 focus:outline-none focus:ring-2 focus:ring-blue-500"
            onKeyPress={(e) => e.key === 'Enter' && userName.trim() && setShowNameModal(false)}
          />
          <div className="flex gap-3">
            <button
              onClick={() => navigate('/user')}
              className="flex-1 bg-gray-500 text-white py-3 rounded-lg hover:bg-gray-600 transition-colors"
            >
              Отмена
            </button>
            <button
              onClick={() => userName.trim() && setShowNameModal(false)}
              disabled={!userName.trim()}
              className="flex-1 bg-blue-600 text-white py-3 rounded-lg hover:bg-blue-700 transition-colors disabled:bg-gray-400 disabled:cursor-not-allowed"
            >
              Начать тест
            </button>
          </div>
        </div>
      </div>
    );
  }

  const question = test.questions[currentQuestion];
  const progress = ((currentQuestion + 1) / test.questions.length) * 100;
  const isLastQuestion = currentQuestion === test.questions.length - 1;

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 py-8">
      <div className="container mx-auto px-4">
        <div className="max-w-2xl mx-auto bg-white rounded-lg shadow-lg p-6">
          {/* Заголовок теста */}
          <div className="mb-6">
            <h1 className="text-2xl font-bold text-gray-800 mb-2">{test.title}</h1>
            <p className="text-gray-600">Участник: {userName}</p>
          </div>

          {/* Прогресс бар */}
          <div className="mb-6">
            <div className="flex justify-between items-center mb-2">
              <span className="text-sm text-gray-600">
                Вопрос {currentQuestion + 1} из {test.questions.length}
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
                  onClick={() => handleAnswerSelect(question.id, index)}
                  className={`w-full text-left p-4 rounded-lg border-2 transition-all duration-200 ${
                    answers[question.id] === index
                      ? 'border-blue-500 bg-blue-50 text-blue-700'
                      : 'border-gray-200 hover:border-gray-300 hover:bg-gray-50'
                  }`}
                >
                  <div className="flex items-center">
                    <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center mr-3 ${
                      answers[question.id] === index
                        ? 'border-blue-500 bg-blue-500'
                        : 'border-gray-300'
                    }`}>
                      {answers[question.id] === index && (
                        <div className="w-2 h-2 rounded-full bg-white"></div>
                      )}
                    </div>
                    <span>{option}</span>
                  </div>
                </button>
              ))}
            </div>
          </div>

          {/* Навигация */}
          <div className="flex justify-between pt-4 border-t">
            <button
              onClick={handlePrev}
              disabled={currentQuestion === 0}
              className="px-6 py-2 border border-gray-300 rounded-lg text-gray-600 disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50 transition-colors"
            >
              Назад
            </button>

            {isLastQuestion ? (
              <button
                onClick={handleSubmit}
                className="px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
              >
                Завершить тест
              </button>
            ) : (
              <button
                onClick={handleNext}
                className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              >
                Далее
              </button>
            )}
          </div>

          {/* Индикатор ответов */}
          <div className="mt-6">
            <p className="text-sm text-gray-600 mb-2">Прогресс ответов:</p>
            <div className="flex flex-wrap gap-2">
              {test.questions.map((q, index) => (
                <div
                  key={q.id}
                  className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${
                    answers[q.id] !== undefined
                      ? 'bg-green-500 text-white'
                      : index === currentQuestion
                      ? 'bg-blue-500 text-white'
                      : 'bg-gray-200 text-gray-600'
                  }`}
                >
                  {index + 1}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Test;