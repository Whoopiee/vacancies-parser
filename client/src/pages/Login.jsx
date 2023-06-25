import React, { useState, useContext }  from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { AuthContext } from '../context/authContext';

const Login = () => {

    const [inputs, setInputs] = useState({
        username:"",
        password:""
    })
    
    const [err, setError] = useState(null)
    const navigate = useNavigate();
    
    const {login} = useContext(AuthContext);

    const handleChange = e => {
        setInputs(prev => ({...prev, [e.target.name]: e.target.value}));
    }

    const handleSubmit = async e => {
        e.preventDefault()
        try {
            if (!inputs.username) throw new Error('Поле Логін пусте!');
            if (!inputs.password) throw new Error('Поле Пароль пусте!');
            await login(inputs); 
            navigate("/");
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
            <h1>Вхід</h1>
            <form>
                <input required type="text" placeholder='Логін' name='username' onChange={handleChange}/>
                <input required type="password" placeholder='Пароль' name='password' onChange={handleChange}/>
                <button onClick={handleSubmit}>Вхід</button>
                {err && <p>{err}</p>}
                <span>Немає аккаунту? <Link to="/register">Зареєструватися</Link></span>
            </form>
            <Link to={"/"}><button className='exitFromForm'>На головну</button></Link>
        </div>
    )
}

export default Login