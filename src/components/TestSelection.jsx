import React, { useState } from 'react';

const TestSelection = ({ tests, onRoleChange, onStartTest }) => {
  const [selectedTag, setSelectedTag] = useState('all');

  const allTags = ['all', ...new Set(tests.flatMap(test => test.tags?.map(t => t.name) || []))];
  const filteredTests = selectedTag === 'all' 
    ? tests 
    : tests.filter(test => test.tags?.some(tag => tag.name === selectedTag));

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 py-8">
      <div className="container mx-auto px-4">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-800 mb-2">
            Система тестирования
          </h1>
          <p className="text-lg text-gray-600">
            Выберите тест для прохождения
          </p>
        </div>

        {/* Фильтр по тегам */}
        <div className="mb-8 bg-white rounded-lg p-6 shadow-lg">
          <h3 className="text-lg font-semibold text-gray-800 mb-4">Фильтр по тегам:</h3>
          <div className="flex flex-wrap gap-2">
            {allTags.map(tag => (
              <button
                key={tag}
                onClick={() => setSelectedTag(tag)}
                className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
                  selectedTag === tag
                    ? 'bg-blue-600 text-white'
                    : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                }`}
              >
                {tag === 'all' ? 'Все тесты' : tag}
              </button>
            ))}
          </div>
        </div>

        <button
          onClick={onRoleChange}
          className="bg-gray-500 text-white px-6 py-3 rounded-lg hover:bg-gray-600 transition-colors mb-6"
        >
          Сменить роль
        </button>

        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {filteredTests.length > 0 ? (
            filteredTests.map(test => (
              <div key={test.id} className="bg-white rounded-lg shadow-lg p-6 hover:shadow-xl transition-shadow duration-300">
                <h3 className="text-xl font-semibold text-gray-800 mb-3">
                  {test.title}
                </h3>
                <p className="text-gray-600 mb-4 line-clamp-2">
                  {test.description}
                </p>
                
                {/* Теги теста */}
                {test.tags && test.tags.length > 0 && (
                  <div className="flex flex-wrap gap-1 mb-4">
                    {test.tags.map(tag => (
                      <span
                        key={tag.id}
                        className="px-2 py-1 rounded-full text-xs font-medium text-white"
                        style={{ backgroundColor: tag.color }}
                      >
                        {tag.name}
                      </span>
                    ))}
                  </div>
                )}
                
                <div className="flex justify-between items-center mb-4">
                  <span className="text-sm text-gray-500">
                    Вопросов: {test.question_count}
                  </span>
                  <span className="text-sm text-gray-500">
                    Баллов: {test.max_score}
                  </span>
                </div>
                
                <button
                  onClick={() => onStartTest(test.id)}
                  className="w-full bg-blue-600 text-white text-center py-2 px-4 rounded-lg hover:bg-blue-700 transition-colors duration-200"
                >
                  Начать тест
                </button>
              </div>
            ))
          ) : (
            <div className="col-span-full text-center py-12">
              <p className="text-gray-500 text-lg">Нет доступных тестов</p>
              <p className="text-gray-400">Попробуйте выбрать другой фильтр</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default TestSelection;