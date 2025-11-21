import React, { useState } from 'react';

const TestSelection = ({ tests, onRoleChange, onStartTest }) => {
  const [selectedTag, setSelectedTag] = useState('all');

  const allTags = ['all', ...new Set(tests.flatMap(test => test.tags || []))];
  const filteredTests = selectedTag === 'all' ? tests : tests.filter(test => test.tags?.includes(selectedTag));

  return (
    <div className="test-selection">
      <div className="container">
        <div className="header">
          <h1>Система тестирования</h1>
          <p>Выберите тест для прохождения</p>
        </div>

        <div className="filters-section">
          <h3>Фильтр по тегам:</h3>
          <div className="tags-container">
            {allTags.map(tag => (
              <button key={tag} className={`tag ${selectedTag === tag ? 'active' : ''}`} onClick={() => setSelectedTag(tag)}>
                {tag === 'all' ? 'Все тесты' : tag}
              </button>
            ))}
          </div>
        </div>

        <button className="role-change-btn" onClick={onRoleChange}>Сменить роль</button>

        <div className="tests-grid">
          {filteredTests.length > 0 ? (
            filteredTests.map(test => (
              <div key={test.id} className="test-card">
                <h3>{test.title}</h3>
                <p>{test.description}</p>
                <div className="test-meta">
                  <span>Вопросов: {test.questions_count}</span>
                  <span>Время: {test.time_limit} мин</span>
                </div>
                <button className="start-test-btn" onClick={() => onStartTest(test.id)}>Начать тест</button>
              </div>
            ))
          ) : (
            <div className="no-tests">
              <p>Нет доступных тестов</p>
              <p>Попробуйте выбрать другой фильтр</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default TestSelection;