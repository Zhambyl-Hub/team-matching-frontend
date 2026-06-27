import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { registerUser } from '../services/api';
import styles from "../components/AuthForm.module.css";

const RegisterPage = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();

  const handleRegister = async (e) => {
    e.preventDefault();
    try {
      await registerUser({ email, password });
      alert('Регистрация успешна! Теперь войдите в систему.');
      navigate('/login');
    } catch (err) {
      console.error('Ошибка регистрации:', err.response?.data || err.message);
      alert('Ошибка регистрации. Проверьте данные.');
    }
  };

  return (
    <div className={styles.pageWrapper}>
      <div className={styles.authWrapper}>
        <h2>Регистрация</h2>
        <form className={styles.authForm} onSubmit={handleRegister}>
          <label>Email:</label>
          <input
            className={styles.authInput}
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="user@example.com"
            required
          />

          <label>Пароль (мин. 8 символов):</label>
          <input
            className={styles.authInput}
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="••••••••"
            required
          />

          <button className={styles.authButton} type="submit">Зарегистрироваться</button>
        </form>
        
        <p className={styles.authLinkText}>
          Уже есть аккаунт? <Link to="/login">Войти</Link>
        </p>
      </div>
    </div>
  );
};

export default RegisterPage;