import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';

const Register = () => {

    const EMAIL_REGEX = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    const [inputs, setInputs] = useState({
        username: "",
        email: "",
        password: "",
        pref: 0
    })

    const [err, setError] = useState(null)
    const navigate = useNavigate();

    const handleChange = e => {
        setInputs(prev => ({ ...prev, [e.target.name]: e.target.value }));
    }

    const handleSubmit = async e => {
        e.preventDefault()
        try {
            if (!inputs.username) throw new Error('Поле Логін пусте!');
            if (!inputs.email) throw new Error('Поле Пошта пусте!');
            if (!inputs.password) throw new Error('Поле Пароль пусте!');
            if(!EMAIL_REGEX.test(inputs.email)) throw new Error('Некоректна пошта!');
            await axios.post("/auth/register", inputs);
            navigate("/login");
        } catch (err) {
            if (err.response) {
                setError(err.response.data);
            }
            else if (err.request) {
                setError(err.request.data);
            }
            else {
                setError(err.message);
            }
        }
    }

    return (
        <div className='auth'>
            <h1>Реєстрація</h1>
            <form>
                <input required type="text" placeholder='Логін' name='username' onChange={handleChange} />
                <input required type="email" placeholder='Пошта' name='email' onChange={handleChange} />
                <input required type="password" placeholder='Пароль' name='password' onChange={handleChange} />
                <button onClick={handleSubmit}>Зареєструватися</button>
                {err && <p>{err}</p>}
                <span>Вже є аккаунт? <Link to="/login">Вхід</Link></span>
            </form>
            <Link to={"/"}><button className='exitFromForm'>На головну</button></Link>
        </div>
    )
}

export default Register