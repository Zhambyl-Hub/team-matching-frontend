import axios from 'axios';

const api = axios.create({
  // Базовый URL заканчивается на слэш, без /api/v1/
  baseURL: 'https://stipulate-calzone-twice.ngrok-free.dev',
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('access_token'); // Ключ должен точно совпадать с тем, что вы пишите при логине!
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Функции авторизации и регистрации
export const loginUser = (credentials) => {
  return api.post('/api/v1/auth/login/', credentials);
};

export const registerUser = (userData) => {
  return api.post('/api/v1/auth/register/', userData);
};

// Остальные функции
export const getSkills = async () => {
  try {
    const response = await api.get('/api/v1/skills', {
      headers: { 
        'ngrok-skip-browser-warning': 'true' 
      }
    });
    return response.data; // Возвращаем данные из запроса
  } catch (error) {
    console.error("Ошибка при получении навыков:", error);
    throw error;
  }
};

export const getInterests = () => api.get('/api/v1/interests/');
export const getMyProfile = () => api.get('/api/v1/profiles/me/');
export const updateMyProfile = (data) => api.patch('/api/v1/profiles/me/', data);
export const getRecommendations = () => api.get('/api/v1/profiles/recommendations/');
export const sendLike = (data) => api.post('/api/v1/interactions/like/', data);
export const getMatches = () => api.get('/api/v1/interactions/matches/');

export default api;