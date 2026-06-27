import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { getRecommendations, sendLike, getSkills, getInterests } from '../services/api';
import styles from "../components/AuthForm.module.css"; // Используем те же стили для единообразия

const FeedPage = () => {
  const navigate = useNavigate();
  const [profiles, setProfiles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Для отображения названий навыков и интересов, если они приходят как ID
  const [skillsDict, setSkillsDict] = useState({});
  const [interestsDict, setInterestsDict] = useState({});

  useEffect(() => {
    const token = localStorage.getItem('access_token');
    if (!token) {
      navigate('/login');
      return;
    }

    const loadFeedData = async () => {
      try {
        // Загружаем рекомендации и справочники для отображения текстовых названий вместо ID
        const [recResponse, skillsResponse, interestsResponse] = await Promise.all([
          getRecommendations(),
          getSkills(),
          getInterests()
        ]);

        // Форматируем справочники в удобный объект вида { 1: "Python", 2: "React" }
        const skillsMap = {};
        if (Array.isArray(skillsResponse?.data)) {
          skillsResponse.data.forEach(s => { skillsMap[s.id] = s.name; });
        }
        setSkillsDict(skillsMap);

        const interestsMap = {};
        if (Array.isArray(interestsResponse?.data)) {
          interestsResponse.data.forEach(i => { interestsMap[i.id] = i.name; });
        }
        setInterestsDict(interestsMap);

        setProfiles(recResponse.data || []);
      } catch (err) {
        console.error('Ошибка загрузки ленты:', err);
        setError('Не удалось загрузить ленту рекомендаций.');
        if (err.response?.status === 401 || err.response?.status === 403) {
          navigate('/login');
        }
      } finally {
        setLoading(false);
      }
    };

    loadFeedData();
  }, [navigate]);

  const handleLike = async (to_profile_id) => {
    try {
      const response = await sendLike({ to_profile: to_profile_id });
      
      if (response.data?.is_match) {
        alert('🎉 Взаимный мэтч! Теперь вам доступны контакты пользователя.');
      } else {
        alert('Интерес успешно зафиксирован!');
      }

      // Удаляем профиль из текущей ленты после лайка, чтобы перейти к следующему
      setProfiles(prevProfiles => prevProfiles.filter(p => p.id !== to_profile_id));
    } catch (err) {
      console.error('Ошибка при отправке лайка:', err);
      alert('Не удалось отправить лайк. Попробуйте снова.');
    }
  };

  const handleGoToMatches = () => {
    navigate('/matches'); // Переход на страницу матчей
  };

  const handleGoToProfile = () => {
    navigate('/profile'); // Переход к настройке профиля
  };

  if (loading) return <div className={styles.container}>Загрузка ленты...</div>;

  return (
    <div className={styles.container}>
      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '20px' }}>
        <button className={styles.logoutButton} onClick={handleGoToProfile}>Настройка профиля</button>
        <button className={styles.authButton} onClick={handleGoToMatches} style={{ width: 'auto', padding: '0 15px' }}>Мои Мэтчи</button>
      </div>

      <h2>Лента совпадений</h2>

      {error && <p style={{ color: 'red' }}>{error}</p>}

      {profiles.length === 0 ? (
        <p>Пока нет новых рекомендаций. Попробуйте обновить страницу позже или изменить интересы.</p>
      ) : (
        <div className="cards-grid" style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
          {profiles.map((profile) => (
            <div key={profile.id} className={styles.card}>
              <h3>Пользователь #{profile.id}</h3>
              <p><strong>О себе:</strong> {profile.bio || 'Информация отсутствует'}</p>
              <p><strong>Локация:</strong> {profile.location || 'Не указана'}</p>
              <p><strong>Стадия проекта:</strong> {profile.stage || 'Не указана'}</p>
              <p><strong>Занятость:</strong> {profile.commitment || 'Не указана'}</p>
              
              <p><strong>Навыки:</strong> {profile.skills_have && profile.skills_have.length > 0 
                ? profile.skills_have.map(id => skillsDict[id] || id).join(', ') 
                : 'Не указаны'}
              </p>

              <p><strong>Хочет изучить:</strong> {profile.skills_want && profile.skills_want.length > 0 
                ? profile.skills_want.map(id => skillsDict[id] || id).join(', ') 
                : 'Не указаны'}
              </p>

              <p><strong>Интересы:</strong> {profile.interests && profile.interests.length > 0 
                ? profile.interests.map(id => interestsDict[id] || id).join(', ') 
                : 'Не указаны'}
              </p>

              {profile.portfolio_url && (
                <p><strong>Портфолио:</strong> <a href={profile.portfolio_url} target="_blank" rel="noreferrer">{profile.portfolio_url}</a></p>
              )}
              
              {profile.github_url && (
                <p><strong>GitHub:</strong> <a href={profile.github_url} target="_blank" rel="noreferrer">{profile.github_url}</a></p>
              )}

              {/* Кнопка лайка, скрывающаяся/отображающаяся при действии */}
              <button 
                className={styles.authButton} 
                onClick={() => handleLike(profile.id)}
                style={{ marginTop: '15px', backgroundColor: '#4CAF50', borderColor: '#4CAF50' }}
              >
                Лайк (Интересно)
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default FeedPage;