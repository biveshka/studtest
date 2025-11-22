import React, { useState } from 'react';

const TestEditor = ({ test, tags, onSave, onCancel, mode }) => {
  const [formData, setFormData] = useState({
    title: test?.title || '',
    description: test?.description || '',
    is_published: test?.is_published ?? true,
    selectedTags: test?.tags || [],
    questions: test?.questions || [
      {
        id: Date.now(),
        question_text: '',
        options: ['', '', '', ''],
        correct_answer: 0,
        points: 1
      }
    ]
  });

  const addQuestion = () => {
    setFormData(prev => ({
      ...prev,
      questions: [
        ...prev.questions,
        {
          id: Date.now(),
          question_text: '',
          options: ['', '', '', ''],
          correct_answer: 0,
          points: 1
        }
      ]
    }));
  };

  const removeQuestion = (questionIndex) => {
    if (formData.questions.length > 1) {
      setFormData(prev => ({
        ...prev,
        questions: prev.questions.filter((_, index) => index !== questionIndex)
      }));
    }
  };

  const updateQuestion = (questionIndex, field, value) => {
    setFormData(prev => ({
      ...prev,
      questions: prev.questions.map((q, index) =>
        index === questionIndex ? { ...q, [field]: value } : q
      )
    }));
  };

  const updateOption = (questionIndex, optionIndex, value) => {
    setFormData(prev => ({
      ...prev,
      questions: prev.questions.map((q, index) =>
        index === questionIndex
          ? {
              ...q,
              options: q.options.map((opt, optIndex) =>
                optIndex === optionIndex ? value : opt
              )
            }
          : q
      )
    }));
  };

  const toggleTag = (tag) => {
    setFormData(prev => ({
      ...prev,
      selectedTags: prev.selectedTags.some(t => t.id === tag.id)
        ? prev.selectedTags.filter(t => t.id !== tag.id)
        : [...prev.selectedTags, tag]
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (!formData.title.trim()) {
      alert('Введите название теста');
      return;
    }

    if (formData.questions.some(q => !q.question_text.trim())) {
      alert('Все вопросы должны иметь текст');
      return;
    }

    if (formData.questions.some(q => q.options.some(opt => !opt.trim()))) {
      alert('Все варианты ответов должны быть заполнены');
      return;
    }

    onSave(formData);
  };

  return (
    <div style={{
      maxWidth: '56rem',
      margin: '0 auto'
    }}>
      <div style={{
        backgroundColor: 'white',
        borderRadius: '0.75rem',
        boxShadow: '0 10px 25px -5px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)',
        border: '1px solid #e5e7eb',
        padding: '2rem'
      }}>
        <h2 style={{
          fontSize: '1.5rem',
          fontWeight: 'bold',
          color: '#1f2937',
          marginBottom: '1.5rem',
          paddingBottom: '1rem',
          borderBottom: '2px solid #f3f4f6'
        }}>
          {mode === 'create' ? 'Создание теста' : 'Редактирование теста'}
        </h2>

        <form onSubmit={handleSubmit} style={{
          display: 'flex',
          flexDirection: 'column',
          gap: '2rem'
        }}>
          {/* Основная информация о тесте */}
          <div style={{
            display: 'flex',
            flexDirection: 'column',
            gap: '1rem'
          }}>
            <h3 style={{
              fontSize: '1.125rem',
              fontWeight: '600',
              color: '#1f2937'
            }}>Основная информация</h3>
            
            <div>
              <label style={{
                display: 'block',
                fontSize: '0.875rem',
                fontWeight: '500',
                color: '#374151',
                marginBottom: '0.5rem'
              }}>
                Название теста *
              </label>
              <input
                type="text"
                value={formData.title}
                onChange={(e) => setFormData(prev => ({...prev, title: e.target.value}))}
                style={{
                  width: '100%',
                  padding: '0.75rem',
                  border: '1px solid #d1d5db',
                  borderRadius: '0.5rem',
                  fontSize: '1rem',
                  transition: 'border-color 0.2s'
                }}
                onFocus={(e) => e.target.style.borderColor = '#2563eb'}
                onBlur={(e) => e.target.style.borderColor = '#d1d5db'}
                placeholder="Введите название теста"
              />
            </div>

            <div>
              <label style={{
                display: 'block',
                fontSize: '0.875rem',
                fontWeight: '500',
                color: '#374151',
                marginBottom: '0.5rem'
              }}>
                Описание теста
              </label>
              <textarea
                value={formData.description}
                onChange={(e) => setFormData(prev => ({...prev, description: e.target.value}))}
                rows="3"
                style={{
                  width: '100%',
                  padding: '0.75rem',
                  border: '1px solid #d1d5db',
                  borderRadius: '0.5rem',
                  fontSize: '1rem',
                  resize: 'vertical',
                  transition: 'border-color 0.2s'
                }}
                onFocus={(e) => e.target.style.borderColor = '#2563eb'}
                onBlur={(e) => e.target.style.borderColor = '#d1d5db'}
                placeholder="Введите описание теста"
              />
            </div>

            <div style={{
              display: 'flex',
              alignItems: 'center'
            }}>
              <input
                type="checkbox"
                id="is_published"
                checked={formData.is_published}
                onChange={(e) => setFormData(prev => ({...prev, is_published: e.target.checked}))}
                style={{
                  height: '1rem',
                  width: '1rem',
                  color: '#2563eb',
                  borderColor: '#d1d5db',
                  borderRadius: '0.25rem'
                }}
              />
              <label htmlFor="is_published" style={{
                marginLeft: '0.5rem',
                fontSize: '0.875rem',
                color: '#374151'
              }}>
                Опубликовать тест (сделать доступным для прохождения)
              </label>
            </div>
          </div>

          {/* Секция тегов */}
          <div style={{
            display: 'flex',
            flexDirection: 'column',
            gap: '1rem'
          }}>
            <h3 style={{
              fontSize: '1.125rem',
              fontWeight: '600',
              color: '#1f2937'
            }}>Теги теста</h3>
            <p style={{
              fontSize: '0.875rem',
              color: '#6b7280'
            }}>Выберите теги для категоризации теста</p>
            
            <div style={{
              display: 'flex',
              flexWrap: 'wrap',
              gap: '0.5rem'
            }}>
              {tags.map(tag => (
                <button
                  key={tag.id}
                  type="button"
                  onClick={() => toggleTag(tag)}
                  style={{
                    padding: '0.5rem 0.75rem',
                    borderRadius: '9999px',
                    fontSize: '0.875rem',
                    fontWeight: '500',
                    border: 'none',
                    cursor: 'pointer',
                    transition: 'all 0.2s ease',
                    backgroundColor: formData.selectedTags.some(t => t.id === tag.id) ? tag.color : '#f3f4f6',
                    color: formData.selectedTags.some(t => t.id === tag.id) ? 'white' : '#374151'
                  }}
                  onMouseOver={(e) => {
                    if (!formData.selectedTags.some(t => t.id === tag.id)) {
                      e.target.style.backgroundColor = '#e5e7eb';
                    }
                  }}
                  onMouseOut={(e) => {
                    if (!formData.selectedTags.some(t => t.id === tag.id)) {
                      e.target.style.backgroundColor = '#f3f4f6';
                    }
                  }}
                >
                  {tag.name}
                </button>
              ))}
            </div>
            
            {formData.selectedTags.length > 0 && (
              <div style={{ marginTop: '0.75rem' }}>
                <p style={{
                  fontSize: '0.875rem',
                  color: '#6b7280',
                  marginBottom: '0.5rem'
                }}>Выбранные теги:</p>
                <div style={{
                  display: 'flex',
                  flexWrap: 'wrap',
                  gap: '0.5rem'
                }}>
                  {formData.selectedTags.map(tag => (
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
                      {tag.name} ×
                    </span>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Вопросы */}
          <div style={{
            display: 'flex',
            flexDirection: 'column',
            gap: '1.5rem'
          }}>
            <div style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center'
            }}>
              <h3 style={{
                fontSize: '1.125rem',
                fontWeight: '600',
                color: '#1f2937'
              }}>Вопросы</h3>
              <button
                type="button"
                onClick={addQuestion}
                style={{
                  backgroundColor: '#059669',
                  color: 'white',
                  padding: '0.5rem 1rem',
                  borderRadius: '0.5rem',
                  border: 'none',
                  cursor: 'pointer',
                  fontWeight: '500',
                  transition: 'background-color 0.2s'
                }}
                onMouseOver={(e) => e.target.style.backgroundColor = '#047857'}
                onMouseOut={(e) => e.target.style.backgroundColor = '#059669'}
              >
                + Добавить вопрос
              </button>
            </div>

            {formData.questions.map((question, questionIndex) => (
              <div key={question.id} style={{
                border: '1px solid #e5e7eb',
                borderRadius: '0.75rem',
                padding: '1.5rem',
                backgroundColor: '#fafafa',
                transition: 'all 0.2s ease'
              }}>
                <div style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'flex-start',
                  marginBottom: '1rem'
                }}>
                  <h4 style={{
                    fontWeight: '600',
                    color: '#1f2937',
                    fontSize: '1rem'
                  }}>Вопрос {questionIndex + 1}</h4>
                  {formData.questions.length > 1 && (
                    <button
                      type="button"
                      onClick={() => removeQuestion(questionIndex)}
                      style={{
                        color: '#dc2626',
                        background: 'none',
                        border: 'none',
                        cursor: 'pointer',
                        fontSize: '0.875rem',
                        transition: 'color 0.2s'
                      }}
                      onMouseOver={(e) => e.target.style.color = '#b91c1c'}
                      onMouseOut={(e) => e.target.style.color = '#dc2626'}
                    >
                      Удалить вопрос
                    </button>
                  )}
                </div>

                <div style={{
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '1rem'
                }}>
                  <div>
                    <label style={{
                      display: 'block',
                      fontSize: '0.875rem',
                      fontWeight: '500',
                      color: '#374151',
                      marginBottom: '0.5rem'
                    }}>
                      Текст вопроса *
                    </label>
                    <input
                      type="text"
                      value={question.question_text}
                      onChange={(e) => updateQuestion(questionIndex, 'question_text', e.target.value)}
                      style={{
                        width: '100%',
                        padding: '0.75rem',
                        border: '1px solid #d1d5db',
                        borderRadius: '0.5rem',
                        fontSize: '1rem',
                        transition: 'border-color 0.2s'
                      }}
                      onFocus={(e) => e.target.style.borderColor = '#2563eb'}
                      onBlur={(e) => e.target.style.borderColor = '#d1d5db'}
                      placeholder="Введите текст вопроса"
                    />
                  </div>

                  <div>
                    <label style={{
                      display: 'block',
                      fontSize: '0.875rem',
                      fontWeight: '500',
                      color: '#374151',
                      marginBottom: '0.5rem'
                    }}>
                      Баллы за вопрос
                    </label>
                    <input
                      type="number"
                      min="1"
                      value={question.points}
                      onChange={(e) => updateQuestion(questionIndex, 'points', parseInt(e.target.value) || 1)}
                      style={{
                        width: '6rem',
                        padding: '0.75rem',
                        border: '1px solid #d1d5db',
                        borderRadius: '0.5rem',
                        fontSize: '1rem',
                        transition: 'border-color 0.2s'
                      }}
                      onFocus={(e) => e.target.style.borderColor = '#2563eb'}
                      onBlur={(e) => e.target.style.borderColor = '#d1d5db'}
                    />
                  </div>

                  <div>
                    <label style={{
                      display: 'block',
                      fontSize: '0.875rem',
                      fontWeight: '500',
                      color: '#374151',
                      marginBottom: '0.75rem'
                    }}>
                      Варианты ответов *
                    </label>
                    <div style={{
                      display: 'flex',
                      flexDirection: 'column',
                      gap: '0.5rem'
                    }}>
                      {question.options.map((option, optionIndex) => (
                        <div key={optionIndex} style={{
                          display: 'flex',
                          alignItems: 'center',
                          gap: '0.75rem'
                        }}>
                          <input
                            type="radio"
                            name={`correct-${questionIndex}`}
                            checked={question.correct_answer === optionIndex}
                            onChange={() => updateQuestion(questionIndex, 'correct_answer', optionIndex)}
                            style={{
                              height: '1rem',
                              width: '1rem',
                              color: '#2563eb',
                              borderColor: '#d1d5db'
                            }}
                          />
                          <input
                            type="text"
                            value={option}
                            onChange={(e) => updateOption(questionIndex, optionIndex, e.target.value)}
                            style={{
                              flex: 1,
                              padding: '0.75rem',
                              border: '1px solid #d1d5db',
                              borderRadius: '0.5rem',
                              fontSize: '1rem',
                              transition: 'border-color 0.2s'
                            }}
                            onFocus={(e) => e.target.style.borderColor = '#2563eb'}
                            onBlur={(e) => e.target.style.borderColor = '#d1d5db'}
                            placeholder={`Вариант ${optionIndex + 1}`}
                          />
                        </div>
                      ))}
                    </div>
                    <p style={{
                      fontSize: '0.75rem',
                      color: '#6b7280',
                      marginTop: '0.5rem'
                    }}>
                      Отметьте правильный вариант ответа
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Кнопки действий */}
          <div style={{
            display: 'flex',
            gap: '1rem',
            paddingTop: '1.5rem',
            borderTop: '2px solid #f3f4f6'
          }}>
            <button
              type="submit"
              style={{
                backgroundColor: '#2563eb',
                color: 'white',
                padding: '0.75rem 2rem',
                borderRadius: '0.5rem',
                border: 'none',
                cursor: 'pointer',
                fontWeight: '600',
                fontSize: '1rem',
                transition: 'all 0.2s ease'
              }}
              onMouseOver={(e) => {
                e.target.style.backgroundColor = '#1d4ed8';
                e.target.style.transform = 'translateY(-1px)';
              }}
              onMouseOut={(e) => {
                e.target.style.backgroundColor = '#2563eb';
                e.target.style.transform = 'translateY(0)';
              }}
            >
              {mode === 'create' ? 'Создать тест' : 'Сохранить изменения'}
            </button>
            <button
              type="button"
              onClick={onCancel}
              style={{
                backgroundColor: '#6b7280',
                color: 'white',
                padding: '0.75rem 2rem',
                borderRadius: '0.5rem',
                border: 'none',
                cursor: 'pointer',
                fontWeight: '500',
                fontSize: '1rem',
                transition: 'background-color 0.2s'
              }}
              onMouseOver={(e) => e.target.style.backgroundColor = '#4b5563'}
              onMouseOut={(e) => e.target.style.backgroundColor = '#6b7280'}
            >
              Отмена
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default TestEditor;