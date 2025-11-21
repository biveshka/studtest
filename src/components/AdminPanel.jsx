import React, { useState } from 'react';
import TestEditor from './TestEditor';
import ResultsView from './ResultsView';
import { API_BASE_URL } from '../config';

const AdminPanel = ({ tests, tags, onAddTest, onUpdateTest, onDeleteTest, onLogout, user }) => {
  const [currentView, setCurrentView] = useState('dashboard');
  const [editingTest, setEditingTest] = useState(null);

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

  const renderDashboard = () => (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-gray-800">Панель управления</h2>
        <button
          onClick={handleCreateTest}
          className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors"
        >
          + Создать тест
        </button>
      </div>

      {/* Статистика */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-6">
        <div className="bg-white p-6 rounded-lg shadow border">
          <h3 className="text-lg font-semibold text-gray-800 mb-2">Всего тестов</h3>
          <p className="text-3xl font-bold text-blue-600">{tests.length}</p>
        </div>
        <div className="bg-white p-6 rounded-lg shadow border">
          <h3 className="text-lg font-semibold text-gray-800 mb-2">Опубликовано</h3>
          <p className="text-3xl font-bold text-green-600">
            {tests.filter(t => t.is_published).length}
          </p>
        </div>
        <div className="bg-white p-6 rounded-lg shadow border">
          <h3 className="text-lg font-semibold text-gray-800 mb-2">Вопросов всего</h3>
          <p className="text-3xl font-bold text-purple-600">
            {tests.reduce((sum, test) => sum + test.question_count, 0)}
          </p>
        </div>
        <div className="bg-white p-6 rounded-lg shadow border">
          <h3 className="text-lg font-semibold text-gray-800 mb-2">Всего тегов</h3>
          <p className="text-3xl font-bold text-orange-600">
            {tags.length}
          </p>
        </div>
      </div>

      {/* Список тестов */}
      <div className="bg-white rounded-lg shadow border">
        <div className="p-6 border-b">
          <h3 className="text-xl font-semibold text-gray-800">Список тестов</h3>
        </div>
        <div className="divide-y">
          {tests.map(test => (
            <div key={test.id} className="p-6 flex justify-between items-start">
              <div className="flex-1">
                <div className="flex items-start justify-between mb-2">
                  <h4 className="font-semibold text-gray-800 text-lg">{test.title}</h4>
                  {test.average_rating > 0 && (
                    <div className="flex items-center gap-1 bg-yellow-50 px-2 py-1 rounded text-sm">
                      <span className="text-yellow-600">★</span>
                      <span className="font-medium text-yellow-700">
                        {test.average_rating.toFixed(1)}
                      </span>
                      <span className="text-yellow-600">({test.review_count})</span>
                    </div>
                  )}
                </div>
                
                <p className="text-gray-600 mb-3">{test.description}</p>
                
                {/* Теги теста */}
                {test.tags && test.tags.length > 0 && (
                  <div className="flex flex-wrap gap-1 mb-3">
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
                
                <div className="flex gap-4 text-sm text-gray-500">
                  <span>Вопросов: {test.question_count}</span>
                  <span>Баллов: {test.max_score}</span>
                  <span className={`px-2 py-1 rounded-full text-xs ${
                    test.is_published 
                      ? 'bg-green-100 text-green-800' 
                      : 'bg-yellow-100 text-yellow-800'
                  }`}>
                    {test.is_published ? 'Опубликован' : 'Черновик'}
                  </span>
                </div>
              </div>
              <div className="flex gap-2 ml-4">
                <button
                  onClick={() => handleEditTest(test)}
                  className="bg-yellow-500 text-white px-4 py-2 rounded-lg hover:bg-yellow-600 transition-colors"
                >
                  Редактировать
                </button>
                <button
                  onClick={() => handleDeleteTest(test.id)}
                  className="bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-600 transition-colors"
                >
                  Удалить
                </button>
              </div>
            </div>
          ))}
          {tests.length === 0 && (
            <div className="p-8 text-center text-gray-500">
              <div className="text-4xl mb-3">📝</div>
              <p className="text-lg">Тесты еще не созданы</p>
              <p className="text-sm mt-1">Создайте первый тест, нажав кнопку выше</p>
            </div>
          )}
        </div>
      </div>

      {/* Список тегов */}
      <div className="bg-white rounded-lg shadow border">
        <div className="p-6 border-b">
          <h3 className="text-xl font-semibold text-gray-800">Доступные теги</h3>
        </div>
        <div className="p-6">
          <div className="flex flex-wrap gap-2">
            {tags.map(tag => (
              <span
                key={tag.id}
                className="px-3 py-2 rounded-full text-sm font-medium text-white"
                style={{ backgroundColor: tag.color }}
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
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Административная панель</h1>
              <p className="text-gray-600">Добро пожаловать, {user?.full_name}</p>
            </div>
            <div className="flex items-center gap-4">
              <span className="bg-green-100 text-green-800 px-3 py-1 rounded-full text-sm font-medium">
                Администратор
              </span>
              <button
                onClick={onLogout}
                className="bg-gray-500 text-white px-4 py-2 rounded-lg hover:bg-gray-600 transition-colors"
              >
                Выйти
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
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