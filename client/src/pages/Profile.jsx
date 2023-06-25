import { useState, useContext, useEffect, useNavigate } from 'react'
import { AuthContext } from "../context/authContext";
import { Link } from 'react-router-dom';
import photo from "../img/stockProfileIMG.jpg"
import axios from 'axios';

const Profile = () => {
    const { currentUser } = useContext(AuthContext);
    const prefArray = ['Не вибрано', 'Програмування, ІТ', 'Продажі', 'Бухгалтерія'];

    useEffect(() => {
        try {
            const fetchData = async () => {
                await axios.get(`/profile/${currentUser.id}`).then((res) => {
                });
            }
            fetchData();
        } catch (error) {
            console.log(error);
        }

    });

    return (
        (<div className='profile'>
            <div className="head">
                <div className="profileImg">
                    <img className='pImage' src={photo} alt="" />
                </div>
                <h1 className='name'>{currentUser.username}</h1>
            </div>
            <div className="contact-info">
                <div className="email">
                    <label htmlFor="email">E-mail:</label>
                    <h4>{currentUser.email}</h4>
                </div>
                <div className="preferences">
                    <label htmlFor="pref">Напрямок пошуку: {prefArray[currentUser.pref]}</label>
                    {/* <select className='pref' name="prefer" id="pref" onChange={handleChange}>
                        <option value="0">Оберіть бажаний напрямок</option>
                        <option value="1">Програмування, ІТ</option>
                        <option value="2">Продажі</option>
                        <option value="3">Сфера обслуговування</option>
                    </select> */}

                </div>
            </div>
            <Link className='changeProfile' to={`/profile/edit/${currentUser.id}`}>Редагувати профіль</Link>
        </div>)
    )
}

export default Profile