import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import api, { getSkills, getInterests } from '../services/api';
import styles from "../components/AuthForm.module.css";

const MatchesPage = () => {
  const navigate = useNavigate();
  const [matches, setMatches] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [skillsDict, setSkillsDict] = useState({});
  const [interestsDict, setInterestsDict] = useState({});

  useEffect(() => {
    const token = localStorage.getItem('access_token');
    if (!token) {
      navigate('/login');
      return;
    }

    const fetchMatchesData = async () => {
      try {
        const [matchesRes, skillsRes, interestsRes] = await Promise.all([
          api.get('/api/v1/interactions/matches/'),
          getSkills(),
          getInterests()
        ]);

        const skillsMap = {};
        if (Array.isArray(skillsRes?.data)) {
          skillsRes.data.forEach(s => { skillsMap[s.id] = s.name; });
        }
        setSkillsDict(skillsMap);

        const interestsMap = {};
        if (Array.isArray(interestsRes?.data)) {
          interestsRes.data.forEach(i => { interestsMap[i.id] = i.name; });
        }
        setInterestsDict(interestsMap);

        setMatches(matchesRes.data || []);
      } catch (err) {
        console.error('Ошибка загрузки мэтчей:', err);
        setError('Не удалось загрузить список мэтчей.');
        if (err.response?.status === 401 || err.response?.status === 403) {
          navigate('/login');
        }
      } finally {
        setLoading(false);
      }
    };

    fetchMatchesData();
  }, [navigate]);

  const handleCopyTelegram = (username) => {
    if (!username) return;
    navigator.clipboard.writeText(username);
    alert(`Имя пользователя ${username} скопировано в буфер обмена!`);
  };

  if (loading) return <div className={styles.container}>Загрузка мэтчей...</div>;

  return (
    <div className={styles.container}>
      <div className={styles.card} style={{ flexDirection: 'row', justifyContent: 'space-between', marginBottom: '20px' }}>
        <button className={styles.logoutButton} onClick={() => navigate('/feed')} style={{ marginBottom: 0 }}>Назад в ленту</button>
        <button className={styles.authButton} onClick={() => navigate('/profile')} style={{ width: 'auto', padding: '0 15px', marginTop: 0 }}>Настройки профиля</button>
      </div>

      <h2>🎉 Ваши Взаимные Мэтчи</h2>
      <p>Здесь открываются контакты тех, кому вы тоже интересны.</p>

      {error && <p style={{ color: 'red' }}>{error}</p>}

      {matches.length === 0 ? (
        <p>Пока нет взаимных совпадений. Продолжайте ставить лайки в ленте!</p>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '20px', marginTop: '20px' }}>
          {matches.map((match) => {
            const partner = match.partner_profile;
            if (!partner) return null;

            return (
              <div key={match.id} className={`${styles.card} ${styles.matchCardBorder}`}>
                <h3>Совпадение с: {partner.email}</h3>
                <p><strong>О себе:</strong> {partner.bio || 'Информация отсутствует'}</p>
                <p><strong>Локация:</strong> {partner.location || 'Не указана'}</p>
                <p><strong>Стадия проекта:</strong> {partner.stage || 'Не указана'}</p>
                <p><strong>Занятость:</strong> {partner.commitment || 'Не указана'}</p>

                <p><strong>Навыки:</strong> {partner.skills_have && partner.skills_have.length > 0 
                  ? partner.skills_have.map(id => skillsDict[id] || id).join(', ') 
                  : 'Не указаны'}
                </p>

                <p><strong>Интересы:</strong> {partner.interests && partner.interests.length > 0 
                  ? partner.interests.map(id => interestsDict[id] || id).join(', ') 
                  : 'Не указаны'}
                </p>

                {partner.telegram_username && (
                  <div className={styles.telegramBox}>
                    <p><strong>Telegram для связи:</strong></p>
                    <p className={styles.telegramText}>
                      {partner.telegram_username}
                    </p>
                    <div className={styles.telegramLinks}>
                      <a 
                        href={`https://t.me/${partner.telegram_username.replace('@', '')}`} 
                        target="_blank" 
                        rel="noreferrer"
                        className={styles.telegramLink}
                      >
                        Написать в Telegram
                      </a>
                      <button 
                        className={styles.authButton} 
                        onClick={() => handleCopyTelegram(partner.telegram_username)}
                        style={{ width: 'auto', padding: '5px 15px', fontSize: '14px', marginTop: 0 }}
                      >
                        Скопировать @username
                      </button>
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default MatchesPage;