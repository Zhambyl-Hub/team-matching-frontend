import axios from 'axios';

const api = axios.create({
  baseURL: 'https://stipulate-calzone-twice.ngrok-free.dev',
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('access_token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  
  // Добавляем заголовок ngrok глобально для всех запросов
  config.headers['ngrok-skip-browser-warning'] = 'true';
  
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
export const getSkills = () => {
  return api.get('/api/v1/skills/');
};

export const getInterests = () => {
  return api.get('/api/v1/interests/');
};

export const getMyProfile = () => {
  return api.get('/api/v1/profiles/me/');
};

export const updateMyProfile = (data) => {
  return api.patch('/api/v1/profiles/me/', data);
};

export const getRecommendations = () => {
  return api.get('/api/v1/profiles/recommendations/');
};

export const sendLike = (data) => {
  return api.post('/api/v1/interactions/like/', data);
};

export const getMatches = () => {
  return api.get('/api/v1/interactions/matches/');
};

export default api;