// src/components/ResultsView.jsx
import React, { useState } from 'react';
import './ResultsView.css'; // Создадим стили отдельно

const ResultsView = () => {
  const [selectedTab, setSelectedTab] = useState('all');

  // Примерные данные - замените на свои реальные данные
  const testResults = [
    { id: 1, user: 'Иван Иванов', email: 'ivan@mail.com', score: 85, total: 100, date: '2024-01-15', time: '14:30', status: 'completed' },
    { id: 2, user: 'Петр Петров', email: 'petr@mail.com', score: 92, total: 100, date: '2024-01-15', time: '15:45', status: 'completed' },
    { id: 3, user: 'Мария Сидорова', email: 'maria@mail.com', score: 78, total: 100, date: '2024-01-14', time: '10:20', status: 'completed' },
    { id: 4, user: 'Анна Козлова', email: 'anna@mail.com', score: 45, total: 100, date: '2024-01-14', time: '11:15', status: 'completed' },
    { id: 5, user: 'Сергей Васильев', email: 'sergey@mail.com', score: 0, total: 100, date: '2024-01-13', time: '16:50', status: 'incomplete' },
  ];

  const statistics = {
    totalUsers: 150,
    activeUsers: 120,
    completedTests: 145,
    averageScore: 76,
    completionRate: '85%',
    bestScore: 98,
    worstScore: 25
  };

  const scoreDistribution = [
    { range: '0-20', count: 5, percentage: '3.3%' },
    { range: '21-40', count: 12, percentage: '8.0%' },
    { range: '41-60', count: 25, percentage: '16.7%' },
    { range: '61-80', count: 45, percentage: '30.0%' },
    { range: '81-100', count: 63, percentage: '42.0%' },
  ];

  // Фильтрация результатов по выбранной вкладке
  const filteredResults = selectedTab === 'all' 
    ? testResults 
    : selectedTab === 'completed' 
    ? testResults.filter(result => result.status === 'completed')
    : testResults.filter(result => result.status === 'incomplete');

  return (
    <div className="results-view">
      <h2>📊 Панель результатов</h2>
      
      {/* Статистика */}
      <div className="stats-section">
        <h3>Общая статистика</h3>
        <div className="stats-grid">
          <div className="stat-card">
            <div className="stat-icon">👥</div>
            <div className="stat-info">
              <div className="stat-number">{statistics.totalUsers}</div>
              <div className="stat-label">Всего пользователей</div>
            </div>
          </div>
          <div className="stat-card">
            <div className="stat-icon">✅</div>
            <div className="stat-info">
              <div className="stat-number">{statistics.completedTests}</div>
              <div className="stat-label">Завершенных тестов</div>
            </div>
          </div>
          <div className="stat-card">
            <div className="stat-icon">📈</div>
            <div className="stat-info">
              <div className="stat-number">{statistics.averageScore}%</div>
              <div className="stat-label">Средний балл</div>
            </div>
          </div>
          <div className="stat-card">
            <div className="stat-icon">🎯</div>
            <div className="stat-info">
              <div className="stat-number">{statistics.completionRate}</div>
              <div className="stat-label">Процент завершения</div>
            </div>
          </div>
        </div>
      </div>

      {/* Распределение результатов */}
      <div className="distribution-section">
        <h3>Распределение результатов</h3>
        <div className="distribution-chart">
          {scoreDistribution.map(item => (
            <div key={item.range} className="chart-item">
              <div className="chart-bar-container">
                <div 
                  className="chart-bar" 
                  style={{ height: `${item.count * 2}px` }}
                  title={`${item.count} пользователей (${item.percentage})`}
                ></div>
              </div>
              <div className="chart-labels">
                <span className="range-label">{item.range}</span>
                <span className="count-label">{item.count}</span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Детальная таблица результатов */}
      <div className="results-section">
        <div className="section-header">
          <h3>Детальные результаты</h3>
          <div className="tabs">
            <button 
              className={`tab ${selectedTab === 'all' ? 'active' : ''}`}
              onClick={() => setSelectedTab('all')}
            >
              Все ({testResults.length})
            </button>
            <button 
              className={`tab ${selectedTab === 'completed' ? 'active' : ''}`}
              onClick={() => setSelectedTab('completed')}
            >
              Завершенные ({testResults.filter(r => r.status === 'completed').length})
            </button>
            <button 
              className={`tab ${selectedTab === 'incomplete' ? 'active' : ''}`}
              onClick={() => setSelectedTab('incomplete')}
            >
              Не завершены ({testResults.filter(r => r.status === 'incomplete').length})
            </button>
          </div>
        </div>

        <div className="results-table-container">
          <table className="results-table">
            <thead>
              <tr>
                <th>ID</th>
                <th>Пользователь</th>
                <th>Email</th>
                <th>Результат</th>
                <th>Дата</th>
                <th>Время</th>
                <th>Статус</th>
                <th>Действия</th>
              </tr>
            </thead>
            <tbody>
              {filteredResults.map(result => (
                <tr key={result.id}>
                  <td className="id-cell">#{result.id}</td>
                  <td className="user-cell">
                    <div className="user-avatar">
                      {result.user.charAt(0)}
                    </div>
                    {result.user}
                  </td>
                  <td className="email-cell">{result.email}</td>
                  <td className="score-cell">
                    <div className="score-progress">
                      <div 
                        className="progress-bar" 
                        style={{ width: `${result.score}%` }}
                      ></div>
                      <span className="score-text">
                        {result.score}/{result.total} ({result.score}%)
                      </span>
                    </div>
                  </td>
                  <td className="date-cell">{result.date}</td>
                  <td className="time-cell">{result.time}</td>
                  <td className="status-cell">
                    <span className={`status-badge ${result.status}`}>
                      {result.status === 'completed' ? '✅ Завершен' : '⏳ В процессе'}
                    </span>
                  </td>
                  <td className="actions-cell">
                    <button className="btn-view">👁️ Просмотр</button>
                    <button className="btn-download">📥 Скачать</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Экспорт данных */}
      <div className="export-section">
        <h3>Экспорт данных</h3>
        <div className="export-buttons">
          <button className="export-btn excel">📊 Экспорт в Excel</button>
          <button className="export-btn pdf">📄 Экспорт в PDF</button>
          <button className="export-btn csv">📋 Экспорт в CSV</button>
        </div>
      </div>
    </div>
  );
};

export default ResultsView;