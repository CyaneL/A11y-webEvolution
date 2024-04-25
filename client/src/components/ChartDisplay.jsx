/**
 * Create a line chart using Chart.js
 * @see https://codesandbox.io/p/devbox/reactchartjs-react-chartjs-2-default-1695r?embed=1&file=%2FApp.tsx%3A6%2C16
 */
import React from 'react';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  scales,
} from 'chart.js';
import { Line } from 'react-chartjs-2';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

const options = {
  responsive: true,
  plugins: {
    legend: {
      position: 'top',
      labels: {
        color: 'rgba(171, 209, 198, 1)',
        size: 18
      }
    },
  },
  scales: {
    x: {
      grid: {
        color: 'rgba(255, 255, 255, 0.1)', // Grid line color
      },
      ticks: {
        color: 'rgba(171, 209, 198, 1)', // Font color for the scale
      },
    },
    y: {
      grid: {
        color: 'rgba(255, 255, 255, 0.1)', // Grid line color
      },
      ticks: {
        color: 'rgba(171, 209, 198, 1)', // Font color for the scale
      },
    },
  },
};

const ChartDisplay = ({ data, labels, dataPoints }) => {
  // chartData handling
  const chartData = {
    labels: labels,
    datasets: [
      {
        label: 'Number of Accessibility Issues',
        data: dataPoints,
        fill: false,
        backgroundColor: 'rgba(171, 209, 198, 1)',
        borderColor: 'rgba(171, 209, 198, 1)',
      },
    ],
  };

  return (
    <div className='trendLine'>
      <h2>Accessibility Trend</h2>
      <Line options={options} data={chartData} />
    </div>
  );
};

export default ChartDisplay;
