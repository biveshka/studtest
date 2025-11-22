import React, { useState } from 'react';

const TestReviews = ({ test, onAddReview, onBack }) => {
  const [showReviewForm, setShowReviewForm] = useState(false);
  const [newReview, setNewReview] = useState({
    rating: 5,
    comment: ''
  });

  const handleSubmitReview = (e) => {
    e.preventDefault();
    
    if (!newReview.comment.trim()) {
      alert('Пожалуйста, напишите комментарий');
      return;
    }

    onAddReview(newReview);
    setShowReviewForm(false);
    setNewReview({ rating: 5, comment: '' });
  };

  const approvedReviews = test.reviews?.filter(review => review.is_approved) || [];

  const getRatingText = (rating) => {
    switch(rating) {
      case 1: return 'Ужасно';
      case 2: return 'Плохо';
      case 3: return 'Нормально';
      case 4: return 'Хорошо';
      case 5: return 'Отлично';
      default: return '';
    }
  };

  return (
    <div style={{
      minHeight: '100vh',
      background: 'linear-gradient(135deg, #faf5ff 0%, #fdf2f8 100%)',
      padding: '2rem 0'
    }}>
      <div style={{
        maxWidth: '1200px',
        margin: '0 auto',
        padding: '0 1rem'
      }}>
        <div style={{
          maxWidth: '56rem',
          margin: '0 auto'
        }}>
          {/* Заголовок */}
          <div style={{
            display: 'flex',
            alignItems: 'flex-start',
            justifyContent: 'space-between',
            marginBottom: '2rem',
            flexWrap: 'wrap',
            gap: '1rem'
          }}>
            <div style={{ flex: 1 }}>
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
                  transition: 'color 0.2s'
                }}
                onMouseOver={(e) => e.target.style.color = '#374151'}
                onMouseOut={(e) => e.target.style.color = '#6b7280'}
              >
                ← Назад к тестам
              </button>
              <h1 style={{
                fontSize: '1.875rem',
                fontWeight: 'bold',
                color: '#1f2937',
                marginBottom: '0.5rem'
              }}>Отзывы о тесте</h1>
              <p style={{
                color: '#6b7280',
                fontSize: '1.125rem'
              }}>{test.title}</p>
            </div>
            
            {test.average_rating > 0 && (
              <div style={{
                textAlign: 'center',
                backgroundColor: 'white',
                borderRadius: '0.75rem',
                boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
                padding: '1.5rem',
                minWidth: '120px'
              }}>
                <div style={{
                  fontSize: '2rem',
                  fontWeight: 'bold',
                  color: '#d97706',
                  marginBottom: '0.25rem'
                }}>
                  {test.average_rating.toFixed(1)}
                </div>
                <div style={{
                  display: 'flex',
                  justifyContent: 'center',
                  color: '#f59e0b',
                  fontSize: '1rem',
                  marginBottom: '0.5rem'
                }}>
                  {'★'.repeat(Math.round(test.average_rating))}
                  {'☆'.repeat(5 - Math.round(test.average_rating))}
                </div>
                <div style={{
                  fontSize: '0.75rem',
                  color: '#6b7280'
                }}>
                  {test.review_count} отзывов
                </div>
              </div>
            )}
          </div>

          {/* Форма отзыва */}
          {!showReviewForm ? (
            <div style={{
              backgroundColor: 'white',
              borderRadius: '0.75rem',
              boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
              border: '1px solid #e5e7eb',
              padding: '2rem',
              marginBottom: '1.5rem',
              textAlign: 'center'
            }}>
              <h3 style={{
                fontSize: '1.5rem',
                fontWeight: '600',
                color: '#1f2937',
                marginBottom: '0.75rem'
              }}>
                Понравился тест?
              </h3>
              <p style={{
                color: '#6b7280',
                marginBottom: '1.5rem',
                fontSize: '1rem'
              }}>
                Поделитесь вашим мнением и помогите другим студентам
              </p>
              <button
                onClick={() => setShowReviewForm(true)}
                style={{
                  backgroundColor: '#2563eb',
                  color: 'white',
                  padding: '0.75rem 1.5rem',
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
                Написать отзыв
              </button>
            </div>
          ) : (
            <form onSubmit={handleSubmitReview} style={{
              backgroundColor: 'white',
              borderRadius: '0.75rem',
              boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
              border: '1px solid #e5e7eb',
              padding: '2rem',
              marginBottom: '1.5rem'
            }}>
              <h3 style={{
                fontSize: '1.5rem',
                fontWeight: '600',
                color: '#1f2937',
                marginBottom: '1.5rem'
              }}>Ваш отзыв</h3>
              
              <div style={{ marginBottom: '1.5rem' }}>
                <label style={{
                  display: 'block',
                  fontSize: '0.875rem',
                  fontWeight: '500',
                  color: '#374151',
                  marginBottom: '0.5rem'
                }}>
                  Оценка
                </label>
                <div style={{ display: 'flex', gap: '0.25rem', marginBottom: '0.5rem' }}>
                  {[1, 2, 3, 4, 5].map(star => (
                    <button
                      key={star}
                      type="button"
                      onClick={() => setNewReview(prev => ({ ...prev, rating: star }))}
                      style={{
                        fontSize: '2rem',
                        background: 'none',
                        border: 'none',
                        cursor: 'pointer',
                        transition: 'all 0.2s ease',
                        color: star <= newReview.rating ? '#f59e0b' : '#d1d5db'
                      }}
                      onMouseOver={(e) => {
                        if (star > newReview.rating) {
                          e.target.style.transform = 'scale(1.1)';
                        }
                      }}
                      onMouseOut={(e) => {
                        if (star > newReview.rating) {
                          e.target.style.transform = 'scale(1)';
                        }
                      }}
                    >
                      ★
                    </button>
                  ))}
                </div>
                <div style={{
                  fontSize: '0.875rem',
                  color: '#6b7280',
                  fontWeight: '500'
                }}>
                  {getRatingText(newReview.rating)}
                </div>
              </div>

              <div style={{ marginBottom: '1.5rem' }}>
                <label style={{
                  display: 'block',
                  fontSize: '0.875rem',
                  fontWeight: '500',
                  color: '#374151',
                  marginBottom: '0.5rem'
                }}>
                  Комментарий *
                </label>
                <textarea
                  value={newReview.comment}
                  onChange={(e) => setNewReview(prev => ({ ...prev, comment: e.target.value }))}
                  rows="4"
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
                  placeholder="Поделитесь вашим мнением о тесте..."
                  required
                />
              </div>

              <div style={{ display: 'flex', gap: '0.75rem' }}>
                <button
                  type="submit"
                  style={{
                    backgroundColor: '#059669',
                    color: 'white',
                    padding: '0.5rem 1.5rem',
                    borderRadius: '0.5rem',
                    border: 'none',
                    cursor: 'pointer',
                    fontWeight: '500',
                    transition: 'background-color 0.2s'
                  }}
                  onMouseOver={(e) => e.target.style.backgroundColor = '#047857'}
                  onMouseOut={(e) => e.target.style.backgroundColor = '#059669'}
                >
                  Отправить отзыв
                </button>
                <button
                  type="button"
                  onClick={() => setShowReviewForm(false)}
                  style={{
                    backgroundColor: '#6b7280',
                    color: 'white',
                    padding: '0.5rem 1.5rem',
                    borderRadius: '0.5rem',
                    border: 'none',
                    cursor: 'pointer',
                    fontWeight: '500',
                    transition: 'background-color 0.2s'
                  }}
                  onMouseOver={(e) => e.target.style.backgroundColor = '#4b5563'}
                  onMouseOut={(e) => e.target.style.backgroundColor = '#6b7280'}
                >
                  Отмена
                </button>
              </div>
            </form>
          )}

          {/* Список отзывов */}
          <div style={{
            backgroundColor: 'white',
            borderRadius: '0.75rem',
            boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
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
                Отзывы ({approvedReviews.length})
              </h3>
            </div>
            
            <div style={{
              display: 'flex',
              flexDirection: 'column'
            }}>
              {approvedReviews.length > 0 ? (
                approvedReviews.map(review => (
                  <div key={review.id} style={{
                    padding: '1.5rem',
                    borderBottom: '1px solid #f3f4f6'
                  }}>
                    <div style={{
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      marginBottom: '0.75rem',
                      flexWrap: 'wrap',
                      gap: '0.5rem'
                    }}>
                      <div style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '0.75rem'
                      }}>
                        <div style={{
                          display: 'flex',
                          color: '#f59e0b',
                          fontSize: '1.125rem'
                        }}>
                          {'★'.repeat(review.rating)}
                          {'☆'.repeat(5 - review.rating)}
                        </div>
                        <span style={{
                          fontWeight: '600',
                          color: '#1f2937'
                        }}>
                          {review.user_name}
                        </span>
                      </div>
                      <span style={{
                        fontSize: '0.875rem',
                        color: '#9ca3af'
                      }}>
                        {new Date(review.created_at).toLocaleDateString('ru-RU', {
                          year: 'numeric',
                          month: 'long',
                          day: 'numeric'
                        })}
                      </span>
                    </div>
                    <p style={{
                      color: '#374151',
                      lineHeight: '1.6'
                    }}>{review.comment}</p>
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
                  }}>💬</div>
                  <p style={{
                    fontSize: '1.125rem',
                    marginBottom: '0.5rem',
                    fontWeight: '500'
                  }}>Пока нет отзывов</p>
                  <p style={{
                    fontSize: '0.875rem'
                  }}>Будьте первым, кто оставит отзыв об этом тесте!</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TestReviews;