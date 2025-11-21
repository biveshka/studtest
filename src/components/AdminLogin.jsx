import React, { useState } from 'react';

const AdminLogin = ({ onLogin, onBack }) => {
  const [credentials, setCredentials] = useState({
    email: '',
    password: ''
  });
  const [error, setError] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (credentials.email === 'admin@test.ru' && credentials.password === 'admin123') {
      onLogin({
        id: 1,
        email: 'admin@test.ru',
        full_name: 'Администратор Системы',
        role: 'admin'
      });
    } else {
      setError('Неверный email или пароль');
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-teal-100 flex items-center justify-center py-8">
      <div className="bg-white rounded-2xl shadow-2xl p-8 max-w-md w-full mx-4">
        <button
          onClick={onBack}
          className="flex items-center text-gray-600 hover:text-gray-800 mb-6"
        >
          ← Назад к выбору роли
        </button>

        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-800 mb-2">
            Вход для администратора
          </h1>
          <p className="text-gray-600">
            Введите данные для доступа к панели управления
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Email
            </label>
            <input
              type="email"
              value={credentials.email}
              onChange={(e) => setCredentials(prev => ({...prev, email: e.target.value}))}
              className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
              placeholder="admin@test.ru"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Пароль
            </label>
            <input
              type="password"
              value={credentials.password}
              onChange={(e) => setCredentials(prev => ({...prev, password: e.target.value}))}
              className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
              placeholder="Введите пароль"
              required
            />
          </div>

          {error && (
            <div className="bg-red-50 border border-red-200 rounded-lg p-3">
              <p className="text-red-600 text-sm">{error}</p>
            </div>
          )}

          <button
            type="submit"
            className="w-full bg-green-600 text-white py-3 px-6 rounded-lg hover:bg-green-700 transition-colors duration-200 font-semibold"
          >
            Войти
          </button>
        </form>

        
      </div>
    </div>
  );
};

export default AdminLogin;