import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import ProfilePage from './pages/ProfilePage';
import FeedPage from './pages/FeedPage';
import MatchesPage from './pages/MatchesPage';

const App = () => {
  return (
    <Routes>
      {/* Теперь каждая страница сама отвечает за свои функции */}
      <Route path="/login" element={<LoginPage />} />
      <Route path="/register" element={<RegisterPage />} />
      <Route path="/profile" element={<ProfilePage />} />
      <Route path="/feed" element={<FeedPage />} />
      <Route path="/matches" element={<MatchesPage />} />
      
      {/* Дефолтный путь */}
      <Route path="*" element={<Navigate to="/login" replace />} />
    </Routes>
  );
};

export default App;