import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import api, { getMyProfile, updateMyProfile } from '../services/api';
import styles from "../components/AuthForm.module.css";

const ProfilePage = () => {
  const navigate = useNavigate();

  // Состояние профиля строго под поля эндпоинта /profiles/me/ (как в документации)
  const [profile, setProfile] = useState({
    telegram_username: '',
    project_stage: '',
    employment: '',
    location: '',
    bio: '',
    portfolio_url: '',
    github_url: '',
    skills_have: [], 
    skills_want: [], 
    interests: []    
  });

  // Списки из базы данных для отображения в селектах
  const [skillsList, setSkillsList] = useState([]);
  const [interestsList, setInterestsList] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem('access_token');
    if (!token) {
      navigate('/login');
      return;
    }

    const fetchAllData = async () => {
      try {
        // Тот самый запрос навыков /api/v1/skills/ и интересов,
        // заголовки ngrok и токен уже прикрепляются через интерцепторы в api.js
        const [profileRes, skillsRes, interestsRes] = await Promise.all([
          getMyProfile(),
          api.get('/api/v1/skills/'),
          api.get('/api/v1/interests/')
        ]);

        if (profileRes.data) {
          setProfile({
            telegram_username: profileRes.data.telegram_username || '',
            project_stage: profileRes.data.stage || '', // 'stage' поле из документации
            employment: profileRes.data.commitment || '', // 'commitment' поле из документации
            location: profileRes.data.location || '',
            bio: profileRes.data.bio || '',
            portfolio_url: profileRes.data.portfolio_url || '',
            github_url: profileRes.data.github_url || '',
            skills_have: profileRes.data.skills_have || [],
            skills_want: profileRes.data.skills_want || [],
            interests: profileRes.data.interests || []
          });
        }

        setSkillsList(skillsRes.data || []);
        setInterestsList(interestsRes.data || []);

      } catch (err) {
        console.error('Ошибка загрузки данных:', err);
        if (err.response?.status === 401 || err.response?.status === 403) {
          navigate('/login');
        }
      } finally {
        setLoading(false);
      }
    };

    fetchAllData();
  }, [navigate]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setProfile(prev => ({ ...prev, [name]: value }));
  };

  // Обработчик для множественного выбора (select multiple)
  const handleSelectChange = (e) => {
    const { name, options } = e.target;
    const selectedValues = Array.from(options)
      .filter(option => option.selected)
      .map(option => Number(option.value)); // Превращаем в массив чисел (ID)

    setProfile(prev => ({ ...prev, [name]: selectedValues }));
  };

const handleSave = async (e) => {
    e.preventDefault();
    try {
      // Подготавливаем объект данных, который ожидает метод PATCH /profiles/me/
      const dataToSend = {
        telegram_username: profile.telegram_username,
        stage: profile.project_stage,
        commitment: profile.employment,
        location: profile.location,
        bio: profile.bio,
        // Отправляем только если строка не пустая, иначе null/undefined
        portfolio_url: profile.portfolio_url.trim() || null, 
        github_url: profile.github_url.trim() || null,
        skills_have: profile.skills_have,
        skills_want: profile.skills_want,
        interests: profile.interests
      };

      await updateMyProfile(dataToSend);
      alert('Профиль успешно обновлен!');
      navigate('/feed');
    } catch (err) {
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
        <select 
          className={styles.authInput} 
          name="project_stage" 
          value={profile.project_stage} 
          onChange={handleChange}
        >
          <option value="">-- Выберите стадию --</option>
          <option value="idea">Есть только идея</option>
          <option value="prototype">Прототип / MVP</option>
          <option value="traction">Есть пользователи / первые продажи</option>
          <option value="business">Работающий бизнес</option>
          <option value="looking">Пока просто ищу проект</option>
        </select>

        <label>Занятость:</label>
        <select 
          className={styles.authInput} 
          name="employment" 
          value={profile.employment} 
          onChange={handleChange}
        >
          <option value="">-- Выберите занятость --</option>
          <option value="hobby">Хобби</option>
          <option value="part_time">Part-time</option>
          <option value="full_time">Full-time</option>
        </select>

        <label>Локация (Город):</label>
        <input 
          className={styles.authInput} 
          type="text" 
          name="location" 
          value={profile.location} 
          onChange={handleChange} 
          placeholder="Ваш город"
        />

        <label>О себе (Bio):</label>
        <textarea 
          className={styles.authInput} 
          name="bio" 
          value={profile.bio} 
          onChange={handleChange} 
          placeholder="Расскажите о себе"
          rows={2}
        />

        <label>Ссылка на портфолио:</label>
        <input 
          className={styles.authInput} 
          type="text" 
          name="portfolio_url" 
          value={profile.portfolio_url} 
          onChange={handleChange} 
          placeholder="https://..."
        />

        <label>Ссылка на GitHub:</label>
        <input 
          className={styles.authInput} 
          type="text" 
          name="github_url" 
          value={profile.github_url} 
          onChange={handleChange} 
          placeholder="https://github.com/..."
        />

        {/* Выпадающие списки (множественный выбор) */}
        <label>Какие навыки есть (зажмите Ctrl/Cmd для выбора нескольких):</label>
        <select 
          className={styles.authInput} 
          name="skills_have" 
          multiple 
          value={profile.skills_have} 
          onChange={handleSelectChange}
          style={{ height: '80px' }}
        >
          {skillsList.map(s => <option key={s.id} value={s.id}>{s.name}</option>)}
        </select>

        <label>Какие навыки хотите изучить:</label>
        <select 
          className={styles.authInput} 
          name="skills_want" 
          multiple 
          value={profile.skills_want} 
          onChange={handleSelectChange}
          style={{ height: '80px' }}
        >
          {skillsList.map(s => <option key={s.id} value={s.id}>{s.name}</option>)}
        </select>

        <label>Сферы бизнеса (Интересы):</label>
        <select 
          className={styles.authInput} 
          name="interests" 
          multiple 
          value={profile.interests} 
          onChange={handleSelectChange}
          style={{ height: '80px' }}
        >
          {interestsList.map(i => <option key={i.id} value={i.id}>{i.name}</option>)}
        </select>

        <button className={styles.authButton} type="submit">Сохранить</button>
      </form>
    </div>
  );
};

export default ProfilePage;