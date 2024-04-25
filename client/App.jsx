import React, { useState } from 'react';
import { createRoot } from 'react-dom/client';
import axios from 'axios';
import './style.css';
import Header from './src/components/Header';
import Form from './src/components/Form';
// import ChartDisplay from './src/components/ChartDisplay';

const App = () => {
  const fetchA11yReport = async (url, formattedStartDate, formattedEndDate) => {
    console.log('Submit clicked!')
    const apiUrl = 'http://localhost:8080/api/wayback/test';
    try{
      const response = await axios.get(apiUrl, {
        params: {
          url: url,
          startDate: formattedStartDate,
          endDate: formattedEndDate,
        },
      });
      const data = response.data;
      console.log(`I'm the frontend fetch: req ${data}`);
    } catch (err) {
      console.log(err)
    }
  };

  return (
    <div className='App'>
      <Header />
      <Form onSubmit={fetchA11yReport} />
    </div>
  );
};

const container = document.getElementById('root');
const root = createRoot(container);
root.render(<App />);
export default App;
