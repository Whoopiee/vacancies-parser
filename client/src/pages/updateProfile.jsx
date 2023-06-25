import { useState, useContext, useEffect } from 'react'
import { AuthContext } from "../context/authContext";
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';

const UpdateProfile = () => {
    const EMAIL_REGEX = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    const { currentUser, change } = useContext(AuthContext);
    const [error, setError] = useState(null);
    const navigate = useNavigate();
    const [inputs, setInputs] = useState({
        id: currentUser.id,
        username: currentUser.username,
        email: currentUser.email,
        pref: currentUser.pref
    })

    const handleChange = e => {
        setInputs(prev => ({ ...prev, [e.target.name]: e.target.value }));
    }

    const handleSubmit = async e => {
        e.preventDefault();
        try {
            if (inputs.email != currentUser.email) {
                if(!EMAIL_REGEX.test(inputs.email))throw new Error("Некоректна пошта!");
            }
            await axios.post(`/profile/edit/${currentUser.id}`, [inputs, currentUser]);
            change(currentUser.id);
            navigate(`/profile/${currentUser.id}`)
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
        (<div className='updateForm'>
            <form className='uForm'>
                <ul>
                    <li>
                        <label htmlFor="username">Ім'я користувача: </label>
                        <input name="username" type="text" placeholder={currentUser.username} onChange={handleChange} />
                    </li>
                    <li>
                        <label htmlFor="email">Електронна пошта: </label>
                        <input name="email" type="text" placeholder={currentUser.email} onChange={handleChange} />
                    </li>
                    <li>
                        <label htmlFor="pref">Напрямок пошуку: </label>
                        <select className='pref' name="pref" id="pref" onChange={handleChange}>
                            <option value="0" selected={currentUser.pref == 0} >Оберіть бажаний напрямок</option>
                            <option value="1" selected={currentUser.pref == 1}>Програмування, ІТ</option>
                            <option value="2" selected={currentUser.pref == 2}>Продажі</option>
                            <option value="3" selected={currentUser.pref == 3}>Бухгалтерія</option>
                        </select>
                    </li>
                </ul>
                {error && <p>{error}</p>}
                <button className='uSubmit' onClick={handleSubmit}>Зберегти</button>
            </form>
        </div>)
    )
}

export default UpdateProfile