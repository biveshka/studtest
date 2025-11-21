import React, { useState } from 'react';

const AdminLogin = ({ onBack, onLogin, loading, connectionError }) => {
  const [formData, setFormData] = useState({ email: '', password: '' });

  const handleSubmit = (e) => {
    e.preventDefault();
    onLogin(formData.email, formData.password);
  };

  const useDemoCredentials = () => {
    setFormData({
      email: 'admin@test.ru',
      password: 'admin123'
    });
  };

  return (
    <div className="admin-login">
      <div className="container">
        <button className="back-btn" onClick={onBack}>← Назад к выбору роли</button>
        
        <div className="login-card">
          <h2>Вход для администратора</h2>
          <p>Введите данные для доступа к панели управления</p>

          {connectionError && (
            <div className="demo-notice">
              <strong>Демо-режим:</strong> Используйте тестовые данные ниже
            </div>
          )}

          <form onSubmit={handleSubmit}>
            <div className="input-group">
              <label>Email</label>
              <input 
                type="email" 
                name="email"
                value={formData.email} 
                onChange={(e) => setFormData({...formData, email: e.target.value})} 
                required 
                placeholder="admin@test.ru"
              />
            </div>
            <div className="input-group">
              <label>Пароль</label>
              <input 
                type="password" 
                name="password"
                value={formData.password} 
                onChange={(e) => setFormData({...formData, password: e.target.value})} 
                required 
                placeholder="admin123"
              />
            </div>

            <button type="submit" className="login-btn" disabled={loading}>
              {loading ? 'Вход...' : 'Войти'}
            </button>
          </form>

          
        </div>
      </div>
    </div>
  );
};

export default AdminLogin;