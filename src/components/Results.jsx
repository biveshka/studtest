import React, { useState, useEffect } from 'react';
import { useParams, useLocation, Link } from 'react-router-dom';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000/api';

const Results = () => {
  const { testId } = useParams();
  const location = useLocation();
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(true);

  const currentResult = location.state;

  useEffect(() => {
    fetchResults();
  }, [testId]);

  const fetchResults = async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/results/${testId}`);
      if (response.ok) {
        const data = await response.json();
        setResults(data);
      }
    } catch (error) {
      console.error('Error fetching results:', error);
    } finally {
      setLoading(false);
    }
  };

  const getScoreColor = (score, maxScore) => {
    const percentage = (score / maxScore) * 100;
    if (percentage >= 80) return 'text-green-600';
    if (percentage >= 60) return 'text-yellow-600';
    return 'text-red-600';
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto p-6">
      {currentResult && (
        <div className="bg-white rounded-lg shadow-lg p-8 mb-8 text-center">
          <h2 className="text-3xl font-bold text-gray-800 mb-4">
            Тест завершен!
          </h2>
          <div className={`text-5xl font-bold mb-4 ${getScoreColor(currentResult.score, currentResult.maxScore)}`}>
            {currentResult.score} / {currentResult.maxScore}
          </div>
          <p className="text-lg text-gray-600 mb-2">
            Поздравляем, {currentResult.userName}!
          </p>
          <p className="text-gray-500">
            Ваш результат: {Math.round((currentResult.score / currentResult.maxScore) * 100)}%
          </p>
        </div>
      )}

      <div className="bg-white rounded-lg shadow-lg p-6">
        <h3 className="text-xl font-semibold text-gray-800 mb-6">
          История результатов
        </h3>
        
        <div className="space-y-4">
          {results.map((result, index) => (
            <div
              key={result.id}
              className="flex items-center justify-between p-4 border border-gray-200 rounded-lg"
            >
              <div>
                <span className="font-semibold text-gray-800">
                  {result.user_name}
                </span>
                <span className="text-gray-500 text-sm ml-2">
                  {new Date(result.completed_at).toLocaleDateString('ru-RU')}
                </span>
              </div>
              <div className={`font-bold ${getScoreColor(result.score, result.max_score)}`}>
                {result.score} / {result.max_score}
              </div>
            </div>
          ))}
        </div>

        {results.length === 0 && (
          <div className="text-center py-8">
            <p className="text-gray-500">Результаты не найдены</p>
          </div>
        )}
      </div>

      <div className="text-center mt-8">
        <Link
          to="/user"
          className="inline-block bg-blue-600 text-white py-3 px-8 rounded-lg hover:bg-blue-700 transition-colors"
        >
          Вернуться к списку тестов
        </Link>
      </div>
    </div>
  );
};

export default Results;