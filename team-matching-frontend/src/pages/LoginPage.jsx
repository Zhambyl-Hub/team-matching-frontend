import { Link } from "react-router-dom";

const LoginPage = () => {
    return(
        <div>
            <h1>Вход</h1>
            <p>Нет аккаунта? <Link to="/register">Зарегистрироваться</Link></p>
        </div>
    );
};

export default LoginPage;