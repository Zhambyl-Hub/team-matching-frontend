import { useState } from 'react';
import { Link } from 'react-router-dom';
import styles from './AuthForm.module.css';

const AuthForm = ({ title, buttonText, onSubmit, linkText, linkTo }) => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    
    return(
        <div className={styles.authContainer}>
            <h1>{title}</h1>
            <form className={styles.authForm} onSubmit={(e) => {e.preventDefault(); onSubmit(email, password); }}>
                <input className={styles.authInput} type="email" placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)} required/>
                <input className={styles.authInput} type="password" placeholder="Пароль" value={password} onChange={(e) => setPassword(e.target.value)} required/>
                <button className={styles.authButton} type="submit">{buttonText}</button>
            </form>
            <p style ={{ marginTop: 20 }}>{linkText} <Link to={linkTo}>{linkTo === '/login' ? 'Войти' : 'Зарегистрироваться'}</Link></p>
        </div>
    );
};

export default AuthForm;