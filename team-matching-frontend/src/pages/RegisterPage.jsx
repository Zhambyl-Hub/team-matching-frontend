import { Link } from "react-router-dom";

const RegisterPage = () => {
    return(
        <div>
            <h1>Регистрация</h1>
           {/*Здесь будет форма регистрации*/}
           <p>Уже есть аккаунт? <Link to="/login">Войти</Link> </p>
           <p><Link to="/profile">Перейти в профиль</Link></p>
        </div>
    );
};
export default RegisterPage;