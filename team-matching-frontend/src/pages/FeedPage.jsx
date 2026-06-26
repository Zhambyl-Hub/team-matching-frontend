import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { getRecommendations, sendLike } from '../services/api'; 
import styles from './FeedPage.module.css';

const FeedPage = () => {
  const navigate = useNavigate();
  
  const [profiles, setProfiles] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem('access_token');
    if (!token) {
      navigate('/login');
      return;
    }

    const loadProfiles = async () => {
      try {
        const response = await getRecommendations();
        // Убедимся, что данные — это массив
        setProfiles(Array.isArray(response.data) ? response.data : []);
      } catch (error) {
        console.error('Ошибка загрузки ленты:', error);
      } finally {
        setLoading(false);
      }
    };

    loadProfiles();
  }, [navigate]);

  const handleLike = async () => {
    if (profiles.length === 0) return;
    const currentProfile = profiles[currentIndex];
    try {
      await sendLike({ to_profile: currentProfile.id });
      alert('Лайк отправлен!');
    } catch (err) {
      console.error('Ошибка лайка:', err);
    }
    nextProfile();
  };

  const handleDislike = () => {
    nextProfile();
  };

  const nextProfile = () => {
    if (currentIndex < profiles.length - 1) {
      setCurrentIndex(prev => prev + 1);
    } else {
      setCurrentIndex(profiles.length);
    }
  };

  if (loading) return <div className={styles.container}>Загрузка...</div>;

  if (profiles.length === 0 || currentIndex >= profiles.length) {
    return (
      <div className={styles.container}>
        <h2>Анкеты закончились</h2>
      </div>
    );
  }

  const currentProfile = profiles[currentIndex];

  return (
    <div className={styles.container}>
      <h1>Лента профилей</h1>
      <div className={styles.authForm}>
        <p><strong>О себе:</strong> {currentProfile.bio || '...'}</p>
        <p><strong>Стадия:</strong> {currentProfile.stage || '-'}</p>
        <p><strong>Локация:</strong> {currentProfile.location || '-'}</p>
      </div>

      <div style={{ display: 'flex', gap: '20px', marginTop: '20px' }}>
        <button className={styles.logoutButton} onClick={handleDislike}>Пропустить</button>
        <button className={styles.authButton} onClick={handleLike}>Нравится</button>
      </div>
    </div>
  );
};

export default FeedPage;