import React, { useState } from 'react';
import { mockAdmin } from '../data/mockData';

const AdminLogin = ({ onBack, onLogin }) => {
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
    setError(''); // Очищаем ошибку при изменении поля
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    // Имитация проверки администратора с задержкой
    setTimeout(() => {
      if (formData.email === mockAdmin.email && formData.password === mockAdmin.password) {
        onLogin(true); // Успешный вход
      } else {
        setError('Неверный email или пароль');
      }
      setLoading(false);
    }, 1000);
  };

  const useTestCredentials = () => {
    setFormData({
      email: mockAdmin.email,
      password: mockAdmin.password
    });
    setError(''); // Очищаем ошибку при использовании тестовых данных
  };

  return (
    <div className="admin-login">
      <button className="back-btn" onClick={onBack}>
        ← Назад к выбору роли
      </button>

      <div className="login-form">
        <h2>Вход для администратора</h2>
        <p>Введите данные для доступа к панели управления</p>

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label>Email</label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              placeholder="admin@test.ru"
              required
            />
          </div>

          <div className="form-group">
            <label>Пароль</label>
            <input
              type="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              placeholder="Введите пароль"
              required
            />
          </div>

          {/* Показываем ошибку только если она есть */}
          {error && (
            <div className="error-message">
              {error}
            </div>
          )}

          <button 
            type="submit" 
            className="login-btn"
            disabled={loading}
          >
            {loading ? 'Вход...' : 'Войти'}
          </button>
        </form>

        <div className="test-access">
          <h4>Тестовый доступ:</h4>
          <p>Используйте данные администратора из базы данных</p>
          <button 
            type="button" 
            className="test-credentials-btn"
            onClick={useTestCredentials}
          >
            Использовать тестовые данные
          </button>
          <div className="test-credentials">
            <p><strong>Email:</strong> admin@test.ru</p>
            <p><strong>Пароль:</strong> admin123</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminLogin;