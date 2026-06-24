import { useState } from 'react';
import { Link } from 'react-router-dom';
import './AuthForm.css';

const AuthForm = ({ title, buttonText, onSubmit, linkText, linkTo }) => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('')
    
    return(
        <div className="auth-container">
            <h1>{title}</h1>
            <form className="auth-form" onSubmit={(e) => {e.preventDefault(); onSubmit(email, password); }}>
                <input className="auth-input" type="email" placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)} required/>
                <input className="auth-input" type="password" placeholder="Пароль" value={password} onChange={(e) => setPassword(e.target.value)} required/>
                <button className ="authobutton" type="submit">{buttonText}</button>
            </form>
            <p style ={{ marginTop: 20 }}>{linkText} <Link to={linkTo}>{linkTo === '/login' ? 'Войти' : 'Зарегистрироваться'}</Link></p>
        </div>
    );
};

export default AuthForm;