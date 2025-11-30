import React, { useState } from 'react';
import TestReviews from './TestReviews';

const UserInterface = ({ tests, tags, selectedTag, onTagFilter, onAddReview, onBackToRoleSelection }) => {
  const [currentScreen, setCurrentScreen] = useState('testList');
  const [currentTest, setCurrentTest] = useState(null);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [userAnswers, setUserAnswers] = useState({});
  const [userName, setUserName] = useState('');
  const [showNameModal, setShowNameModal] = useState(false);
  const [showReviews, setShowReviews] = useState(false);

  const resetTest = () => {
    setCurrentTest(null);
    setCurrentQuestionIndex(0);
    setUserAnswers({});
    setUserName('');
    setShowNameModal(false);
    setCurrentScreen('testList');
    setShowReviews(false);
  };

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

  // Функция для сохранения результатов теста
  const saveTestResult = (score, maxScore) => {
    const percentage = Math.round((score / maxScore) * 100);
    
    const resultData = {
      id: Date.now(),
      testId: currentTest.id,
      testTitle: currentTest.title,
      userName: userName,
      score: score,
      maxScore: maxScore,
      percentage: percentage,
      completedAt: new Date().toISOString(),
      answers: currentTest.questions.map(question => ({
        questionId: question.id,
        questionText: question.question_text,
        userAnswer: userAnswers[question.id],
        correctAnswer: question.correct_answer,
        isCorrect: userAnswers[question.id] === question.correct_answer,
        options: question.options
      }))
    };

    console.log('💾 Сохраняем результат теста:', resultData);

    // Сохраняем в localStorage
    const existingResults = JSON.parse(localStorage.getItem('quizResults') || '[]');
    const updatedResults = [...existingResults, resultData];
    localStorage.setItem('quizResults', JSON.stringify(updatedResults));

    console.log('✅ Результат сохранен в localStorage, всего результатов:', updatedResults.length);
    
    return resultData;
  };

  const finishTest = () => {
    const score = calculateScore();
    const maxScore = currentTest.max_score;
    
    // Сохраняем результат
    saveTestResult(score, maxScore);
    
    console.log('Результат теста:', { userName, score, maxScore, testId: currentTest.id });
    
    setCurrentScreen('results');
  };

  const getScoreColor = (score, maxScore) => {
    const percentage = (score / maxScore) * 100;
    if (percentage >= 80) return '#059669'; // green-600
    if (percentage >= 60) return '#d97706'; // yellow-600
    return '#dc2626'; // red-600
  };

  const renderNameInput = () => (
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
        padding: '1.5rem',
        maxWidth: '28rem',
        width: '100%'
      }}>
        <h2 style={{
          fontSize: '1.5rem',
          fontWeight: 'bold',
          marginBottom: '1rem',
          color: '#1f2937'
        }}>Введите ваше имя</h2>
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
            marginBottom: '1rem',
            fontSize: '1rem'
          }}
          onKeyPress={(e) => e.key === 'Enter' && confirmNameAndStart()}
        />
        <div style={{
          display: 'flex',
          gap: '0.75rem'
        }}>
          <button 
            onClick={() => setShowNameModal(false)} 
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
            onClick={confirmNameAndStart} 
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

  const renderTestList = () => (
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
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          marginBottom: '2rem'
        }}>
          <div>
            <h1 style={{
              fontSize: '2.25rem',
              fontWeight: 'bold',
              color: '#1f2937',
              marginBottom: '0.5rem'
            }}>
              Система тестирования
            </h1>
            <p style={{
              fontSize: '1.125rem',
              color: '#6b7280'
            }}>
              Выберите тест для прохождения
            </p>
          </div>
          <button
            onClick={onBackToRoleSelection}
            style={{
              backgroundColor: '#6b7280',
              color: 'white',
              padding: '0.75rem 1.5rem',
              borderRadius: '0.5rem',
              border: 'none',
              cursor: 'pointer',
              transition: 'background-color 0.2s'
            }}
            onMouseOver={(e) => e.target.style.backgroundColor = '#4b5563'}
            onMouseOut={(e) => e.target.style.backgroundColor = '#6b7280'}
          >
            Сменить роль
          </button>
        </div>

        {/* Фильтр по тегам */}
        <div style={{ marginBottom: '2rem' }}>
          <h3 style={{
            fontSize: '1.125rem',
            fontWeight: '600',
            color: '#1f2937',
            marginBottom: '1rem'
          }}>Фильтр по тегам:</h3>
          <div style={{
            display: 'flex',
            flexWrap: 'wrap',
            gap: '0.5rem'
          }}>
            <button
              onClick={() => onTagFilter(null)}
              style={{
                padding: '0.5rem 1rem',
                borderRadius: '9999px',
                fontSize: '0.875rem',
                fontWeight: '500',
                border: 'none',
                cursor: 'pointer',
                transition: 'all 0.2s',
                backgroundColor: !selectedTag ? '#2563eb' : '#e5e7eb',
                color: !selectedTag ? 'white' : '#374151'
              }}
              onMouseOver={(e) => {
                if (selectedTag) {
                  e.target.style.backgroundColor = '#d1d5db';
                }
              }}
              onMouseOut={(e) => {
                if (selectedTag) {
                  e.target.style.backgroundColor = '#e5e7eb';
                }
              }}
            >
              Все тесты
            </button>
            {tags.map(tag => (
              <button
                key={tag.id}
                onClick={() => onTagFilter(tag)}
                style={{
                  padding: '0.5rem 1rem',
                  borderRadius: '9999px',
                  fontSize: '0.875rem',
                  fontWeight: '500',
                  border: 'none',
                  cursor: 'pointer',
                  transition: 'all 0.2s',
                  backgroundColor: selectedTag?.id === tag.id ? tag.color : '#e5e7eb',
                  color: selectedTag?.id === tag.id ? 'white' : '#374151'
                }}
                onMouseOver={(e) => {
                  if (!selectedTag || selectedTag.id !== tag.id) {
                    e.target.style.backgroundColor = '#d1d5db';
                  }
                }}
                onMouseOut={(e) => {
                  if (!selectedTag || selectedTag.id !== tag.id) {
                    e.target.style.backgroundColor = '#e5e7eb';
                  }
                }}
              >
                {tag.name}
              </button>
            ))}
          </div>
          {selectedTag && (
            <div style={{
              marginTop: '0.75rem',
              fontSize: '0.875rem',
              color: '#6b7280'
            }}>
              Активный фильтр: <span style={{ color: selectedTag.color, fontWeight: '500' }}>{selectedTag.name}</span>
              <button 
                onClick={() => onTagFilter(null)}
                style={{
                  marginLeft: '0.5rem',
                  color: '#2563eb',
                  background: 'none',
                  border: 'none',
                  cursor: 'pointer'
                }}
                onMouseOver={(e) => e.target.style.color = '#1e40af'}
                onMouseOut={(e) => e.target.style.color = '#2563eb'}
              >
                × Сбросить
              </button>
            </div>
          )}
        </div>

        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))',
          gap: '1.5rem'
        }}>
          {tests.map((test) => (
            <div key={test.id} style={{
              backgroundColor: 'white',
              borderRadius: '0.75rem',
              boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)',
              padding: '1.5rem',
              transition: 'all 0.3s ease',
              cursor: 'pointer'
            }}
            onMouseOver={(e) => {
              e.currentTarget.style.transform = 'translateY(-4px)';
              e.currentTarget.style.boxShadow = '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)';
            }}
            onMouseOut={(e) => {
              e.currentTarget.style.transform = 'translateY(0)';
              e.currentTarget.style.boxShadow = '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)';
            }}
            >
              <div style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'flex-start',
                marginBottom: '0.75rem'
              }}>
                <h3 style={{
                  fontSize: '1.25rem',
                  fontWeight: '600',
                  color: '#1f2937',
                  flex: 1
                }}>
                  {test.title}
                </h3>
                {test.average_rating > 0 && (
                  <div style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.25rem',
                    backgroundColor: '#fefce8',
                    padding: '0.25rem 0.5rem',
                    borderRadius: '0.375rem'
                  }}>
                    <span style={{ color: '#d97706' }}>★</span>
                    <span style={{
                      fontSize: '0.875rem',
                      fontWeight: '500',
                      color: '#92400e'
                    }}>
                      {test.average_rating.toFixed(1)}
                    </span>
                    <span style={{
                      fontSize: '0.75rem',
                      color: '#92400e'
                    }}>({test.review_count})</span>
                  </div>
                )}
              </div>
              
              <p style={{
                color: '#6b7280',
                marginBottom: '1rem',
                display: '-webkit-box',
                WebkitLineClamp: 2,
                WebkitBoxOrient: 'vertical',
                overflow: 'hidden'
              }}>
                {test.description}
              </p>
              
              {/* Теги теста */}
              {test.tags && test.tags.length > 0 && (
                <div style={{
                  display: 'flex',
                  flexWrap: 'wrap',
                  gap: '0.25rem',
                  marginBottom: '1rem'
                }}>
                  {test.tags.map(tag => (
                    <span
                      key={tag.id}
                      style={{
                        padding: '0.25rem 0.5rem',
                        borderRadius: '9999px',
                        fontSize: '0.75rem',
                        fontWeight: '500',
                        color: 'white',
                        backgroundColor: tag.color
                      }}
                    >
                      {tag.name}
                    </span>
                  ))}
                </div>
              )}
              
              <div style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                marginBottom: '1rem'
              }}>
                <span style={{
                  fontSize: '0.875rem',
                  color: '#6b7280'
                }}>
                  Вопросов: {test.question_count}
                </span>
                <span style={{
                  fontSize: '0.875rem',
                  color: '#6b7280'
                }}>
                  Баллов: {test.max_score}
                </span>
              </div>
              
              <div style={{
                display: 'flex',
                gap: '0.5rem'
              }}>
                <button
                  onClick={() => startTest(test)}
                  style={{
                    flex: 1,
                    backgroundColor: '#2563eb',
                    color: 'white',
                    textAlign: 'center',
                    padding: '0.5rem 1rem',
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
                <button
                  onClick={() => {
                    setCurrentTest(test);
                    setShowReviews(true);
                  }}
                  style={{
                    backgroundColor: '#6b7280',
                    color: 'white',
                    padding: '0.5rem',
                    borderRadius: '0.5rem',
                    border: 'none',
                    cursor: 'pointer',
                    transition: 'background-color 0.2s'
                  }}
                  onMouseOver={(e) => e.target.style.backgroundColor = '#4b5563'}
                  onMouseOut={(e) => e.target.style.backgroundColor = '#6b7280'}
                  title="Посмотреть отзывы"
                >
                  💬
                </button>
              </div>
            </div>
          ))}
        </div>

        {tests.length === 0 && (
          <div style={{
            textAlign: 'center',
            padding: '3rem 0'
          }}>
            <p style={{
              color: '#6b7280',
              fontSize: '1.125rem',
              marginBottom: '0.5rem'
            }}>Нет доступных тестов</p>
            <p style={{
              color: '#9ca3af'
            }}>Попробуйте выбрать другой фильтр</p>
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
            {/* Прогресс бар */}
            <div style={{ marginBottom: '1.5rem' }}>
              <div style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                marginBottom: '0.5rem'
              }}>
                <span style={{
                  fontSize: '0.875rem',
                  color: '#6b7280'
                }}>
                  Вопрос {currentQuestionIndex + 1} из {currentTest.questions.length}
                </span>
                <span style={{
                  fontSize: '0.875rem',
                  fontWeight: '600',
                  color: '#2563eb'
                }}>
                  {question.points} баллов
                </span>
              </div>
              <div style={{
                width: '100%',
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

            {/* Вопрос */}
            <div style={{ marginBottom: '1.5rem' }}>
              <h2 style={{
                fontSize: '1.25rem',
                fontWeight: '600',
                color: '#1f2937',
                marginBottom: '1rem'
              }}>
                {question.question_text}
              </h2>
              
              {/* Варианты ответов */}
              <div style={{
                display: 'flex',
                flexDirection: 'column',
                gap: '0.75rem'
              }}>
                {question.options.map((option, index) => (
                  <button
                    key={index}
                    onClick={() => selectAnswer(question.id, index)}
                    style={{
                      width: '100%',
                      textAlign: 'left',
                      padding: '1rem',
                      borderRadius: '0.5rem',
                      border: '2px solid',
                      borderColor: userAnswers[question.id] === index ? '#3b82f6' : '#e5e7eb',
                      backgroundColor: userAnswers[question.id] === index ? '#dbeafe' : 'white',
                      color: userAnswers[question.id] === index ? '#1e40af' : '#374151',
                      cursor: 'pointer',
                      transition: 'all 0.2s ease'
                    }}
                    onMouseOver={(e) => {
                      if (userAnswers[question.id] !== index) {
                        e.target.style.borderColor = '#d1d5db';
                        e.target.style.backgroundColor = '#f9fafb';
                      }
                    }}
                    onMouseOut={(e) => {
                      if (userAnswers[question.id] !== index) {
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
              justifyContent: 'space-between'
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
                  style={{
                    padding: '0.5rem 1.5rem',
                    backgroundColor: '#059669',
                    color: 'white',
                    borderRadius: '0.5rem',
                    border: 'none',
                    cursor: 'pointer',
                    transition: 'background-color 0.2s'
                  }}
                  onMouseOver={(e) => e.target.style.backgroundColor = '#047857'}
                  onMouseOut={(e) => e.target.style.backgroundColor = '#059669'}
                >
                  Завершить тест
                </button>
              ) : (
                <button
                  onClick={nextQuestion}
                  style={{
                    padding: '0.5rem 1.5rem',
                    backgroundColor: '#2563eb',
                    color: 'white',
                    borderRadius: '0.5rem',
                    border: 'none',
                    cursor: 'pointer',
                    transition: 'background-color 0.2s'
                  }}
                  onMouseOver={(e) => e.target.style.backgroundColor = '#1d4ed8'}
                  onMouseOut={(e) => e.target.style.backgroundColor = '#2563eb'}
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
    const maxScore = currentTest.max_score;
    const percentage = Math.round((score / maxScore) * 100);
    const scoreColor = getScoreColor(score, maxScore);

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
            margin: '0 auto'
          }}>
            <div style={{
              backgroundColor: 'white',
              borderRadius: '0.75rem',
              boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)',
              padding: '2rem',
              marginBottom: '2rem',
              textAlign: 'center'
            }}>
              <h2 style={{
                fontSize: '1.875rem',
                fontWeight: 'bold',
                color: '#1f2937',
                marginBottom: '1rem'
              }}>
                Тест завершен!
              </h2>
              <div style={{
                fontSize: '3rem',
                fontWeight: 'bold',
                marginBottom: '1rem',
                color: scoreColor
              }}>
                {score} / {maxScore}
              </div>
              <p style={{
                fontSize: '1.125rem',
                color: '#6b7280',
                marginBottom: '0.5rem'
              }}>
                Поздравляем, {userName}!
              </p>
              <p style={{
                color: '#6b7280'
              }}>
                Ваш результат: {percentage}%
              </p>
              <div style={{ marginTop: '1rem' }}>
                {percentage >= 80 && (
                  <span style={{
                    backgroundColor: '#d1fae5',
                    color: '#065f46',
                    padding: '0.5rem 1rem',
                    borderRadius: '9999px',
                    fontSize: '0.875rem',
                    fontWeight: '600'
                  }}>
                    Отличный результат! 🎉
                  </span>
                )}
                {percentage >= 60 && percentage < 80 && (
                  <span style={{
                    backgroundColor: '#fef3c7',
                    color: '#92400e',
                    padding: '0.5rem 1rem',
                    borderRadius: '9999px',
                    fontSize: '0.875rem',
                    fontWeight: '600'
                  }}>
                    Хороший результат! 👍
                  </span>
                )}
                {percentage < 60 && (
                  <span style={{
                    backgroundColor: '#fee2e2',
                    color: '#991b1b',
                    padding: '0.5rem 1rem',
                    borderRadius: '9999px',
                    fontSize: '0.875rem',
                    fontWeight: '600'
                  }}>
                    Попробуйте еще раз! 💪
                  </span>
                )}
              </div>
            </div>

            <div style={{
              textAlign: 'center',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              gap: '1rem'
            }}>
              <button
                onClick={resetTest}
                style={{
                  backgroundColor: '#2563eb',
                  color: 'white',
                  padding: '0.75rem 2rem',
                  borderRadius: '0.5rem',
                  border: 'none',
                  cursor: 'pointer',
                  transition: 'background-color 0.2s'
                }}
                onMouseOver={(e) => e.target.style.backgroundColor = '#1d4ed8'}
                onMouseOut={(e) => e.target.style.backgroundColor = '#2563eb'}
              >
                Пройти другой тест
              </button>
              <button
                onClick={() => {
                  setShowReviews(true);
                  setCurrentScreen('testList');
                }}
                style={{
                  backgroundColor: '#7c3aed',
                  color: 'white',
                  padding: '0.75rem 2rem',
                  borderRadius: '0.5rem',
                  border: 'none',
                  cursor: 'pointer',
                  transition: 'background-color 0.2s'
                }}
                onMouseOver={(e) => e.target.style.backgroundColor = '#6d28d9'}
                onMouseOut={(e) => e.target.style.backgroundColor = '#7c3aed'}
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
