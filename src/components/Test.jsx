import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';

const Test = ({ tests, onSaveResult }) => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [userAnswers, setUserAnswers] = useState({});
  const [userName, setUserName] = useState('');
  const [showNameModal, setShowNameModal] = useState(true);
  const [testStarted, setTestStarted] = useState(false);

  const test = tests.find(t => t.id === parseInt(id));

  useEffect(() => {
    if (!test) {
      navigate('/user');
    }
  }, [test, navigate]);

  if (!test) {
    return null;
  }

  const startTest = () => {
    if (!userName.trim()) {
      alert('Пожалуйста, введите ваше имя');
      return;
    }
    setShowNameModal(false);
    setTestStarted(true);
  };

  const selectAnswer = (questionId, answerIndex) => {
    setUserAnswers(prev => ({
      ...prev,
      [questionId]: answerIndex
    }));
  };

  const nextQuestion = () => {
    if (currentQuestionIndex < test.questions.length - 1) {
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
    test.questions.forEach(question => {
      const userAnswer = userAnswers[question.id];
      if (userAnswer !== undefined && question.correct_answer === userAnswer) {
        score += question.points;
      }
    });
    return score;
  };

  const finishTest = () => {
  const score = calculateScore();
  const maxScore = test.max_score;
  const percentage = Math.round((score / maxScore) * 100);

  console.log('🎯 Завершение теста:', {
    testId: test.id,
    testTitle: test.title,
    userName: userName,
    score: score,
    maxScore: maxScore,
    percentage: percentage
  });

  // Сохраняем результат
  const resultData = {
    testId: test.id,
    testTitle: test.title,
    userName: userName,
    score: score,
    maxScore: maxScore,
    percentage: percentage,
    answers: test.questions.map(question => ({
      questionId: question.id,
      questionText: question.question_text,
      userAnswer: userAnswers[question.id],
      correctAnswer: question.correct_answer,
      isCorrect: userAnswers[question.id] === question.correct_answer,
      options: question.options
    }))
  };

  console.log('📤 Отправляем данные в onSaveResult:', resultData);
  
  // Вызываем функцию сохранения
  onSaveResult(resultData);
};

  const currentQuestion = test.questions[currentQuestionIndex];
  const progress = ((currentQuestionIndex + 1) / test.questions.length) * 100;
  const isLastQuestion = currentQuestionIndex === test.questions.length - 1;

  if (showNameModal) {
    return (
      <div style={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '1rem',
        zIndex: 50
      }}>
        <div style={{
          backgroundColor: 'white',
          borderRadius: '0.75rem',
          padding: '2rem',
          maxWidth: '28rem',
          width: '100%'
        }}>
          <h2 style={{
            fontSize: '1.5rem',
            fontWeight: 'bold',
            marginBottom: '1rem',
            color: '#1f2937'
          }}>Введите ваше имя</h2>
          <p style={{
            color: '#6b7280',
            marginBottom: '1.5rem'
          }}>Перед началом теста "{test.title}" введите ваше имя</p>
          <input
            type="text"
            value={userName}
            onChange={(e) => setUserName(e.target.value)}
            placeholder="Ваше имя"
            style={{
              width: '100%',
              padding: '0.75rem',
              border: '1px solid #d1d5db',
              borderRadius: '0.5rem',
              marginBottom: '1.5rem',
              fontSize: '1rem'
            }}
            onKeyPress={(e) => e.key === 'Enter' && startTest()}
          />
          <div style={{
            display: 'flex',
            gap: '0.75rem'
          }}>
            <button 
              onClick={() => navigate('/user')}
              style={{
                flex: 1,
                backgroundColor: '#6b7280',
                color: 'white',
                padding: '0.75rem',
                borderRadius: '0.5rem',
                border: 'none',
                cursor: 'pointer',
                transition: 'background-color 0.2s'
              }}
              onMouseOver={(e) => e.target.style.backgroundColor = '#4b5563'}
              onMouseOut={(e) => e.target.style.backgroundColor = '#6b7280'}
            >
              Отмена
            </button>
            <button 
              onClick={startTest}
              style={{
                flex: 1,
                backgroundColor: '#2563eb',
                color: 'white',
                padding: '0.75rem',
                borderRadius: '0.5rem',
                border: 'none',
                cursor: 'pointer',
                transition: 'background-color 0.2s'
              }}
              onMouseOver={(e) => e.target.style.backgroundColor = '#1d4ed8'}
              onMouseOut={(e) => e.target.style.backgroundColor = '#2563eb'}
            >
              Начать тест
            </button>
          </div>
        </div>
      </div>
    );
  }

  if (!testStarted) {
    return null;
  }

  return (
    <div style={{
      minHeight: '100vh',
      background: 'linear-gradient(135deg, #f0f9ff 0%, #e0e7ff 100%)',
      padding: '2rem 0'
    }}>
      <div style={{
        maxWidth: '1200px',
        margin: '0 auto',
        padding: '0 1rem'
      }}>
        <div style={{
          maxWidth: '42rem',
          margin: '0 auto',
          backgroundColor: 'white',
          borderRadius: '0.75rem',
          boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)',
          padding: '1.5rem'
        }}>
          {/* Заголовок и прогресс */}
          <div style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            marginBottom: '1.5rem'
          }}>
            <div>
              <h1 style={{
                fontSize: '1.5rem',
                fontWeight: 'bold',
                color: '#1f2937',
                marginBottom: '0.25rem'
              }}>{test.title}</h1>
              <p style={{
                color: '#6b7280',
                fontSize: '0.875rem'
              }}>Студент: {userName}</p>
            </div>
            <div style={{
              textAlign: 'right'
            }}>
              <div style={{
                fontSize: '0.875rem',
                color: '#6b7280',
                marginBottom: '0.25rem'
              }}>
                Вопрос {currentQuestionIndex + 1} из {test.questions.length}
              </div>
              <div style={{
                width: '120px',
                backgroundColor: '#e5e7eb',
                borderRadius: '9999px',
                height: '0.5rem'
              }}>
                <div
                  style={{
                    backgroundColor: '#2563eb',
                    height: '0.5rem',
                    borderRadius: '9999px',
                    transition: 'width 0.3s ease',
                    width: `${progress}%`
                  }}
                ></div>
              </div>
            </div>
          </div>

          {/* Вопрос */}
          <div style={{ marginBottom: '1.5rem' }}>
            <h2 style={{
              fontSize: '1.25rem',
              fontWeight: '600',
              color: '#1f2937',
              marginBottom: '1rem'
            }}>
              {currentQuestion.question_text}
            </h2>
            
            {/* Варианты ответов */}
            <div style={{
              display: 'flex',
              flexDirection: 'column',
              gap: '0.75rem'
            }}>
              {currentQuestion.options.map((option, index) => (
                <button
                  key={index}
                  onClick={() => selectAnswer(currentQuestion.id, index)}
                  style={{
                    width: '100%',
                    textAlign: 'left',
                    padding: '1rem',
                    borderRadius: '0.5rem',
                    border: '2px solid',
                    borderColor: userAnswers[currentQuestion.id] === index ? '#3b82f6' : '#e5e7eb',
                    backgroundColor: userAnswers[currentQuestion.id] === index ? '#dbeafe' : 'white',
                    color: userAnswers[currentQuestion.id] === index ? '#1e40af' : '#374151',
                    cursor: 'pointer',
                    transition: 'all 0.2s ease'
                  }}
                  onMouseOver={(e) => {
                    if (userAnswers[currentQuestion.id] !== index) {
                      e.target.style.borderColor = '#d1d5db';
                      e.target.style.backgroundColor = '#f9fafb';
                    }
                  }}
                  onMouseOut={(e) => {
                    if (userAnswers[currentQuestion.id] !== index) {
                      e.target.style.borderColor = '#e5e7eb';
                      e.target.style.backgroundColor = 'white';
                    }
                  }}
                >
                  {option}
                </button>
              ))}
            </div>
          </div>

          {/* Навигация */}
          <div style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center'
          }}>
            <button
              onClick={prevQuestion}
              disabled={currentQuestionIndex === 0}
              style={{
                padding: '0.5rem 1.5rem',
                border: '1px solid #d1d5db',
                borderRadius: '0.5rem',
                color: '#6b7280',
                backgroundColor: 'white',
                cursor: currentQuestionIndex === 0 ? 'not-allowed' : 'pointer',
                opacity: currentQuestionIndex === 0 ? 0.5 : 1,
                transition: 'all 0.2s'
              }}
              onMouseOver={(e) => {
                if (currentQuestionIndex !== 0) {
                  e.target.style.backgroundColor = '#f9fafb';
                }
              }}
              onMouseOut={(e) => {
                if (currentQuestionIndex !== 0) {
                  e.target.style.backgroundColor = 'white';
                }
              }}
            >
              Назад
            </button>

            {isLastQuestion ? (
              <button
                onClick={finishTest}
                disabled={userAnswers[currentQuestion.id] === undefined}
                style={{
                  padding: '0.5rem 1.5rem',
                  backgroundColor: userAnswers[currentQuestion.id] === undefined ? '#9ca3af' : '#059669',
                  color: 'white',
                  borderRadius: '0.5rem',
                  border: 'none',
                  cursor: userAnswers[currentQuestion.id] === undefined ? 'not-allowed' : 'pointer',
                  transition: 'background-color 0.2s'
                }}
                onMouseOver={(e) => {
                  if (userAnswers[currentQuestion.id] !== undefined) {
                    e.target.style.backgroundColor = '#047857';
                  }
                }}
                onMouseOut={(e) => {
                  if (userAnswers[currentQuestion.id] !== undefined) {
                    e.target.style.backgroundColor = '#059669';
                  }
                }}
              >
                Завершить тест
              </button>
            ) : (
              <button
                onClick={nextQuestion}
                disabled={userAnswers[currentQuestion.id] === undefined}
                style={{
                  padding: '0.5rem 1.5rem',
                  backgroundColor: userAnswers[currentQuestion.id] === undefined ? '#9ca3af' : '#2563eb',
                  color: 'white',
                  borderRadius: '0.5rem',
                  border: 'none',
                  cursor: userAnswers[currentQuestion.id] === undefined ? 'not-allowed' : 'pointer',
                  transition: 'background-color 0.2s'
                }}
                onMouseOver={(e) => {
                  if (userAnswers[currentQuestion.id] !== undefined) {
                    e.target.style.backgroundColor = '#1d4ed8';
                  }
                }}
                onMouseOut={(e) => {
                  if (userAnswers[currentQuestion.id] !== undefined) {
                    e.target.style.backgroundColor = '#2563eb';
                  }
                }}
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

export default Test;