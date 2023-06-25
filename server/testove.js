const axios = require('axios');
const load = require('cheerio');
const rules =require('./rules.json');

const DEFAULT_AMOUNT_OF_PAGES = 2;
const jobsArr = ['workUA', 'jobsUA', 'dou', 'jooble'];

//GET JOBS COUNT

export async function getJobsCount(url, path) {
    let countString;

    try {
        const test = await axios.get(url)
        const $ = load(test.data);
        if ($(path).length) {
            countString = ($(path).text()).replace(/\D/g, "");
            return countString;
        }
        else return false;
    } catch (err) {
        return err;
    }
}

//CREATE URL FOR SITES

async function createURL(values, site, rules) {

    let url = '';
    switch (site) {

        //WORK UA

        case "workUA":
            url = rules.workUA.jobURL;

            if (values[2] != 'all') {
                url = `${url}-${values[2]}`;
            }

            if (values[0]) {
                url = `${url}-${values[0]}`;
            }

            url = `${url}/?advs=1`;

            if (values[1] || values[3] || values[4]) {

                if (values[1] == 1)
                    url = `${url}&employment=74`;

                if (values[1] == 2)
                    url = `${url}&employment=75`;

                if (values[3] == 1)
                    url = `${url}&experience=1`;

                if (values[4]) {

                    if (values[4] == 1)
                        url = `${url}&salaryfrom=3`;

                    if (values[4] == 2)
                        url = `${url}&salaryfrom=5`;

                    if (values[4] == 3)
                        url = `${url}&salaryfrom=7`;
                }
            }


            break;

        //JOBS UA

        case "jobsUA":
            url = rules.jobsUA.jobURL;

            if (values[2]) {

                if (values[2] == 'dnipro')
                    url = `${url}/dnepr`;

                if (values[2] == 'kyiv')
                    url = `${url}/kiev`;

                if (values[2] == 'lviv')
                    url = `${url}/lvov`;
            }

            if (values[0]) {
                url = `${url}/rabota-${values[0]}`;
            }

            if (values[1] || values[3] || values[4]) {

                url = `${url}?`;

                if (values[3] == 1)
                    url = `${url}&experience=1`;

                if (values[3] == 2)
                    url = `${url}&experience=3`;

                if (values[1] == 1)
                    url = `${url}&work_graph=1`;

                if (values[1] == 2)
                    url = `${url}&work_graph=2`;

                if (values[4]) {

                    if (values[4] == 1)
                        url = `${url}&salary=6000%2C100000`;

                    if (values[4] == 2)
                        url = `${url}&salary=10000%2C100000`;

                    if (values[4] == 3)
                        url = `${url}&salary=20000%2C100000`;
                }
            }
            break;

        //DOU

        case "dou":
            url = rules.dou.jobURL;

            if (values[2]) {

                if (values[2] == 'dnipro')
                    url = `${url}city=Дніпро`;

                if (values[2] == 'kyiv')
                    url = `${url}city=Київ`;

                if (values[2] == 'lviv')
                    url = `${url}city=Львів`;
            }

            if (values[0]) {
                url = `${url}&search=${values[0]}`;
            }

            if (values[3]) {

                if (values[3] == 1)
                    url = `${url}&exp=0-1`;

                if (values[3] == 2)
                    url = `${url}&exp=1-3`;
            }
            break;

        //JOOBLE

        case "jooble":
            url = rules.jooble.jobURL;

            if (values[1]) {

                if (values[1] == 1)
                    url = `${url}&jt=1`;

                if (values[1] == 2)
                    url = `${url}&jt=3`;
            }

            if (values[2]) {

                if (values[2] == 'dnipro')
                    url = `${url}&rgns=Дніпро`;

                if (values[2] == 'kyiv')
                    url = `${url}&rgns=Київ`;

                if (values[2] == 'lviv')
                    url = `${url}&rgns=Львів`;
            }

            if (values[4]) {

                if (values[4] == 1)
                    url = `${url}&salaryMin=6700&salaryRate=3`;

                if (values[4] == 2)
                    url = `${url}&salaryMin=8300&salaryRate=3`;

                if (values[4] == 3)
                    url = `${url}&salaryMin=17000&salaryRate=3`;
            }

            if (values[0]) {
                url = `${url}&ukw=${values[0]}`;
            }

            if (values[3]) {

                if (values[3] == 1)
                    url = `${url}&workExp=1`;
            }
            break;
    }
    return url;
}

//GET URLs FROM ALL SITES
async function createAllURLs(values, jobsArr) {
    let newArr = [];
    jobsArr.forEach((async function (job) {
        await createURL(values, job, rules).then((data) => {
            newArr.push(data);
        });
    }))
    console.log(newArr);
    return newArr
}

//GET LINK OF EACH JOB

async function getAllData($, path, ptTitle, ptLink, ptSal, ptComp, site) {
    let arr = [];

    $(path).each((i, el) => {
        arr.push({
            title: $(el).find(ptTitle).text(),
            link: site == 'workUA' ? `https://www.work.ua${$(el).find(ptLink).attr('href')}` : $(el).find(ptLink).attr('href'),
            salary: $(el).find(ptSal) ? $(el).find(ptSal).text() : "",
            company: $(el).find(ptComp).text(),
            site: site
        })

    })
    return arr;
}


//GET JOBS ID

async function getIds(url, site) {
    let newArrJobs = [];
    switch (site) {
        case 'workUA':
            await getJobsCount(url, rules.workUA.countSel).then(async function (count) {
                if (count) {
                    if (Math.ceil(count / 14) == 1) {
                        await axios
                            .get(url)
                            .then(async function ({ data }) {
                                const $ = load(data); // Initialize cheerio 
                                await getAllData($, rules.workUA.path, rules.workUA.pathTitle, rules.workUA.addPathForLinks, rules.workUA.pathSalary, rules.workUA.pathCompany, site)
                                    .then(data => {
                                        newArrJobs = data;
                                    })
                            })
                    } else {
                        for (let i = 1; i <= DEFAULT_AMOUNT_OF_PAGES; i++) {

                            await axios
                                .get(`${url}&page=${i}`)
                                .then(async function ({ data }) {
                                    const $ = load(data); // Initialize cheerio 
                                    await getAllData($, rules.workUA.path, rules.workUA.pathTitle, rules.workUA.addPathForLinks, rules.workUA.pathSalary, rules.workUA.pathCompany, site)
                                        .then(data => {
                                            newArrJobs = data;
                                        })
                                })
                        }
                    }
                }
            })

            break;


        case 'jobsUA':
            let currentUrl = '';
            await getJobsCount(url, rules.jobsUA.countSel).then(async function (count) {
                if (count) {
                    const parseURL = new URL(url);

                    if (Math.ceil(count / 20) == 1) {
                        await axios
                            .get(url)
                            .then(async function ({ data }) {
                                const $ = load(data); // Initialize cheerio 
                                await getAllData($, rules.jobsUA.path, rules.jobsUA.pathTitle, rules.jobsUA.addPathForLinks, rules.jobsUA.pathSalary, rules.jobsUA.pathCompany, site)
                                    .then(data => {
                                        newArrJobs = data;
                                    })
                            })
                    } else {
                        for (let i = 1; i <= DEFAULT_AMOUNT_OF_PAGES; i++) {
                            if (i == 1) currentUrl = url;
                            else currentUrl = `https://jobs.ua${parseURL.pathname}/page-${i}${parseURL.search}`;
                            await axios
                                .get(currentUrl)
                                .then(async function ({ data }) {
                                    const $ = load(data); // Initialize cheerio 
                                    await getAllData($, rules.jobsUA.path, rules.jobsUA.pathTitle, rules.jobsUA.addPathForLinks, rules.jobsUA.pathSalary, rules.jobsUA.pathCompany, site)
                                        .then(data => {
                                            newArrJobs = data;
                                        })
                                })
                        }
                    }


                }
            })
            break;

        case 'dou':

            await axios
                .get(`${url}`)      // GET запрос до сторінки сайту
                .then(async function ({ data }) {
                    const $ = load(data); // загрузка DOM дерева сторінки

                    //парсинг сторінки, отримання посилань на вакансії з подальшим занесенням у масив
                    await getAllData($, rules.dou.path, rules.dou.pathTitle, rules.dou.addPathForLinks, rules.dou.pathSalary, rules.dou.pathCompany, site)
                        .then(data => {
                            newArrJobs = data;
                        })

                })

            break;

        case 'jooble':

            await axios
                .get(`${url}`)
                .then(async function ({ data }) {
                    const $ = load(data); // Initialize cheerio 
                    await getAllData($, rules.jooble.path, rules.jooble.pathTitle, rules.jooble.addPathForLinks, rules.jooble.pathSalary, rules.jooble.pathCompany, site)
                        .then(data => {
                            newArrJobs = data;
                        })

                })

            break;
    }
    return newArrJobs;
}

//get array of all vacancies
async function getAllVacancies(values) {
    return await createAllURLs(values, jobsArr)
        .then(async function (url) {
            let arr = [];

            for (let index of url.keys()) {
                await getIds(url[index], jobsArr[index]).then(vac => {
                    arr.push(vac);
                })
            }

            return arr;
        })
}

export const getHome = (req, res) => {

    const q = "TRUNCATE parser";


    const values = [req.body.search, req.body.empl, req.body.city, req.body.exp, req.body.salary];

    //MAIN FUNCTION WORK

    getAllVacancies(values)
        .then(arr => {
            const q = "INSERT INTO parser(`jobTitle`,`jobSalary`,`jobLink`, `jobSite`, `jobCompany`) VALUES (?)";

            for (let vacArr of arr) {
                for (let vac of vacArr) {
                    const values = [
                        vac.title,
                        vac.salary,
                        vac.link,
                        vac.site,
                        vac.company
                    ]

                }
            }

        });

}

export const getData = (req, res) => {
    const q = "SELECT * FROM parser";

    db.query(q, (err, data) => {
        if (err) return res.status(500).send(err);
        return res.status(200).json(data);
    })
}