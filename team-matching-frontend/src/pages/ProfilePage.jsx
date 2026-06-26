import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import api, { getInterests, getMyProfile, getSkills, updateMyProfile } from '../services/api';
import styles from "../components/AuthForm.module.css";

const ProfilePage = () => {
  const navigate = useNavigate();

  const [profile, setProfile] = useState({
    telegram_username: '',
    project_stage: '',
    employment: '',
    location: '',
    skills: '',            // Теперь это строка, куда пользователь сам вписывает навыки
    interests: '',         // Теперь это строка для интересов
    want_to_learn: ''      // Навыки для изучения
  });

  const [loading, setLoading] = useState(true);

  useEffect(() => {
   const skillsFetch = async ()=>{
    const res = await api.get("/api/v1/skills",{
        withCredentials:false,
        headers: { 'ngrok-skip-browser-warning': 'true' }
    })
    console.log(res)
   }
   skillsFetch()
    const token = localStorage.getItem('access_token');
    if (!token) {
      navigate('/login');
      return;
    }

    const fetchProfile = async () => {
      try {
        const response = await getMyProfile();
        if (response.data) {
          setProfile({
            telegram_username: response.data.telegram_username || '',
            project_stage: response.data.project_stage || '',
            employment: response.data.employment || '',
            location: response.data.location || '',
            // Если бэкенд возвращает массивы или списки, преобразуем их обратно в удобную для ввода строку
            skills: Array.isArray(response.data.skills) ? response.data.skills.join(', ') : response.data.skills || '',
            interests: Array.isArray(response.data.interests) ? response.data.interests.join(', ') : response.data.interests || '',
            want_to_learn: Array.isArray(response.data.want_to_learn) ? response.data.want_to_learn.join(', ') : response.data.want_to_learn || ''
          });
        }
      } catch (err) {
        console.error('Ошибка загрузки профиля:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, [navigate]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setProfile(prev => ({ ...prev, [name]: value }));
  };

const handleSave = async (e) => {
    e.preventDefault();
    try {
      const dataToSend = {
        ...profile,
        skills: profile.skills.split(',').map(s => s.trim()).filter(Boolean),
        interests: profile.interests.split(',').map(i => i.trim()).filter(Boolean),
        want_to_learn: profile.want_to_learn.split(',').map(w => w.trim()).filter(Boolean)
      };

      await updateMyProfile(dataToSend);
      alert('Профиль успешно обновлен!');
      navigate('/feed');
    } catch (err) {
      // ВЫВОДИМ ПОДРОБНУЮ ОШИБКУ
      console.error('Детали ошибки:', err.response?.data || err.message);
      alert('Ошибка: ' + JSON.stringify(err.response?.data || 'Проверьте консоль'));
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('access_token');
    navigate('/login');
  };

  if (loading) return <div className={styles.container}>Загрузка профиля...</div>;

  return (
    <div className={styles.container}>
      <button className={styles.logoutButton} onClick={handleLogout}>Выйти</button>
      
      <h2>Настройка профиля</h2>

      <form className={styles.authForm} onSubmit={handleSave}>
        <label>Telegram (username):</label>
        <input 
          className={styles.authInput} 
          type="text" 
          name="telegram_username" 
          value={profile.telegram_username} 
          onChange={handleChange} 
          placeholder="@username"
        />

        <label>Стадия проекта:</label>
        <input 
          className={styles.authInput} 
          type="text" 
          name="project_stage" 
          value={profile.project_stage} 
          onChange={handleChange} 
          placeholder="Например: Есть идея, Прототип..."
        />

        <label>Занятость:</label>
        <input 
          className={styles.authInput} 
          type="text" 
          name="employment" 
          value={profile.employment} 
          onChange={handleChange} 
          placeholder="Например: Full-time, Part-time..."
        />

        <label>Локация (Город):</label>
        <input 
          className={styles.authInput} 
          type="text" 
          name="location" 
          value={profile.location} 
          onChange={handleChange} 
          placeholder="Ваш город"
        />

        <label>Какие навыки есть (перечислите через запятую):</label>
        <textarea 
          className={styles.authInput} 
          name="skills" 
          value={profile.skills} 
          onChange={handleChange} 
          placeholder="Например: React, Python, Django, Figma"
          rows={3}
        />

        <label>Какие навыки хотите изучить (через запятую):</label>
        <textarea 
          className={styles.authInput} 
          name="want_to_learn" 
          value={profile.want_to_learn} 
          onChange={handleChange} 
          placeholder="Например: Go, Docker, Analytics"
          rows={3}
        />

        <label>Сферы бизнеса / Интересы (через запятую):</label>
        <textarea 
          className={styles.authInput} 
          name="interests" 
          value={profile.interests} 
          onChange={handleChange} 
          placeholder="Например: FinTech, EdTech, AI"
          rows={3}
        />

        <button className={styles.authButton} type="submit">Сохранить</button>
      </form>
    </div>
  );
};

export default ProfilePage;