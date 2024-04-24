const express = require('express');
const axios = require('axios');

const waybackController = {};

// To calculate whether to collapse query result to month or to day
function parseDate(date) {
  const year = date.substring(0, 4);
  const month = date.substring(4, 6);
  const day = date.substring(6, 8);

  // Constructing a date in the format 'YYYY-MM-DD' so that date constructor can read
  return new Date(`${year}-${month}-${day}`);
}

const collapseCalculator = (startDate, endDate) => {
  const oneYear = 365 * 24 * 60 * 60 * 1000; // 365days24hours60mins60seconds to milliseconds
  const start = parseDate(startDate);
  const end = parseDate(endDate);
  const timeDiff = end - start;
  if (timeDiff > oneYear) {
    return 'timestamp:6'; // Collapses to one result per month
  } else {
    return 'timestamp:8'; // Collapses to one result per day
  }
};

/**
 * fetch availiable data from wayback api
 * @see https://github.com/internetarchive/wayback/tree/master/wayback-cdx-server#pagination-api
 */

waybackController.getArchive = async (req, res, next) => {
  // // hardcoded testing for now
  // const url = 'codesmith.io';
  // const startDate = '20150101';
  // const endDate = '20240423';
  const { url, startDate, endDate } = req.query;
  const collapseValue = collapseCalculator(startDate, endDate);

  try {
    const response = await axios.get(`http://web.archive.org/cdx/search/cdx`, {
      params: {
        url: url,
        output: 'json',
        //filter date range: date
        from: startDate,
        to: endDate,
        // filter collapse
        collapse: collapseValue,
        limit: -30,
        filter: 'statuscode:200',
      },
    });
    res.locals.avaliableArchive = response.data;
    next()
    // // uncomment if testing
    //console.log(response);
  } 
  catch (err) {
    //console.log(err);
    return next({
      log: `Failed to fetch data from wayback-cdx-server: ${err}`,
      status: 500,
      message: 'Error fetching data from Wayback Machine',
    });
  }
};

waybackController.getSnapshot = async (req, res, next) => {
  res.locals.avaliableArchive.shift(); //use shift to remove header
  const toFetch = res.locals.avaliableArchive
  const resultSnapshot = [];

  try {
    if (toFetch[0] !== undefined) { //making sure it is not a empty array 
      for (const element of toFetch) {
        const timestamp = element[1];
        const targetUrl = element[2];
        const requestUrl = `http://web.archive.org/web/${timestamp}/${targetUrl}`
        //console.log(`I'm request URL: ${requestUrl}`)
        const response = await axios.get(requestUrl);
        //console.log('I am html fetched:',response);
        resultSnapshot.push(response.data);
      }
    }
    res.locals.resultSnapshot = resultSnapshot;
    console.log('I am the many html fetched:', res.locals.resultSnapshot)
    next();

  } catch (err) {
    return next({
      log: `Failed to fetch snapshot from web archive org: ${err}`,
      status: 500,
      message: 'Error fetching data from Web Archive',
    });
  }
};

// // uncomment if testing
//waybackController.getArchive()
module.exports = waybackController;
