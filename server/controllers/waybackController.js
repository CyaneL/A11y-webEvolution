const express = require('express');
const axios = require('axios');
const puppeteer = require('puppeteer');
const { AxePuppeteer } = require('@axe-core/puppeteer');
const { timeout } = require('puppeteer');
const A11yResult = require('../models/a11yResult');
const ArchiveResult = require('../models/archiveResult');

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
  }
  return 'timestamp:8'; // Collapses to one result per day
};
// Save ArchiveResult to db
const saveArchiveResultsDB = async (archive) => {
  const existingArchive = await ArchiveResult.findOne({
    url: archive.url,
    startDate: archive.startDate,
    endDate: archive.endDate,
    collapseValue: archive.collapseValue,
  });
  if (existingArchive) {
    console.log('ArchiveResult already exists in the database');
    return existingArchive;
  }
  try {
    const newArchive = new ArchiveResult(archive);
    await newArchive.save();
    console.log('Archive Results saved to MongoDB');
  } catch (err) {
    console.error('Failed to save archive results:', err);
  }
};
// Save A11yResult to db
const saveA11yResultsDB = async (result) => {
  const existingResult = await A11yResult.findOne({
    url: result.url,
    timestamp: result.timestamp,
  });
  if (existingResult) {
    console.log('A11yResult already exists in the database');
    return existingResult;
  } else {
    try {
      const newA11yResult = new A11yResult(result);
      await newA11yResult.save();
      console.log('A11yResults saved to MongoDB');
    } catch (err) {
      console.error('Failed to save a11y results:', err);
    }
  }
};

/**
 * fetch availiable data from wayback api
 * @see https://github.com/internetarchive/wayback/tree/master/wayback-cdx-server#pagination-api
 */

waybackController.getArchive = async (req, res, next) => {
  const { url, startDate, endDate } = req.query;

  const collapseValue = collapseCalculator(startDate, endDate);

  try {
    // Check db first to see if already have the data
    let archiveDataDB = await ArchiveResult.findOne({
      url: url,
      startDate: startDate,
      endDate: endDate,
      collapseValue: collapseValue,
    });
    if (archiveDataDB) {
      console.log('Returning data from MongoDB');
      res.locals.avaliableArchive = archiveDataDB.data;
      return next();
    }

    const response = await axios.get(`http://web.archive.org/cdx/search/cdx`, {
      params: {
        url: url,
        output: 'json',
        //filter date range: date
        from: startDate,
        to: endDate,
        // filter collapse
        collapse: collapseValue,
        limit: -12,
        filter: 'statuscode:200',
      },
      headers: { 'User-Agent': 'PostmanRuntime/7.37.3' },
      timeout: 90000,
    });

    // Save result to DB
    await saveArchiveResultsDB({
      url: url,
      startDate: startDate,
      endDate: endDate,
      collapseValue: collapseValue,
      data: response.data,
    });
    res.locals.avaliableArchive = response.data;
    return next();
  } catch (err) {
    return next({
      log: `Failed to fetch data from wayback-cdx-server: ${err}`,
      status: 500,
      message: 'Error fetching data from Wayback Machine',
    });
  }
};

waybackController.getSnapshotAndAnalyze = async (req, res, next) => {
  res.locals.avaliableArchive.shift(); //use shift to remove header
  const toTest = res.locals.avaliableArchive;
  const results = [];

  try {
    const browser = await puppeteer.launch();
    const page = await browser.newPage();

    if (toTest[0] !== undefined) {
      for (const element of toTest) {
        const timestamp = element[1];
        const targetUrl = element[2];
        const requestUrl = `http://web.archive.org/web/${timestamp}/${targetUrl}`;
        // query db to check if report already exists
        let savedResult = await A11yResult.findOne({
          url: requestUrl,
          timestamp: timestamp,
        });
        if (savedResult) {
          console.log('Returning saved results from MongoDB');
          results.push(savedResult);
          continue; // Skip the analysis if already have result in MongoDB
        }

        try {
          await page.goto(requestUrl, {
            waitUntil: 'networkidle0',
            timeout: 90000,
          });
        } catch (err) {
          console.log(`Failed to load page ${requestUrl}:`, err);
        }
        const eachResults = await new AxePuppeteer(page).analyze();
        console.log(`Accessibility results for ${requestUrl}:`, eachResults);

        const result = {
          url: requestUrl,
          timestamp: timestamp,
          violations: eachResults.violations,
        };

        results.push(result);
        await saveA11yResultsDB(result);
      }
    }

    await browser.close();

    res.locals.a11yResults = results;
    return next();
  } catch (err) {
    console.error('Error during accessibility analysis:', err);
    return next({
      log: `Failed to perform accessibility analysis: ${err}`,
      status: 500,
      message: 'Error performing accessibility analysis',
    });
  }
};

waybackController.getSnapshot = async (req, res, next) => {
  res.locals.avaliableArchive.shift(); //use shift to remove header
  const toFetch = res.locals.avaliableArchive;
  const resultSnapshot = [];

  try {
    if (toFetch[0] !== undefined) {
      //making sure it is not a empty array
      for (const element of toFetch) {
        const timestamp = element[1];
        const targetUrl = element[2];
        const requestUrl = `http://web.archive.org/web/${timestamp}/${targetUrl}`;
        //console.log(`I'm request URL: ${requestUrl}`)
        const response = await axios.get(requestUrl);
        // console.log('I am html fetched:',response);
        resultSnapshot.push(response.data);
      }
    }
    res.locals.resultSnapshot = resultSnapshot;
    //console.log('I am the many html fetched:', res.locals.resultSnapshot);
    return next();
  } catch (err) {
    return next({
      log: `Failed to fetch snapshot from web archive org: ${err}`,
      status: 500,
      message: 'Error fetching data from Web Archive',
    });
  }
};

module.exports = waybackController;
