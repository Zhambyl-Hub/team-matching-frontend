import React from "react";
import {Link} from "react-router-dom";

const FeedPage = () => {
    return(
        <div>
            <h1>MatchHub</h1>
            <p>Здесь будут карточки кофаундеров для нашего хаба.</p>
            <p><Link to="/profile">Настроить свой профиль</Link></p>
        </div>
    );
};

export default FeedPage;