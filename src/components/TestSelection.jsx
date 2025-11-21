import React, { useState, useEffect } from 'react';

// Мок-данные прямо в компоненте
const mockTests = [
  {
    id: 1,
    title: "Основы JavaScript",
    description: "Тест по основам программирования на JavaScript",
    tags: ["programming", "javascript", "beginner"],
    questionsCount: 10,
    timeLimit: 30,
    difficulty: "beginner",
    available: true
  },
  {
    id: 2,
    title: "React.js основы",
    description: "Тестирование знаний по React.js и компонентам",
    tags: ["react", "frontend", "javascript"],
    questionsCount: 15,
    timeLimit: 45,
    difficulty: "intermediate",
    available: true
  },
  {
    id: 3,
    title: "Базы данных SQL",
    description: "Тест по основам реляционных баз данных и SQL",
    tags: ["database", "sql", "backend"],
    questionsCount: 20,
    timeLimit: 60,
    difficulty: "intermediate",
    available: true
  }
];

const TestSelection = ({ onRoleChange }) => {
  const [tests, setTests] = useState([]);
  const [filteredTests, setFilteredTests] = useState([]);
  const [selectedTag, setSelectedTag] = useState('all');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Имитация загрузки данных
    setTimeout(() => {
      setTests(mockTests);
      setFilteredTests(mockTests);
      setLoading(false);
    }, 1000);
  }, []);

  const allTags = ['all', ...new Set(tests.flatMap(test => test.tags))];

  const handleTagFilter = (tag) => {
    setSelectedTag(tag);
    if (tag === 'all') {
      setFilteredTests(tests);
    } else {
      setFilteredTests(tests.filter(test => test.tags.includes(tag)));
    }
  };

  if (loading) {
    return (
      <div className="test-selection">
        <h1>Система тестирования</h1>
        <p>Загрузка тестов...</p>
      </div>
    );
  }

  return (
    <div className="test-selection">
      <div className="header">
        <h1>Система тестирования</h1>
        <p>Выберите тест для прохождения</p>
      </div>

      <div className="filters">
        <h3>Фильтр по тегам:</h3>
        <div className="tag-buttons">
          {allTags.map(tag => (
            <button
              key={tag}
              className={`tag-btn ${selectedTag === tag ? 'active' : ''}`}
              onClick={() => handleTagFilter(tag)}
            >
              {tag === 'all' ? 'Все тесты' : tag}
            </button>
          ))}
        </div>
      </div>

      <button className="role-change-btn" onClick={onRoleChange}>
        Сменить роль
      </button>

      <div className="tests-grid">
        {filteredTests.length > 0 ? (
          filteredTests.map(test => (
            <div key={test.id} className="test-card">
              <h3>{test.title}</h3>
              <p>{test.description}</p>
              <div className="test-meta">
                <span>Вопросов: {test.questionsCount}</span>
                <span>Время: {test.timeLimit} мин</span>
                <span>Уровень: {test.difficulty}</span>
              </div>
              <div className="test-tags">
                {test.tags.map(tag => (
                  <span key={tag} className="tag">{tag}</span>
                ))}
              </div>
              <button className="start-test-btn">
                Начать тест
              </button>
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
  );
};

export default TestSelection;