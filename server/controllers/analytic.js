import { db } from "../connectMySQL.js";
import rules from "../rules.json" assert { type: "json" };
import { load } from 'cheerio';
import axios from "axios";

const sitesRegions = {
    workUA: {
        dnipro: "dnipro",
        lviv: "lviv",
        kyiv: "kyiv"
    },
    dou: {
        dnipro: "Дніпро",
        lviv: "Львів",
        kyiv: "Київ"
    },
    jobsUA: {
        dnipro: "dnepr",
        lviv: "lvov",
        kyiv: "kiev"
    },
    jooble: {
        dnipro: "Дніпро",
        lviv: "Львів",
        kyiv: "Київ"
    }
}

async function getJobsCount(url, path) {
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

const urlOfSiteRegion = (site, city, rules) => {
    let outURL = '';

    switch (site) {
        case "workUA":
            outURL = `${rules.workUA.jobURL}-${sitesRegions.workUA[city]}`
            break;

        case "dou":
            outURL = `${rules.dou.jobURL}city=${sitesRegions.dou[city]}`
            break;

        case "jobsUA":
            outURL = `${rules.jobsUA.jobURL}/${sitesRegions.jobsUA[city]}`
            break;

        case "jooble":
            outURL = `${rules.jooble.jobURL}rgns=${sitesRegions.jooble[city]}`
            break;
    }

    return outURL;
}

async function countDownJobs(rules) {
    const cities = ['dnipro', 'kyiv', 'lviv'];
    const sites = ['workUA', 'dou', 'jobsUA', 'jooble'];
    let currValues = [];
    let globValues = [];

    for (let site of sites) {
        currValues = [site];
        for (let city of cities) {
            await getJobsCount(urlOfSiteRegion(site, city, rules), rules[site].countSel)
                .then(data => {
                    currValues.push(data);
                })
        }
        globValues.push(currValues);
    }
    return globValues;
}

 async function setAnalytics() {
    const q2 = 'INSERT INTO `jobhub`.`analytics` (`site`, `amountDnipro`, `amountKyiv`, `amountLviv`) VALUES (?)'

    try {

        await countDownJobs(rules).then(data => {
            for (let row of data) {
                db.query(q2, [row], (err) => {
                    if (err) return err;
                })
            }
            return ('success')
        });
    } catch (error) {
        return (error)
    }
}

export async function getAnalytics(req, res) {
   
    const q1 = "TRUNCATE analytics";
    db.query(q1, async function(err) {
        if (err) return res.status(500).send(err);
    })

        await setAnalytics().then(() => {
            const q2 = "SELECT * FROM analytics";
    
            db.query(q2, (err, data) => {
                if (err) return res.status(500).send(err);
                let uniqueObjArray = [
                    ...new Map(data.map((item) => [item["site"], item])).values(),
                ];
                return res.status(200).json(uniqueObjArray);
            })
    })






}