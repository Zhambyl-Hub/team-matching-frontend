import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { getSkills, getInterests, getMyProfile, updateMyProfile } from '../services/api';
import styles from './ProfilePage.module.css'; // Импорт модуля стилей

const ProfilePage = () => {
  const navigate = useNavigate();
  const [profile, setProfile] = useState({ /* ... твой стейт ... */ });
  // ... (весь остальной логический код остается прежним)

  return (
    <div className={styles.container}>
      <h1>Настройка профиля</h1>
      <button className={styles.logoutButton} onClick={handleLogout}>Выйти</button>
      
      <form className={styles.form} onSubmit={handleSubmit}>
        <label>О себе:</label>
        <textarea className={styles.input} name="bio" value={profile.bio} onChange={handleChange} rows="3" />

        <label>Ссылка на портфолио:</label>
        <input className={styles.input} type="text" name="portfolio_url" value={profile.portfolio_url} onChange={handleChange} />

        {/* Замени остальные className={styles.input} аналогично */}
        
        <button className={styles.button} type="submit">Сохранить</button>
      </form>
    </div>
  );
};

export default ProfilePage;