import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

// Временные заглушки страниц, позже мы их заменим на реальные формы
const RegisterPage = () => <h1>Регистрация</h1>;
const LoginPage = () => <h1>Вход</h1>;
const ProfilePage = () => <h1>Настройка профиля</h1>;
const FeedPage = () => <h1>Лента совпадений (MatchHub)</h1>;

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<FeedPage />} />
        <Route path="/register" element={<RegisterPage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/profile" element={<ProfilePage />} />
      </Routes>
    </Router>
  );
}

export default App;