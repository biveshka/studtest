import React, { useState, useEffect } from 'react';

const ResultsView = ({ onBack }) => {
  const [selectedTest, setSelectedTest] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [tests, setTests] = useState([]);
  const [testResults, setTestResults] = useState([]);
  const [loading, setLoading] = useState(true);

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

  // Загружаем данные из localStorage
  useEffect(() => {
    console.log('🔍 ResultsView: Загрузка данных...');
    
    const loadData = () => {
      try {
        const savedTests = localStorage.getItem('quizTests');
        const savedResults = localStorage.getItem('quizResults');
        
        console.log('📁 quizTests из localStorage:', savedTests);
        console.log('📁 quizResults из localStorage:', savedResults);
        
        if (savedTests) {
          const parsedTests = JSON.parse(savedTests);
          setTests(parsedTests);
          console.log('✅ Тесты загружены:', parsedTests);
        } else {
          console.log('❌ Тесты не найдены в localStorage');
        }
        
        if (savedResults) {
          const parsedResults = normalizeResults(JSON.parse(savedResults));
          setTestResults(parsedResults);
          console.log('✅ Результаты загружены:', parsedResults);
        } else {
          console.log('❌ Результаты не найдены в localStorage');
        }
      } catch (error) {
        console.error('❌ Ошибка загрузки данных:', error);
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, []);

  // Функция для создания демо-результатов
  const createDemoResults = () => {
    console.log('🔄 Создание демо-результатов...');
    const demoResults = [
      {
        id: 1,
        testId: 1,
        testTitle: "Тест по JavaScript",
        userName: "Иван Иванов",
        score: 5,
        maxScore: 6,
        percentage: 83,
        completedAt: "2024-01-20T10:30:00Z"
      },
      {
        id: 2,
        testId: 1, 
        testTitle: "Тест по JavaScript",
        userName: "Мария Петрова",
        score: 6,
        maxScore: 6,
        percentage: 100,
        completedAt: "2024-01-20T11:15:00Z"
      },
      {
        id: 3,
        testId: 3,
        testTitle: "Тест по Python",
        userName: "Алексей Сидоров",
        score: 8,
        maxScore: 10,
        percentage: 80,
        completedAt: "2024-01-20T12:00:00Z"
      }
    ];
    
    const normalizedResults = normalizeResults(demoResults);
    setTestResults(normalizedResults);
    localStorage.setItem('quizResults', JSON.stringify(normalizedResults));
    console.log('✅ Демо-результаты созданы:', normalizedResults);
  };

  const filteredResults = selectedTest 
    ? testResults.filter(result => result.testId === selectedTest.id)
    : testResults;

  const searchedResults = searchTerm
    ? filteredResults.filter(result => 
        result.userName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        result.testTitle?.toLowerCase().includes(searchTerm.toLowerCase())
      )
    : filteredResults;

  const getScoreColor = (percentage) => {
    if (percentage >= 80) return '#059669';
    if (percentage >= 60) return '#d97706';
    return '#dc2626';
  };

  const getTestStats = (testId) => {
    const resultsForTest = testResults.filter(result => result.testId === testId);
    if (resultsForTest.length === 0) return null;

    const percentages = resultsForTest.map(result => result.percentage || 0);
    const avgScore = percentages.reduce((sum, percentage) => sum + percentage, 0) / percentages.length;
    const bestResult = Math.max(...percentages);
    const worstResult = Math.min(...percentages);

    return {
      totalAttempts: resultsForTest.length,
      averageScore: avgScore,
      bestScore: bestResult,
      worstScore: worstResult
    };
  };

  if (loading) {
    return (
      <div style={{
        minHeight: '100vh',
        backgroundColor: '#f9fafb',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center'
      }}>
        <div style={{
          textAlign: 'center',
          padding: '2rem'
        }}>
          <div style={{
            fontSize: '3rem',
            marginBottom: '1rem'
          }}>⏳</div>
          <h2 style={{
            fontSize: '1.5rem',
            fontWeight: 'bold',
            color: '#1f2937',
            marginBottom: '1rem'
          }}>Загрузка результатов...</h2>
          <p style={{ color: '#6b7280' }}>Пожалуйста, подождите</p>
        </div>
      </div>
    );
  }

  const renderResultsList = () => (
    <div style={{
      display: 'flex',
      flexDirection: 'column',
      gap: '1.5rem'
    }}>
      {/* Отладочная информация */}
      <div style={{
        backgroundColor: '#fef3c7',
        border: '1px solid #f59e0b',
        borderRadius: '0.5rem',
        padding: '1rem',
        fontSize: '0.875rem'
      }}>
        <strong>Отладка:</strong> Загружено {testResults.length} результатов, {tests.length} тестов
      </div>

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
            onChange={(e) => {
              const testId = e.target.value;
              setSelectedTest(testId ? tests.find(t => t.id === parseInt(testId)) : null);
            }}
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
        ) : (
          <div style={{
            backgroundColor: 'white',
            borderRadius: '0.75rem',
            boxShadow: '0 1px 3px 0 rgba(0, 0, 0, 0.1), 0 1px 2px 0 rgba(0, 0, 0, 0.06)',
            border: '1px solid #e5e7eb',
            padding: '1.5rem',
            textAlign: 'center'
          }}>
            <p style={{ color: '#6b7280' }}>Нет результатов для теста "{selectedTest.title}"</p>
          </div>
        );
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
            searchedResults.map((result, index) => (
              <div key={result.id || index} style={{
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
                      }}>{result.userName || 'Неизвестный пользователь'}</h4>
                      <p style={{
                        color: '#6b7280',
                        fontSize: '0.875rem'
                      }}>{result.testTitle || 'Тест без названия'}</p>
                    </div>
                    <div style={{
                      textAlign: 'right'
                    }}>
                      <div style={{
                        fontSize: '1.5rem',
                        fontWeight: 'bold',
                        color: getScoreColor(result.percentage || 0)
                      }}>
                        {result.score || 0}/{result.maxScore || 0}
                      </div>
                      <div style={{
                        fontSize: '0.875rem',
                        color: '#6b7280'
                      }}>
                        {(result.percentage || 0)}%
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
                      Завершено: {result.completedAt ? new Date(result.completedAt).toLocaleDateString('ru-RU', {
                        year: 'numeric',
                        month: 'long',
                        day: 'numeric',
                        hour: '2-digit',
                        minute: '2-digit'
                      }) : 'Дата неизвестна'}
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
              <button
                onClick={createDemoResults}
                style={{
                  backgroundColor: '#2563eb',
                  color: 'white',
                  padding: '0.5rem 1rem',
                  borderRadius: '0.375rem',
                  border: 'none',
                  cursor: 'pointer',
                  marginTop: '1rem'
                }}
              >
                Создать демо-результаты
              </button>
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