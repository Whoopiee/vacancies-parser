import React, { useContext }  from 'react';
import { Link } from 'react-router-dom';
import { AuthContext } from '../context/authContext';
import Logo from '../img/logo1.png'

const Navbar = () => {

    const { currentUser, logout } = useContext(AuthContext);

    return (
        <div className='navbar'>
            <div className="container">
                <div className="logo">
                    <Link to="/">
                        <img src={Logo}></img>
                    </Link>
                </div>
                <div className="links">
                <Link className='Nlink' to="/">
                        <h6>Головна</h6>
                    </Link>
                    <Link className='Nlink' to="/analytics">
                        <h6>Аналітика</h6>
                    </Link>
                    {currentUser ? (<Link className='Nlink' to={`/profile/${currentUser.id}`}><span className='user'>{ currentUser.username}</span></Link>) : <h1></h1>}
                    {currentUser ? (<Link className='Nlink' to="/" ><h6 onClick={logout}>Вихід</h6></Link>) : <Link className='Nlink' to="/login"><h6>Вхід</h6></Link>}
                </div>
            </div>
        </div>
    )
}

export default Navbar