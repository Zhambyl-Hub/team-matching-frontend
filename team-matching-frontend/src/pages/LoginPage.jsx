import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { loginUser } from '../services/api';
import styles from "../components/AuthForm.module.css";

const LoginPage = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const response = await loginUser({ email, password });
      if (response.data?.access) {
        localStorage.setItem('access_token', response.data.access);
        navigate('/profile'); 
      }
    } catch (err) {
      console.error('Ошибка входа:', err);
      alert('Неверный email или пароль');
    }
  };

  return (
    <div className={styles.pageWrapper}>
      <div className={styles.authWrapper}>
        <h2>Вход</h2>
        <form className={styles.authForm} onSubmit={handleLogin}>
          <label>Email:</label>
          <input
            className={styles.authInput}
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="user@example.com"
            required
          />

          <label>Пароль:</label>
          <input
            className={styles.authInput}
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="••••••••"
            required
          />

          <button className={styles.authButton} type="submit">Войти</button>
        </form>
        
        <p className={styles.authLinkText}>
          Нет аккаунта? <Link to="/register">Зарегистрироваться</Link>
        </p>
      </div>
    </div>
  );
};

export default LoginPage;