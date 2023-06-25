import React, { useState, useEffect } from 'react';
import { Chart, ArcElement, Tooltip, Legend, CategoryScale, LinearScale, BarController, BarElement } from "chart.js";
import { Bar } from "react-chartjs-2";
import axios from 'axios';
import Spinner from 'react-bootstrap/Spinner';
import 'bootstrap/dist/css/bootstrap.css';

Chart.register(ArcElement, Tooltip, Legend, CategoryScale, LinearScale, BarController, BarElement);

const chartColors = [
  'rgb(255, 99, 132)',
  'rgb(255, 159, 64)',
  'rgb(255, 205, 86)',
  'rgb(42, 78, 27)'
];

const config = {
  type: 'bar',
  data: null,
  options: {
    responsive: true,
    plugins: {
      legend: {
        position: 'top',
      },
      title: {
        display: true,
        text: 'Chart.js Floating Bar Chart'
      }
    }
  }
};

const Analytics = () => {
  const [loadingStatus, isLoading] = useState(false);
  const [graphData, setData] = useState({
    labels: [
      'Дніпро',
      'Київ',
      'Львів'
    ],
    datasets: []
  });

  useEffect(() => {
    const fetchData = async () => {
      let dataa = {
        labels: [
          'Дніпро',
          'Київ',
          'Львів'
        ],
        datasets: []
      };
      isLoading(true);
      try {
        await axios.get("/analytics/cities").then((res) => {
          for (let i in res.data) {
            let obj = {
              label: res.data[i].site,
              data: [res.data[i].amountDnipro, res.data[i].amountKyiv, res.data[i].amountLviv],
              backgroundColor: chartColors[i]
            }
            dataa.datasets.push(obj);
          }
          config.data = dataa;

        });
      } catch (err) {
        console.log(err);
      } finally {
        setData(dataa);
        isLoading(false);
      }


    }

    fetchData();
  }, [])

  return (
    <div className="graph">
      <div className="analyticsRow">
        <div className="titleHolder">
          <h1 className='title'>Аналітика ринку праці</h1>
        </div>
        {loadingStatus ? <div className="loadingDiv"><Spinner animation="border" variant="success"><span className="visually-hidden">Loading...</span></Spinner></div> : (
          <div className="oneGraph">
            <p>Кількість вакансій в різних містах:</p>
            <Bar options={config} data={graphData} />
          </div>
        )}

      </div>


    </div>
  )
}

export default Analytics