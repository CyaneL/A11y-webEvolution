import React, { useState } from 'react';
import { createRoot } from 'react-dom/client';
import axios from 'axios';
import './style.css';
import Header from './src/components/Header';
import Form from './src/components/Form';
import ChartDisplay from './src/components/ChartDisplay';
import dataProcessor from './src/dataCleaning'

const App = () => {
  const [reportData, setReportData] = useState(null);
  const [chartLabels, setChartLabels] = useState([]);
  const [chartDataPoints, setChartDataPoints] = useState([]);

  // Engage with backend
  const fetchA11yReport = async (url, formattedStartDate, formattedEndDate) => {
    console.log('Submit clicked!')
    const apiUrl = 'http://localhost:8080/api/wayback';
    try{
      const response = await axios.get(apiUrl, {
        params: {
          url: url,
          startDate: formattedStartDate,
          endDate: formattedEndDate,
        },
      });
      const data = response.data;
      setReportData(data)
      console.log(`I'm the frontend fetch: req ${data}`);

      // Process data for the chart
      const processedData = dataProcessor(data);
      setChartLabels(processedData.labels);
      setChartDataPoints(processedData.dataPoints);
      console.log(`I'm the proccessed data: ${processedData.labels}`)

    } catch (err) {
      console.log('Error engeging with backend: ',err)
    }
  };


  return (
    <div className='App'>
      <Header />
      <Form onSubmit={fetchA11yReport} />
      {reportData && <ChartDisplay data={reportData} labels={chartLabels} dataPoints={chartDataPoints}/>}
    </div>
  );
};

const container = document.getElementById('root');
const root = createRoot(container);
root.render(<App />);
export default App;
