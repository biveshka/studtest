
import React, { useState, useEffect } from 'react';
import { supabase } from './supabase';
import './App.css';


function App() {
  const [currentView, setCurrentView] = useState('role-selection');
  const [user, setUser] = useState(null);
  const [tests, setTests] = useState([]);
  const [loading, setLoading] = useState(false);

  // Загрузка тестов из Supabase
  useEffect(() => {
    fetchTests();
  }, []);

  const fetchTests = async () => {
    try {
      const { data, error } = await supabase
        .from('tests')
        .select('*')
        .eq('is_active', true);

      if (error) throw error;
      setTests(data || []);
    } catch (error) {
      console.error('Error fetching tests:', error);
    }
  };

  const handleRoleSelect = (role) => {
    if (role === 'admin') {
      setCurrentView('admin-login');
    } else {
      setCurrentView('test-selection');
    }
  };

  const handleAdminLogin = async (email, password) => {
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('admins')
        .select('*')
        .eq('email', email)
        .eq('password', password)
        .single();

      if (error) throw error;
      
      if (data) {
        setUser(data);
        setCurrentView('admin-panel');
      }
    } catch (error) {
      console.error('Login error:', error);
      alert('Ошибка входа: ' + error.message);
    }
    setLoading(false);
  };

  const handleStartTest = (testId) => {
    setCurrentView('test-taking');
    // Здесь логика начала теста
  };

  return (
    <div className="App">
      {currentView === 'role-selection' && (
        <RoleSelection onRoleSelect={handleRoleSelect} />
      )}

      {currentView === 'test-selection' && (
        <TestSelection 
          tests={tests}
          onRoleChange={() => setCurrentView('role-selection')}
          onStartTest={handleStartTest}
        />
      )}

      {currentView === 'admin-login' && (
        <AdminLogin 
          onBack={() => setCurrentView('role-selection')}
          onLogin={handleAdminLogin}
          loading={loading}
        />
      )}

      {currentView === 'admin-panel' && (
        <AdminPanel 
          user={user}
          onRoleChange={() => setCurrentView('role-selection')}
        />
      )}
    </div>
  );
}

export default App;