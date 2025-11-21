// src/components/AdminPanel.jsx
import React, { useState, useEffect } from 'react';
import { supabase } from '../config/supabase';

const AdminPanel = ({ user, onRoleChange }) => {
  const [results, setResults] = useState([]);
  const [stats, setStats] = useState({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchResults();
    fetchStats();
  }, []);

  const fetchResults = async () => {
    try {
      const { data, error } = await supabase
        .from('test_results')
        .select(`
          *,
          tests (title),
          users (name, email)
        `)
        .order('created_at', { ascending: false });

      if (error) throw error;
      setResults(data || []);
    } catch (error) {
      console.error('Error fetching results:', error);
    }
  };

  const fetchStats = async () => {
    try {
      // Статистика пользователей
      const { count: totalUsers } = await supabase
        .from('users')
        .select('*', { count: 'exact', head: true });

      // Статистика тестов
      const { count: totalTests } = await supabase
        .from('tests')
        .select('*', { count: 'exact', head: true });

      // Средний балл
      const { data: avgData } = await supabase
        .from('test_results')
        .select('score');

      const avgScore = avgData && avgData.length > 0 
        ? avgData.reduce((acc, curr) => acc + curr.score, 0) / avgData.length 
        : 0;

      setStats({
        totalUsers: totalUsers || 0,
        totalTests: totalTests || 0,
        avgScore: avgScore.toFixed(1),
        totalAttempts: avgData?.length || 0
      });

    } catch (error) {
      console.error('Error fetching stats:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <div className="loading">Загрузка...</div>;
  }

  return (
    <div className="admin-panel">
      <div className="container">
        <div className="admin-header">
          <div>
            <h1>Панель администратора</h1>
            <p>Добро пожаловать, {user?.name}</p>
          </div>
          <button className="role-change-btn" onClick={onRoleChange}>
            Сменить роль
          </button>
        </div>

        {/* Статистика */}
        <div className="stats-grid">
          <div className="stat-card">
            <div className="stat-value">{stats.totalUsers}</div>
            <div className="stat-label">Пользователей</div>
          </div>
          <div className="stat-card">
            <div className="stat-value">{stats.totalTests}</div>
            <div className="stat-label">Тестов</div>
          </div>
          <div className="stat-card">
            <div className="stat-value">{stats.avgScore}%</div>
            <div className="stat-label">Средний балл</div>
          </div>
          <div className="stat-card">
            <div className="stat-value">{stats.totalAttempts}</div>
            <div className="stat-label">Попыток</div>
          </div>
        </div>

        {/* Результаты тестов */}
        <div className="results-section">
          <h2>Результаты тестирования</h2>
          <div className="results-table">
            <table>
              <thead>
                <tr>
                  <th>Пользователь</th>
                  <th>Тест</th>
                  <th>Результат</th>
                  <th>Время</th>
                  <th>Дата</th>
                </tr>
              </thead>
              <tbody>
                {results.map(result => (
                  <tr key={result.id}>
                    <td>
                      <div className="user-info">
                        <strong>{result.users?.name}</strong>
                        <span>{result.users?.email}</span>
                      </div>
                    </td>
                    <td>{result.tests?.title}</td>
                    <td>
                      <div className="score-badge">
                        {result.score}%
                      </div>
                    </td>
                    <td>{result.time_spent} мин.</td>
                    <td>{new Date(result.created_at).toLocaleDateString()}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminPanel;