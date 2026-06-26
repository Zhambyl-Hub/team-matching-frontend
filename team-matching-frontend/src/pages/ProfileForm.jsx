import { useState } from "react";

const ProfileForm = () => {
    const [formData, setFormData] = useState ({
        fullName: '',
        bio: '',
        stage: '',
    });

    const handleChange = (e) => {
        setFormData ({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        console.log('Данные профиля для отправки', formData);
        //тут вызов API,когда бэк сделает эндроинт
    };

    return (
        <form onSubmit={handleSubmit}>
            <input
            name="fullName"
            placeholder="ФИО"
            onChange={handleChange}
            />
            <textarea
            name="bio"
            placeholder="О себе"
            onChange={handleChange}
            />
            <select name="stage" onChange={handleChange}>
            <option value="idea">Идея</option>
            <option value="prototype">Прототип</option>
            <option value="business">Бизнес</option>
            </select>
            <button type="submit">Сохранить профиль</button>
            </form>
    );
};

export default ProfileForm;