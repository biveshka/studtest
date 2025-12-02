import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import TestEditor from './TestEditor';

const AdminPanel = ({ tests, tags, onAddTest, onUpdateTest, onDeleteTest, onLogout, user, testResults, onUpdateResults }) => {
  const [currentView, setCurrentView] = useState('dashboard');
  const [editingTest, setEditingTest] = useState(null);
  const navigate = useNavigate();

  const handleCreateTest = () => {
    setEditingTest(null);
    setCurrentView('create');
  };

  const handleEditTest = (test) => {
    setEditingTest(test);
    setCurrentView('edit');
  };

  const handleSaveTest = (testData) => {
    if (editingTest) {
      onUpdateTest({ ...editingTest, ...testData });
    } else {
      onAddTest(testData);
    }
    setCurrentView('dashboard');
  };

  const handleDeleteTest = (testId) => {
    if (window.confirm('Вы уверены, что хотите удалить этот тест?')) {
      onDeleteTest(testId);
    }
  };

  const handleViewResults = () => {
    // Обновляем результаты перед переходом
    if (onUpdateResults) {
      const updatedResults = onUpdateResults();
      console.log('📊 Обновленные результаты перед переходом:', updatedResults?.length || testResults.length);
    }
    console.log('📊 Переход к результатам, всего результатов:', testResults.length);
    console.log('📊 Данные результатов:', testResults);
    navigate('/admin/results');
  };

  const handleRefreshResults = () => {
    if (onUpdateResults) {
      const updatedResults = onUpdateResults();
      console.log('🔄 Результаты обновлены:', updatedResults?.length || testResults.length);
      alert(`Результаты обновлены! Всего результатов: ${updatedResults?.length || testResults.length}`);
    } else {
      alert('Функция обновления результатов недоступна');
    }
  };

  const renderDashboard = () => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
      <div style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center'
      }}>
        <h2 style={{
          fontSize: '1.5rem',
          fontWeight: 'bold',
          color: '#1f2937'
        }}>Панель управления</h2>
        <div style={{
          display: 'flex',
          gap: '0.75rem',
          flexWrap: 'wrap'
        }}>
          <button
            onClick={handleRefreshResults}
            style={{
              backgroundColor: '#059669',
              color: 'white',
              padding: '0.5rem 1rem',
              borderRadius: '0.5rem',
              border: 'none',
              cursor: 'pointer',
              fontWeight: '500',
              transition: 'background-color 0.2s',
              display: 'flex',
              alignItems: 'center',
              gap: '0.5rem'
            }}
            onMouseOver={(e) => e.target.style.backgroundColor = '#047857'}
            onMouseOut={(e) => e.target.style.backgroundColor = '#059669'}
          >
            🔄 Обновить
          </button>
          <button
            onClick={handleViewResults}
            style={{
              backgroundColor: '#7c3aed',
              color: 'white',
              padding: '0.5rem 1.5rem',
              borderRadius: '0.5rem',
              border: 'none',
              cursor: 'pointer',
              fontWeight: '500',
              transition: 'background-color 0.2s',
              display: 'flex',
              alignItems: 'center',
              gap: '0.5rem'
            }}
            onMouseOver={(e) => e.target.style.backgroundColor = '#6d28d9'}
            onMouseOut={(e) => e.target.style.backgroundColor = '#7c3aed'}
          >
            📊 Результаты ({testResults.length})
          </button>
          <button
            onClick={handleCreateTest}
            style={{
              backgroundColor: '#2563eb',
              color: 'white',
              padding: '0.5rem 1.5rem',
              borderRadius: '0.5rem',
              border: 'none',
              cursor: 'pointer',
              fontWeight: '500',
              transition: 'background-color 0.2s'
            }}
            onMouseOver={(e) => e.target.style.backgroundColor = '#1d4ed8'}
            onMouseOut={(e) => e.target.style.backgroundColor = '#2563eb'}
          >
            + Создать тест
          </button>
        </div>
      </div>

      {/* Статистика */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
        gap: '1.5rem',
        marginBottom: '1.5rem'
      }}>
        <div style={{
          backgroundColor: 'white',
          padding: '1.5rem',
          borderRadius: '0.75rem',
          boxShadow: '0 1px 3px 0 rgba(0, 0, 0, 0.1), 0 1px 2px 0 rgba(0, 0, 0, 0.06)',
          border: '1px solid #e5e7eb'
        }}>
          <h3 style={{
            fontSize: '1rem',
            fontWeight: '600',
            color: '#374151',
            marginBottom: '0.5rem'
          }}>Всего тестов</h3>
          <p style={{
            fontSize: '2rem',
            fontWeight: 'bold',
            color: '#2563eb'
          }}>{tests.length}</p>
        </div>
        <div style={{
          backgroundColor: 'white',
          padding: '1.5rem',
          borderRadius: '0.75rem',
          boxShadow: '0 1px 3px 0 rgba(0, 0, 0, 0.1), 0 1px 2px 0 rgba(0, 0, 0, 0.06)',
          border: '1px solid #e5e7eb'
        }}>
          <h3 style={{
            fontSize: '1rem',
            fontWeight: '600',
            color: '#374151',
            marginBottom: '0.5rem'
          }}>Опубликовано</h3>
          <p style={{
            fontSize: '2rem',
            fontWeight: 'bold',
            color: '#059669'
          }}>
            {tests.filter(t => t.is_published).length}
          </p>
        </div>
        <div style={{
          backgroundColor: 'white',
          padding: '1.5rem',
          borderRadius: '0.75rem',
          boxShadow: '0 1px 3px 0 rgba(0, 0, 0, 0.1), 0 1px 2px 0 rgba(0, 0, 0, 0.06)',
          border: '1px solid #e5e7eb'
        }}>
          <h3 style={{
            fontSize: '1rem',
            fontWeight: '600',
            color: '#374151',
            marginBottom: '0.5rem'
          }}>Всего результатов</h3>
          <p style={{
            fontSize: '2rem',
            fontWeight: 'bold',
            color: '#7c3aed'
          }}>
            {testResults.length}
          </p>
        </div>
        <div style={{
          backgroundColor: 'white',
          padding: '1.5rem',
          borderRadius: '0.75rem',
          boxShadow: '0 1px 3px 0 rgba(0, 0, 0, 0.1), 0 1px 2px 0 rgba(0, 0, 0, 0.06)',
          border: '1px solid #e5e7eb'
        }}>
          <h3 style={{
            fontSize: '1rem',
            fontWeight: '600',
            color: '#374151',
            marginBottom: '0.5rem'
          }}>Всего тегов</h3>
          <p style={{
            fontSize: '2rem',
            fontWeight: 'bold',
            color: '#ea580c'
          }}>
            {tags.length}
          </p>
        </div>
      </div>

      {/* Список тестов */}
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
          }}>Список тестов</h3>
        </div>
        <div style={{
          display: 'flex',
          flexDirection: 'column'
        }}>
          {tests.map(test => {
            const testResultsCount = testResults.filter(r => r.testId == test.id).length;
            return (
              <div key={test.id} style={{
                padding: '1.5rem',
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'flex-start',
                borderBottom: '1px solid #f3f4f6'
              }}>
                <div style={{ flex: 1 }}>
                  <div style={{
                    display: 'flex',
                    alignItems: 'flex-start',
                    justifyContent: 'space-between',
                    marginBottom: '0.5rem'
                  }}>
                    <h4 style={{
                      fontWeight: '600',
                      color: '#1f2937',
                      fontSize: '1.125rem'
                    }}>{test.title}</h4>
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
                          fontWeight: '500',
                          color: '#92400e',
                          fontSize: '0.875rem'
                        }}>
                          {test.average_rating.toFixed(1)}
                        </span>
                        <span style={{
                          color: '#92400e',
                          fontSize: '0.75rem'
                        }}>({test.review_count})</span>
                      </div>
                    )}
                  </div>
                  
                  <p style={{
                    color: '#6b7280',
                    marginBottom: '0.75rem'
                  }}>{test.description}</p>
                  
                  {/* Теги теста */}
                  {test.tags && test.tags.length > 0 && (
                    <div style={{
                      display: 'flex',
                      flexWrap: 'wrap',
                      gap: '0.25rem',
                      marginBottom: '0.75rem'
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
                    gap: '1rem',
                    fontSize: '0.875rem',
                    color: '#6b7280'
                  }}>
                    <span>Вопросов: {test.question_count}</span>
                    <span>Баллов: {test.max_score}</span>
                    <span style={{
                      color: testResultsCount > 0 ? '#7c3aed' : '#6b7280',
                      fontWeight: testResultsCount > 0 ? '600' : 'normal'
                    }}>
                      Результатов: {testResultsCount}
                    </span>
                    <span style={{
                      padding: '0.25rem 0.5rem',
                      borderRadius: '9999px',
                      fontSize: '0.75rem',
                      backgroundColor: test.is_published ? '#d1fae5' : '#fef3c7',
                      color: test.is_published ? '#065f46' : '#92400e'
                    }}>
                      {test.is_published ? 'Опубликован' : 'Черновик'}
                    </span>
                  </div>
                </div>
                <div style={{
                  display: 'flex',
                  gap: '0.5rem',
                  marginLeft: '1rem'
                }}>
                  <button
                    onClick={() => handleEditTest(test)}
                    style={{
                      backgroundColor: '#d97706',
                      color: 'white',
                      padding: '0.5rem 1rem',
                      borderRadius: '0.5rem',
                      border: 'none',
                      cursor: 'pointer',
                      transition: 'background-color 0.2s'
                    }}
                    onMouseOver={(e) => e.target.style.backgroundColor = '#b45309'}
                    onMouseOut={(e) => e.target.style.backgroundColor = '#d97706'}
                  >
                    Редактировать
                  </button>
                  <button
                    onClick={() => handleDeleteTest(test.id)}
                    style={{
                      backgroundColor: '#dc2626',
                      color: 'white',
                      padding: '0.5rem 1rem',
                      borderRadius: '0.5rem',
                      border: 'none',
                      cursor: 'pointer',
                      transition: 'background-color 0.2s'
                    }}
                    onMouseOver={(e) => e.target.style.backgroundColor = '#b91c1c'}
                    onMouseOut={(e) => e.target.style.backgroundColor = '#dc2626'}
                  >
                    Удалить
                  </button>
                </div>
              </div>
            );
          })}
          {tests.length === 0 && (
            <div style={{
              padding: '2rem',
              textAlign: 'center',
              color: '#6b7280'
            }}>
              <div style={{
                fontSize: '2.5rem',
                marginBottom: '0.75rem'
              }}>📝</div>
              <p style={{
                fontSize: '1.125rem',
                marginBottom: '0.25rem'
              }}>Тесты еще не созданы</p>
              <p style={{
                fontSize: '0.875rem'
              }}>Создайте первый тест, нажав кнопку выше</p>
            </div>
          )}
        </div>
      </div>

      {/* Список тегов */}
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
          }}>Доступные теги</h3>
        </div>
        <div style={{ padding: '1.5rem' }}>
          <div style={{
            display: 'flex',
            flexWrap: 'wrap',
            gap: '0.5rem'
          }}>
            {tags.map(tag => (
              <span
                key={tag.id}
                style={{
                  padding: '0.5rem 0.75rem',
                  borderRadius: '9999px',
                  fontSize: '0.875rem',
                  fontWeight: '500',
                  color: 'white',
                  backgroundColor: tag.color
                }}
              >
                {tag.name}
              </span>
            ))}
          </div>
        </div>
      </div>
    </div>
  );

  return (
    <div style={{
      minHeight: '100vh',
      backgroundColor: '#f9fafb'
    }}>
      {/* Header */}
      <header style={{
        backgroundColor: 'white',
        boxShadow: '0 1px 3px 0 rgba(0, 0, 0, 0.1), 0 1px 2px 0 rgba(0, 0, 0, 0.06)',
        borderBottom: '1px solid #e5e7eb'
      }}>
        <div style={{
          maxWidth: '80rem',
          margin: '0 auto',
          padding: '0 1rem'
        }}>
          <div style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            padding: '1rem 0'
          }}>
            <div>
              <h1 style={{
                fontSize: '1.5rem',
                fontWeight: 'bold',
                color: '#111827'
              }}>Административная панель</h1>
              <p style={{
                color: '#6b7280'
              }}>Добро пожаловать, {user?.full_name}</p>
            </div>
            <div style={{
              display: 'flex',
              alignItems: 'center',
              gap: '1rem'
            }}>
              <span style={{
                backgroundColor: '#d1fae5',
                color: '#065f46',
                padding: '0.25rem 0.75rem',
                borderRadius: '9999px',
                fontSize: '0.875rem',
                fontWeight: '500'
              }}>
                Администратор
              </span>
              <button
                onClick={onLogout}
                style={{
                  backgroundColor: '#6b7280',
                  color: 'white',
                  padding: '0.5rem 1rem',
                  borderRadius: '0.5rem',
                  border: 'none',
                  cursor: 'pointer',
                  transition: 'background-color 0.2s'
                }}
                onMouseOver={(e) => e.target.style.backgroundColor = '#4b5563'}
                onMouseOut={(e) => e.target.style.backgroundColor = '#6b7280'}
              >
                Выйти
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main style={{
        maxWidth: '80rem',
        margin: '0 auto',
        padding: '2rem 1rem'
      }}>
        {currentView === 'dashboard' && renderDashboard()}
        {(currentView === 'create' || currentView === 'edit') && (
          <TestEditor
            test={editingTest}
            tags={tags}
            onSave={handleSaveTest}
            onCancel={() => setCurrentView('dashboard')}
            mode={currentView === 'create' ? 'create' : 'edit'}
          />
        )}
      </main>
    </div>
  );
};

export default AdminPanel;
