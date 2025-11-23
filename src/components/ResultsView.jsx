import React, { useState } from 'react';

const ResultsView = ({ tests, testResults, onBack }) => {
  const [selectedTest, setSelectedTest] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');

  const filteredResults = selectedTest 
    ? testResults.filter(result => result.testId === selectedTest.id)
    : testResults;

  const searchedResults = searchTerm
    ? filteredResults.filter(result => 
        result.userName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        result.testTitle.toLowerCase().includes(searchTerm.toLowerCase())
      )
    : filteredResults;

  const getScoreColor = (percentage) => {
    if (percentage >= 80) return '#059669';
    if (percentage >= 60) return '#d97706';
    return '#dc2626';
  };

  const getTestStats = (testId) => {
    const testResults = testResults.filter(result => result.testId === testId);
    if (testResults.length === 0) return null;

    const avgScore = testResults.reduce((sum, result) => sum + result.percentage, 0) / testResults.length;
    const bestResult = Math.max(...testResults.map(result => result.percentage));
    const worstResult = Math.min(...testResults.map(result => result.percentage));

    return {
      totalAttempts: testResults.length,
      averageScore: avgScore,
      bestScore: bestResult,
      worstScore: worstResult
    };
  };

  const renderResultsList = () => (
    <div style={{
      display: 'flex',
      flexDirection: 'column',
      gap: '1.5rem'
    }}>
      {/* Фильтры и поиск */}
      <div style={{
        display: 'flex',
        gap: '1rem',
        alignItems: 'center',
        flexWrap: 'wrap'
      }}>
        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: '0.5rem'
        }}>
          <span style={{
            fontSize: '0.875rem',
            fontWeight: '500',
            color: '#374151'
          }}>Фильтр по тесту:</span>
          <select
            value={selectedTest?.id || ''}
            onChange={(e) => setSelectedTest(tests.find(t => t.id === parseInt(e.target.value)) || null)}
            style={{
              padding: '0.5rem',
              border: '1px solid #d1d5db',
              borderRadius: '0.375rem',
              fontSize: '0.875rem'
            }}
          >
            <option value="">Все тесты</option>
            {tests.map(test => (
              <option key={test.id} value={test.id}>
                {test.title}
              </option>
            ))}
          </select>
        </div>

        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: '0.5rem'
        }}>
          <span style={{
            fontSize: '0.875rem',
            fontWeight: '500',
            color: '#374151'
          }}>Поиск:</span>
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Поиск по имени или тесту..."
            style={{
              padding: '0.5rem',
              border: '1px solid #d1d5db',
              borderRadius: '0.375rem',
              fontSize: '0.875rem',
              minWidth: '200px'
            }}
          />
        </div>
      </div>

      {/* Статистика */}
      {selectedTest && (() => {
        const stats = getTestStats(selectedTest.id);
        return stats ? (
          <div style={{
            backgroundColor: 'white',
            borderRadius: '0.75rem',
            boxShadow: '0 1px 3px 0 rgba(0, 0, 0, 0.1), 0 1px 2px 0 rgba(0, 0, 0, 0.06)',
            border: '1px solid #e5e7eb',
            padding: '1.5rem'
          }}>
            <h3 style={{
              fontSize: '1.125rem',
              fontWeight: '600',
              color: '#1f2937',
              marginBottom: '1rem'
            }}>Статистика теста: {selectedTest.title}</h3>
            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))',
              gap: '1rem'
            }}>
              <div style={{ textAlign: 'center' }}>
                <div style={{
                  fontSize: '1.5rem',
                  fontWeight: 'bold',
                  color: '#2563eb'
                }}>{stats.totalAttempts}</div>
                <div style={{
                  fontSize: '0.875rem',
                  color: '#6b7280'
                }}>Всего попыток</div>
              </div>
              <div style={{ textAlign: 'center' }}>
                <div style={{
                  fontSize: '1.5rem',
                  fontWeight: 'bold',
                  color: '#059669'
                }}>{stats.averageScore.toFixed(1)}%</div>
                <div style={{
                  fontSize: '0.875rem',
                  color: '#6b7280'
                }}>Средний результат</div>
              </div>
              <div style={{ textAlign: 'center' }}>
                <div style={{
                  fontSize: '1.5rem',
                  fontWeight: 'bold',
                  color: '#d97706'
                }}>{stats.bestScore}%</div>
                <div style={{
                  fontSize: '0.875rem',
                  color: '#6b7280'
                }}>Лучший результат</div>
              </div>
              <div style={{ textAlign: 'center' }}>
                <div style={{
                  fontSize: '1.5rem',
                  fontWeight: 'bold',
                  color: '#dc2626'
                }}>{stats.worstScore}%</div>
                <div style={{
                  fontSize: '0.875rem',
                  color: '#6b7280'
                }}>Худший результат</div>
              </div>
            </div>
          </div>
        ) : null;
      })()}

      {/* Список результатов */}
      <div style={{
        backgroundColor: 'white',
        borderRadius: '0.75rem',
        boxShadow: '0 1px 3px 0 rgba(0, 0, 0, 0.1), 0 1px 2px 0 rgba(0, 0, 0, 0.06)',
        border: '1px solid #e5e7eb'
      }}>
        <div style={{
          padding: '1.5rem',
          borderBottom: '1px solid #e5e7eb'
        }}>
          <h3 style={{
            fontSize: '1.25rem',
            fontWeight: '600',
            color: '#1f2937'
          }}>
            Результаты тестирования ({searchedResults.length})
          </h3>
        </div>

        <div style={{
          display: 'flex',
          flexDirection: 'column'
        }}>
          {searchedResults.length > 0 ? (
            searchedResults.map(result => (
              <div key={result.id} style={{
                padding: '1.5rem',
                borderBottom: '1px solid #f3f4f6',
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                transition: 'background-color 0.2s'
              }}
              onMouseOver={(e) => e.currentTarget.style.backgroundColor = '#f9fafb'}
              onMouseOut={(e) => e.currentTarget.style.backgroundColor = 'white'}
              >
                <div style={{ flex: 1 }}>
                  <div style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'flex-start',
                    marginBottom: '0.5rem'
                  }}>
                    <div>
                      <h4 style={{
                        fontWeight: '600',
                        color: '#1f2937',
                        fontSize: '1.125rem'
                      }}>{result.userName}</h4>
                      <p style={{
                        color: '#6b7280',
                        fontSize: '0.875rem'
                      }}>{result.testTitle}</p>
                    </div>
                    <div style={{
                      textAlign: 'right'
                    }}>
                      <div style={{
                        fontSize: '1.5rem',
                        fontWeight: 'bold',
                        color: getScoreColor(result.percentage)
                      }}>
                        {result.score}/{result.maxScore}
                      </div>
                      <div style={{
                        fontSize: '0.875rem',
                        color: '#6b7280'
                      }}>
                        {result.percentage}%
                      </div>
                    </div>
                  </div>
                  
                  <div style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center'
                  }}>
                    <span style={{
                      fontSize: '0.875rem',
                      color: '#6b7280'
                    }}>
                      Завершено: {new Date(result.completedAt).toLocaleDateString('ru-RU', {
                        year: 'numeric',
                        month: 'long',
                        day: 'numeric',
                        hour: '2-digit',
                        minute: '2-digit'
                      })}
                    </span>
                  </div>
                </div>
              </div>
            ))
          ) : (
            <div style={{
              padding: '3rem 2rem',
              textAlign: 'center',
              color: '#6b7280'
            }}>
              <div style={{
                fontSize: '3rem',
                marginBottom: '1rem'
              }}>📊</div>
              <p style={{
                fontSize: '1.125rem',
                marginBottom: '0.5rem'
              }}>Результаты не найдены</p>
              <p style={{
                fontSize: '0.875rem'
              }}>{testResults.length === 0 ? 'Пока нет пройденных тестов' : 'Попробуйте изменить параметры поиска'}</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );

  return (
    <div style={{
      minHeight: '100vh',
      backgroundColor: '#f9fafb',
      padding: '2rem 0'
    }}>
      <div style={{
        maxWidth: '80rem',
        margin: '0 auto',
        padding: '0 1rem'
      }}>
        {/* Заголовок */}
        <div style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          marginBottom: '2rem'
        }}>
          <div>
            <button
              onClick={onBack}
              style={{
                display: 'flex',
                alignItems: 'center',
                color: '#6b7280',
                background: 'none',
                border: 'none',
                cursor: 'pointer',
                marginBottom: '0.5rem',
                fontSize: '0.875rem'
              }}
              onMouseOver={(e) => e.target.style.color = '#374151'}
              onMouseOut={(e) => e.target.style.color = '#6b7280'}
            >
              ← Назад к панели
            </button>
            <h1 style={{
              fontSize: '2rem',
              fontWeight: 'bold',
              color: '#1f2937'
            }}>Результаты тестирования</h1>
            <p style={{
              color: '#6b7280',
              marginTop: '0.5rem'
            }}>
              Просмотр результатов прохождения тестов пользователями
            </p>
          </div>
        </div>

        {renderResultsList()}
      </div>
    </div>
  );
};

export default ResultsView;