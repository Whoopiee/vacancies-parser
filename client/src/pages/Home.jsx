import React, { useContext, useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import workUA from "../img/workua.png";
import dou from "../img/dou.png";
import jobsUA from "../img/jobsUA.png";
import jooble from "../img/jooble.png"
import axios from 'axios';
import Spinner from 'react-bootstrap/Spinner';
import 'bootstrap/dist/css/bootstrap.css';
import { AuthContext } from "../context/authContext";
import BackToTopButton from '../components/BackToTopButton';

const Home = () => {

    const sitesWithImg = {
        workUA,
        dou,
        jobsUA,
        jooble
    }

    const [inputs, setInputs] = useState({
        search: "",
        empl: 0,
        city: 'all',
        exp: 0,
        salary: 0,
    })

    const [jobs, setJobs] = useState([]);
    const [loading, setLoading] = useState(false);
    const { currentUser } = useContext(AuthContext);
    const [firstSearch, setFSearch] = useState(true);

    const fetchData = async () => {
        setLoading(true);
        try {
            if(firstSearch && currentUser && currentUser.pref != 0) {
                switch(currentUser.pref) {
                    case 1:
                        inputs.search = 'Програміст';
                        await axios.post("/jobs", inputs).then(async () => {
                            await axios.get("/jobs").then((res) => {
                                inputs.search = '';
                                setJobs(res.data);
                                setFSearch(false);
                            });
                        });
                    break;
                    case 2:
                        inputs.search = 'Продажі';
                        await axios.post("/jobs", inputs).then(async () => {
                            await axios.get("/jobs").then((res) => {
                                inputs.search = '';
                                setJobs(res.data);
                                setFSearch(false);
                            });
                        });
                    break;
                    case 3:
                        inputs.search = 'Бухгалтер';
                        await axios.post("/jobs", inputs).then(async () => {
                            await axios.get("/jobs").then((res) => {
                                inputs.search = '';
                                setJobs(res.data);
                                setFSearch(false);
                            });
                        });
                    break;
                }

            } else {
                await axios.post("/jobs", inputs).then(async () => {
                    await axios.get("/jobs").then((res) => {
                        setJobs(res.data);
                    });
                });
            }
            
        } catch (err) {
            console.log(err);
        } finally {
            setLoading(false);
        }
    }

    useEffect(() => {
        fetchData();
    }, []);

    const handleChange = e => {
        setInputs(prev => ({ ...prev, [e.target.name]: e.target.value }))
    }

    const handleSubmit = async e => {
        setLoading(true);
        e.preventDefault();
        try {
            await axios.post("/jobs", inputs).then(async () => {
                await axios.get("/jobs").then((res) => {
                    setJobs(res.data);
                });
            });

        } catch (err) {
            console.error(err.response.data);
        } finally {
            setLoading(false);
        }
    }

    return (
        <div className='Homepage'>
            <div className="column">
                <div className="searchForm">
                    <form className='formInput'>
                        <h1 className='title'>Фільтри</h1>
                        <input required type="text" name="search" id="inText" placeholder='Яку вакансію ви шукаєте?' onChange={handleChange} />
                        <ul>
                            <div className="filters">
                                <div className="filter">
                                    <li>
                                        <h3>Зайнятість</h3>
                                    </li>
                                    <li>
                                        <input required type="radio" value={0} defaultChecked name="empl" id="None" onChange={handleChange} />
                                        <label className='container' htmlFor="None">Будь-яка</label>
                                    </li>
                                    <li>
                                        <input required type="radio" value={1} name="empl" id="fullTime" onChange={handleChange} />
                                        <label className='container' htmlFor="fullTime">Повна</label>
                                    </li>
                                    <li>
                                        <input required type="radio" value={2} name="empl" id="partTime" onChange={handleChange} />
                                        <label className='container' htmlFor="partTime">Неповна</label>
                                    </li>
                                </div>
                                <div className="filter">
                                    <li>
                                        <h3>Місто</h3>
                                    </li>
                                    <li>
                                        <div className="select-dropdown">
                                            <select className='city' name="city" id="city" onChange={handleChange}>
                                                <option value="all">Вся Україна</option>
                                                <option value="dnipro">Дніпро</option>
                                                <option value="kyiv">Київ</option>
                                                <option value="lviv">Львів</option>
                                            </select>
                                        </div>
                                    </li>
                                </div>
                                <div className="filter">

                                    <li>
                                        <h3>Досвід</h3>
                                    </li>
                                    <li>
                                        <input required type="radio" name="exp" id="wExpW" value={0} defaultChecked onChange={handleChange} />
                                        <label className='container' htmlFor="wExpW">Будь-який</label>
                                    </li>
                                    <li>
                                        <input required type="radio" name="exp" id="wExpN" value={1} onChange={handleChange} />
                                        <label className='container' htmlFor="wExpN">Без досвіду</label>
                                    </li>
                                    <li>
                                        <input required type="radio" name="exp" id="wExpY" value={2} onChange={handleChange} />
                                        <label className='container' htmlFor="wExpY">Більше року</label>
                                    </li>
                                </div>
                                <div className="filter">
                                    <li>
                                        <h3>Зарплата</h3>
                                    </li>
                                    <li>
                                        <input required type="radio" name="salary" id="salaryN" defaultChecked value={0} onChange={handleChange} />
                                        <label className='container' htmlFor="salaryN">Будь-яка</label>
                                    </li>
                                    <li>
                                        <input required type="radio" name="salary" id="salaryS" value={1} onChange={handleChange} />
                                        <label className='container' htmlFor="salaryS">Від 6000 ₴</label>
                                    </li>
                                    <li>
                                        <input required type="radio" name="salary" id="salaryT" value={2} onChange={handleChange} />
                                        <label className='container' htmlFor="salaryT">Від 10000 ₴</label>
                                    </li>
                                    <li>
                                        <input required type="radio" name="salary" id="salaryTW" value={3} onChange={handleChange} />
                                        <label className='container' htmlFor="salaryTW">Від 20000 ₴</label>
                                    </li>
                                </div>
                            </div>
                            <li>
                                <button onClick={handleSubmit}>Пошук</button>
                            </li>
                        </ul>
                    </form>
                </div>
            </div>
            <div className="column">
                <div className="matchedJobs">
                    {loading 
                    ? <div className="loadingDivHome"><Spinner animation="border" variant="success"><span className="visually-hidden">Loading...</span></Spinner></div> 
                    : (jobs.length>0
                        ? jobs.map(job => (
                                <Link className='link' to={job.jobLink} target='_blank'>
                                    <div className="job" key={job.id}>
                                        <div className="content">
                                            <h1>{job.jobTitle}</h1>
                                            <p className='boldfont'>{job.jobSalary}</p>
                                            <p className='boldfont'>{job.jobCompany}</p>
                                            <p>{job.jobDesc}</p>
                                        </div>

                                        <div className="dimg">
                                            <Link className='link'>
                                                <img src={sitesWithImg[job.jobSite]} alt="" />
                                            </Link>
                                        </div>
                                    </div>
                                </Link>
                            ))
                            : <p className='pStatus'>Не знайдено підходящих вакансій</p>
                        )
                    
                    }
                         
                </div>
                
            </div>
            <BackToTopButton/>
        </div >
    )
}

export default Home