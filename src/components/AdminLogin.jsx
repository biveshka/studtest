// src/components/AdminLogin.jsx
import React, { useState } from 'react';

const AdminLogin = ({ onBack, onLogin, loading }) => {
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    onLogin(formData.email, formData.password);
  };

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  return (
    <div className="admin-login">
      <div className="container">
        <button className="back-btn" onClick={onBack}>
          ← Назад к выбору роли
        </button>

        <div className="login-card">
          <h2>Вход для администратора</h2>
          <p>Введите данные для доступа к панели управления</p>

          <form onSubmit={handleSubmit}>
            <div className="input-group">
              <label>Email</label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="admin@example.com"
                required
              />
            </div>

            <div className="input-group">
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

            <button type="submit" className="login-btn" disabled={loading}>
              {loading ? 'Вход...' : 'Войти'}
            </button>
          </form>

          <div className="test-info">
            <p>Тестовый доступ:</p>
            <p>Используйте данные администратора из базы данных</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminLogin;