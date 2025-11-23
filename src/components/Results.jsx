import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';

const Results = ({ testResults, tests }) => {
  const { testId } = useParams();
  const navigate = useNavigate();

  // Находим последний результат для этого теста
  const result = testResults
    .filter(r => r.testId === parseInt(testId))
    .sort((a, b) => new Date(b.completedAt) - new Date(a.completedAt))[0];

  const test = tests.find(t => t.id === parseInt(testId));

  if (!result) {
    return (
      <div style={{
        minHeight: '100vh',
        background: 'linear-gradient(135deg, #f0f9ff 0%, #e0e7ff 100%)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '2rem'
      }}>
        <div style={{
          backgroundColor: 'white',
          borderRadius: '0.75rem',
          boxShadow: '0 10px 25px -5px rgba(0, 0, 0, 0.1)',
          padding: '2rem',
          textAlign: 'center',
          maxWidth: '400px',
          width: '100%'
        }}>
          <div style={{ fontSize: '4rem', marginBottom: '1rem' }}>❌</div>
          <h2 style={{
            fontSize: '1.5rem',
            fontWeight: 'bold',
            color: '#1f2937',
            marginBottom: '1rem'
          }}>Результат не найден</h2>
          <button
            onClick={() => navigate('/user')}
            style={{
              backgroundColor: '#2563eb',
              color: 'white',
              padding: '0.75rem 1.5rem',
              borderRadius: '0.5rem',
              border: 'none',
              cursor: 'pointer',
              fontSize: '1rem'
            }}
          >
            Вернуться к тестам
          </button>
        </div>
      </div>
    );
  }

  const getScoreColor = (percentage) => {
    if (percentage >= 80) return '#059669';
    if (percentage >= 60) return '#d97706';
    return '#dc2626';
  };

  const scoreColor = getScoreColor(result.percentage);

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
              {result.score} / {result.maxScore}
            </div>
            <p style={{
              fontSize: '1.125rem',
              color: '#6b7280',
              marginBottom: '0.5rem'
            }}>
              Поздравляем, {result.userName}!
            </p>
            <p style={{
              color: '#6b7280',
              marginBottom: '1.5rem'
            }}>
              Ваш результат: {result.percentage}%
            </p>
            <div style={{ marginTop: '1rem' }}>
              {result.percentage >= 80 && (
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
              {result.percentage >= 60 && result.percentage < 80 && (
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
              {result.percentage < 60 && (
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
              onClick={() => navigate('/user')}
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
            {test && (
              <button
                onClick={() => navigate(`/reviews/${test.id}`)}
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
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Results;