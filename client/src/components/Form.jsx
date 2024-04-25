import React, { useState } from 'react';


const Form = ({ onSubmit }) => {
  const [url, setUrl] = useState('');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    // Handle date format from 'yyyy-mm-dd' to 'yyyyMMdd'
    const formattedStartDate = startDate.replaceAll('-', '');
    const formattedEndDate = endDate.replaceAll('-', '');
    console.log(`Formatted Start Date: ${formattedStartDate}`);
    console.log(`Formatted End Date: ${formattedEndDate}`);
    onSubmit(url, formattedStartDate, formattedEndDate);
  };

  const handleReset = () => {
    setUrl('');
    setStartDate('');
    setEndDate('');
  };

  return (
    <div className='Form'>
    <form onSubmit={handleSubmit}>
      <div className='URL'>
      <label>
        URL: 
        <input
          className='urlfield'
          type="text"
          value={url}
          onChange={(e) => setUrl(e.target.value)}
          placeholder="http://example.com"
          required
        />
      </label>
      </div>
      <div className='Dates'>
      <label className='startDate'>
        Start Date: 
        <input
          type="date"
          value={startDate}
          onChange={(e) => setStartDate(e.target.value)}
          required
        />
      </label>
      <label className='endDate'>
        End Date: 
        <input
          type="date"
          value={endDate}
          onChange={(e) => setEndDate(e.target.value)}
          required
        />
      </label>
      </div>
      <div className='Buttons'>
      <button className='submitButton' type="submit">Submit</button>
      <button className='resetButton' type="reset" onClick={handleReset}>Reset</button>
      </div>
    </form>
    </div>
  );
};

export default Form;
