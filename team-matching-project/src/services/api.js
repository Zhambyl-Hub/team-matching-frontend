import axios from 'axios';

const api = axios.create({
    baseURL: 'http://localhost:8000/api',
});
//функция для регистрации
export const registerUser = (UserData) => api.post('register/', userData);

export const loginUser = (UserData) => api.post('login/', userData);

export default api;
