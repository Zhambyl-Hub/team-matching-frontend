import React, { useState } from 'react';
import { registerUser } from '../services/api';

const RegisterForm = () => {
    const[email, setEmail] = useState('');
    const[password, setPassword] = useState('');

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const response = await registerUser({ email, password });
            console.log('Успешная регистрация', response.data);
        } catch (error) {
            console.log('Ошибка регистрации', error);
        }
    };

    return (
        <form onSubmit={handleSubmit}>
            <input type = "email" placeholder="Email" onChange={(e) => setEmail(e.target.value)} />
            <input type = "password" placeholder="Пароль" onChange={(e) => setPassword(e.target.value)} />
            <button type = "submit"> Зарегистрироваться </button>
        </form>
    );
};

export default RegisterForm;