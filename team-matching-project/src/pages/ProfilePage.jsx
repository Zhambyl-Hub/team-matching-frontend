import React from "react";
import {Link} from "react-router-dom";

const ProfilePage = () => {
    return(
        <div>
            <h1>Настройка профиля</h1>
            <p>Заполни свои данные для матчинга в хабе.</p>
            <p><Link to="/">На главную ленту(лента совпадений)</Link></p>
        </div>
    );
};

export default ProfilePage;