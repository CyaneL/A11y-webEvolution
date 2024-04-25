import React, { useState } from 'react';
import DateFnsUtils from '@date-io/date-fns';

const Form = ({ onSubmit }) => {
  const [url, setUrl] = useState('');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(url, startDate, endDate);
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
