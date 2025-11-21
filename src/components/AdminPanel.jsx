import React, { useState, useEffect } from 'react';
import { supabase } from '../supabase';

const AdminPanel = ({ user, tests, onRoleChange, onCreateTest, onRefreshTests }) => {
  const [results, setResults] = useState([]);
  const [stats, setStats] = useState({});
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [newTest, setNewTest] = useState({
    title: '',
    description: '',
    time_limit: 30,
    questions_count: 10,
    difficulty: 'beginner',
    tags: []
  });

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
          tests (title)
        `)
        .order('created_at', { ascending: false })
        .limit(50);

      if (error) throw error;
      setResults(data || []);
    } catch (error) {
      console.error('Error fetching results:', error);
    }
  };

  const fetchStats = async () => {
    try {
      // Общая статистика
      const { count: totalUsers } = await supabase
        .from('test_results')
        .select('user_name', { count: 'exact', head: true });

      const { count: totalTests } = await supabase
        .from('tests')
        .select('*', { count: 'exact', head: true });

      const { data: resultsData } = await supabase
        .from('test_results')
        .select('score');

      const avgScore = resultsData && resultsData.length > 0 
        ? resultsData.reduce((acc, curr) => acc + curr.score, 0) / resultsData.length 
        : 0;

      setStats({
        totalUsers: totalUsers || 0,
        totalTests: totalTests || 0,
        avgScore: avgScore.toFixed(1),
        totalAttempts: resultsData?.length || 0
      });

    } catch (error) {
      console.error('Error fetching stats:', error);
    }
  };

  const handleCreateTest = async (e) => {
    e.preventDefault();
    
    const testData = {
      ...newTest,
      is_active: true,
      tags: Array.isArray(newTest.tags) ? newTest.tags : newTest.tags.split(',').map(tag => tag.trim()).filter(tag => tag)
    };

    const createdTest = await onCreateTest(testData);
    
    if (createdTest) {
      setShowCreateForm(false);
      setNewTest({
        title: '',
        description: '',
        time_limit: 30,
        questions_count: 10,
        difficulty: 'beginner',
        tags: []
      });
    }
  };

  const deleteTest = async (testId) => {
    if (!window.confirm('Вы уверены, что хотите удалить этот тест?')) return;

    try {
      const { error } = await supabase
        .from('tests')
        .update({ is_active: false })
        .eq('id', testId);

      if (error) throw error;
      
      onRefreshTests();
      alert('Тест удален!');
    } catch (error) {
      console.error('Error deleting test:', error);
      alert('Ошибка удаления теста');
    }
  };

  const exportResults = async () => {
    try {
      const { data, error } = await supabase
        .from('test_results')
        .select(`
          *,
          tests (title)
        `)
        .order('created_at', { ascending: false });

      if (error) throw error;

      // Создаем CSV
      const headers = ['Пользователь', 'Тест', 'Результат (%)', 'Время (мин)', 'Правильные ответы', 'Всего вопросов', 'Дата'];
      const csvData = data.map(result => [
        result.user_name,
        result.tests?.title || 'Неизвестно',
        result.score,
        result.time_spent,
        result.correct_answers,
        result.total_questions,
        new Date(result.created_at).toLocaleDateString()
      ]);

      const csvContent = [headers, ...csvData]
        .map(row => row.map(field => `"${field}"`).join(','))
        .join('\n');

      const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
      const link = document.createElement('a');
      const url = URL.createObjectURL(blob);
      link.setAttribute('href', url);
      link.setAttribute('download', `results_${new Date().toISOString().split('T')[0]}.csv`);
      link.style.visibility = 'hidden';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      
      alert('Результаты экспортированы в CSV!');
    } catch (error) {
      console.error('Error exporting results:', error);
      alert('Ошибка экспорта результатов');
    }
  };

  return (
    <div className="admin-panel">
      <div className="container">
        <div className="admin-header">
          <div>
            <h1>Панель администратора</h1>
            <p>Добро пожаловать, {user?.name || user?.email}</p>
          </div>
          <div className="admin-actions">
            <button className="btn-primary" onClick={() => setShowCreateForm(true)}>
              + Создать тест
            </button>
            <button className="btn-secondary" onClick={exportResults}>
              📊 Экспорт результатов
            </button>
            <button className="role-change-btn" onClick={onRoleChange}>
              Сменить роль
            </button>
          </div>
        </div>

        {/* Статистика */}
        <div className="stats-grid">
          <div className="stat-card">
            <div className="stat-value">{stats.totalUsers}</div>
            <div className="stat-label">Уникальных пользователей</div>
          </div>
          <div className="stat-card">
            <div className="stat-value">{stats.totalTests}</div>
            <div className="stat-label">Активных тестов</div>
          </div>
          <div className="stat-card">
            <div className="stat-value">{stats.avgScore}%</div>
            <div className="stat-label">Средний балл</div>
          </div>
          <div className="stat-card">
            <div className="stat-value">{stats.totalAttempts}</div>
            <div className="stat-label">Всего попыток</div>
          </div>
        </div>

        {/* Создание теста */}
        {showCreateForm && (
          <div className="create-test-form">
            <h3>Создание нового теста</h3>
            <form onSubmit={handleCreateTest}>
              <div className="form-row">
                <input
                  type="text"
                  placeholder="Название теста"
                  value={newTest.title}
                  onChange={(e) => setNewTest({...newTest, title: e.target.value})}
                  required
                />
                <select
                  value={newTest.difficulty}
                  onChange={(e) => setNewTest({...newTest, difficulty: e.target.value})}
                >
                  <option value="beginner">Начальный</option>
                  <option value="intermediate">Средний</option>
                  <option value="advanced">Продвинутый</option>
                </select>
              </div>
              
              <textarea
                placeholder="Описание теста"
                value={newTest.description}
                onChange={(e) => setNewTest({...newTest, description: e.target.value})}
                required
              />
              
              <div className="form-row">
                <input
                  type="number"
                  placeholder="Время (мин)"
                  value={newTest.time_limit}
                  onChange={(e) => setNewTest({...newTest, time_limit: parseInt(e.target.value)})}
                  required
                  min="1"
                />
                <input
                  type="number"
                  placeholder="Количество вопросов"
                  value={newTest.questions_count}
                  onChange={(e) => setNewTest({...newTest, questions_count: parseInt(e.target.value)})}
                  required
                  min="1"
                />
              </div>
              
              <input
                type="text"
                placeholder="Теги (через запятую): programming, javascript, beginner"
                value={newTest.tags}
                onChange={(e) => setNewTest({...newTest, tags: e.target.value})}
              />
              
              <div className="form-actions">
                <button type="submit" className="btn-primary">Создать тест</button>
                <button type="button" onClick={() => setShowCreateForm(false)}>
                  Отмена
                </button>
              </div>
            </form>
          </div>
        )}

        {/* Список тестов */}
        <div className="admin-tests-section">
          <h2>Управление тестами ({tests.length})</h2>
          <div className="tests-list">
            {tests.map(test => (
              <div key={test.id} className="admin-test-card">
                <div className="test-info">
                  <h4>{test.title}</h4>
                  <p>{test.description}</p>
                  <div className="test-meta">
                    <span>⏱️ {test.time_limit} мин</span>
                    <span>📝 {test.questions_count} вопросов</span>
                    <span className={`difficulty ${test.difficulty}`}>
                      {test.difficulty}
                    </span>
                  </div>
                  <div className="test-tags">
                    {test.tags && test.tags.map((tag, index) => (
                      <span key={index} className="tag">#{tag}</span>
                    ))}
                  </div>
                </div>
                <div className="test-actions">
                  <button className="btn-edit">Редактировать</button>
                  <button 
                    className="btn-delete"
                    onClick={() => deleteTest(test.id)}
                  >
                    Удалить
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Результаты тестов */}
        <div className="results-section">
          <div className="section-header">
            <h2>Последние результаты</h2>
            <button onClick={fetchResults} className="btn-refresh">
              🔄 Обновить
            </button>
          </div>
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
                    <td>{result.user_name}</td>
                    <td>{result.tests?.title}</td>
                    <td>
                      <div className={`score-badge ${result.score >= 80 ? 'excellent' : result.score >= 60 ? 'good' : 'poor'}`}>
                        {result.score}%
                      </div>
                    </td>
                    <td>{result.time_spent} мин.</td>
                    <td>{new Date(result.created_at).toLocaleDateString('ru-RU')}</td>
                  </tr>
                ))}
              </tbody>
            </table>
            {results.length === 0 && (
              <div className="no-data">
                <p>Нет данных о результатах</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminPanel;