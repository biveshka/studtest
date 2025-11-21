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

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 to-pink-100 py-8">
      <div className="container mx-auto px-4">
        <div className="max-w-4xl mx-auto">
          {/* Заголовок */}
          <div className="flex items-center justify-between mb-8">
            <div>
              <button
                onClick={onBack}
                className="flex items-center text-gray-600 hover:text-gray-800 mb-2"
              >
                ← Назад к тестам
              </button>
              <h1 className="text-3xl font-bold text-gray-800">Отзывы о тесте</h1>
              <p className="text-gray-600 mt-2">{test.title}</p>
            </div>
            
            {test.average_rating > 0 && (
              <div className="text-center bg-white rounded-lg shadow p-4">
                <div className="text-2xl font-bold text-yellow-600">
                  {test.average_rating.toFixed(1)}
                </div>
                <div className="flex justify-center text-yellow-400 text-sm">
                  {'★'.repeat(Math.round(test.average_rating))}
                  {'☆'.repeat(5 - Math.round(test.average_rating))}
                </div>
                <div className="text-xs text-gray-500 mt-1">
                  {test.review_count} отзывов
                </div>
              </div>
            )}
          </div>

          {/* Форма отзыва */}
          {!showReviewForm ? (
            <div className="bg-white rounded-lg shadow border p-6 mb-6 text-center">
              <h3 className="text-xl font-semibold text-gray-800 mb-3">
                Понравился тест?
              </h3>
              <p className="text-gray-600 mb-4">
                Поделитесь вашим мнением и помогите другим студентам
              </p>
              <button
                onClick={() => setShowReviewForm(true)}
                className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors font-semibold"
              >
                Написать отзыв
              </button>
            </div>
          ) : (
            <form onSubmit={handleSubmitReview} className="bg-white rounded-lg shadow border p-6 mb-6">
              <h3 className="text-xl font-semibold text-gray-800 mb-4">Ваш отзыв</h3>
              
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Оценка
                </label>
                <div className="flex gap-1">
                  {[1, 2, 3, 4, 5].map(star => (
                    <button
                      key={star}
                      type="button"
                      onClick={() => setNewReview(prev => ({ ...prev, rating: star }))}
                      className={`text-3xl transition-transform hover:scale-110 ${
                        star <= newReview.rating ? 'text-yellow-400' : 'text-gray-300'
                      }`}
                    >
                      ★
                    </button>
                  ))}
                </div>
                <div className="text-sm text-gray-500 mt-1">
                  {newReview.rating === 1 && 'Ужасно'}
                  {newReview.rating === 2 && 'Плохо'}
                  {newReview.rating === 3 && 'Нормально'}
                  {newReview.rating === 4 && 'Хорошо'}
                  {newReview.rating === 5 && 'Отлично'}
                </div>
              </div>

              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Комментарий *
                </label>
                <textarea
                  value={newReview.comment}
                  onChange={(e) => setNewReview(prev => ({ ...prev, comment: e.target.value }))}
                  rows="4"
                  className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Поделитесь вашим мнением о тесте..."
                  required
                />
              </div>

              <div className="flex gap-3">
                <button
                  type="submit"
                  className="bg-green-600 text-white px-6 py-2 rounded-lg hover:bg-green-700 transition-colors"
                >
                  Отправить отзыв
                </button>
                <button
                  type="button"
                  onClick={() => setShowReviewForm(false)}
                  className="bg-gray-500 text-white px-6 py-2 rounded-lg hover:bg-gray-600 transition-colors"
                >
                  Отмена
                </button>
              </div>
            </form>
          )}

          {/* Список отзывов */}
          <div className="bg-white rounded-lg shadow border">
            <div className="p-6 border-b">
              <h3 className="text-xl font-semibold text-gray-800">
                Отзывы ({approvedReviews.length})
              </h3>
            </div>
            
            <div className="divide-y">
              {approvedReviews.length > 0 ? (
                approvedReviews.map(review => (
                  <div key={review.id} className="p-6">
                    <div className="flex items-center justify-between mb-3">
                      <div className="flex items-center gap-3">
                        <div className="flex text-yellow-400 text-lg">
                          {'★'.repeat(review.rating)}
                          {'☆'.repeat(5 - review.rating)}
                        </div>
                        <span className="font-semibold text-gray-800">
                          {review.user_name}
                        </span>
                      </div>
                      <span className="text-sm text-gray-400">
                        {new Date(review.created_at).toLocaleDateString('ru-RU', {
                          year: 'numeric',
                          month: 'long',
                          day: 'numeric'
                        })}
                      </span>
                    </div>
                    <p className="text-gray-700 leading-relaxed">{review.comment}</p>
                  </div>
                ))
              ) : (
                <div className="p-8 text-center text-gray-500">
                  <div className="text-4xl mb-3">💬</div>
                  <p className="text-lg mb-2">Пока нет отзывов</p>
                  <p className="text-sm">Будьте первым, кто оставит отзыв об этом тесте!</p>
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