import { Routes, Route, useNavigate } from 'react-router-dom';
import AuthForm from './components/AuthForm';
import { registerUser, loginUser } from './services/api';
import ProfilePage from './pages/ProfilePage';
import FeedPage from './pages/FeedPage';

const App = () => {
  const navigate = useNavigate();

  const handleRegister = async (email, password) => {
    try {
      await registerUser({ email, password });
      alert('Регистрация успешна!');
      navigate('/login');
    } catch {
      alert('Ошибка регистрации');
    }
  };

  const handleLogin = async (email, password) => {
    try {
      const response = await loginUser({ email, password });
      const { access } = response.data;
      localStorage.setItem('access_token', access);
      navigate('/profile');
    }
    catch {
      alert('Ошибка входа');
    }
  };

  return(
    <Routes>
      <Route path="/register" element={<AuthForm title="Регистрация" buttonText="Зарегистрироваться" onSubmit={handleRegister} linkText="Уже есть аккаунт?" linkTo="/login"/>}/>
      <Route path="/login" element={<AuthForm title="Вход" buttonText="Войти" onSubmit={handleLogin} linkText="Нет аккаунта?" linkTo="/register" />} /> 
      <Route path="/profile" element={<ProfilePage />} />
      <Route path="*" element={<AuthForm title="Регистрация" buttonText="Зарегистрироваться" onSubmit={handleRegister} linkText="Уже есть аккаунт?" linkTo="/login" />} />
      <Route path="/feed" element={<FeedPage />} />
    </Routes>
  );
};

export default App;