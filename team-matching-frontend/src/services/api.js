import axios from 'axios';

const api = axios.create({
  baseURL: 'https://stipulate-calzone-twice.ngrok-free.dev/api/v1/', 
});

api.interceptors.request.use((config) => {
    const token = localStorage.getItem('access_token');
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
}, (error) => {
    return Promise.reject(error);
});
//Функции API для авторизации
// auth/register/ добавится к базовому пути и получится:
// https://stipulate-calzone-twice.ngrok-free.dev/api/v1/auth/register/
export const registerUser = (userData) => api.post('auth/register/', userData);
export const loginUser = (userData) => api.post('auth/login/', userData);

//Функция для справочников
export const getSkills = () => api.get('skills/');
export const getInterests = () => api.get(`interests/`);

//Функции для профиля
export const getMyProfile = () => api.get('profiles/me');
export const updateMyProfile = (data) => api.patch('profiles/me/', data);
export const getRecommendations = () => api.get('profiles/recommendations/');


//Функция взаимодействия
export const sendLike = (data) => api.post('interactions/like', data);
export const getMatches = () => api.get('interactions/matches/');

export default api;
