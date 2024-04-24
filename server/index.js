const path = require('path');
const express = require('express');
const cors = require('cors');
const router = express.Router();

const app = express();
const PORT = process.env.PORT || 8080;

app.use(cors());
app.use(express.json());

/**
 * require routers
 */
const waybackRouter = require(path.resolve(__dirname, 'routes', 'wayback.js'));

//-------------------Testing area
app.use((req, res, next) => {
  res.locals.availableArchive = [
    [
      'io,codesmith)/',
      '20150315161819',
      'http://www.codesmith.io:80/',
      'text/html',
      '200',
      'digest1',
      'length1',
    ],
    [
      'io,codesmith)/',
      '20150510142927',
      'http://codesmith.io:80/',
      'text/html',
      '200',
      'digest2',
      'length2',
    ],
  ];
  next();
});

//-------------------------------

/**
 * handle parsing request body
 */
app.use(
  '/api/wayback',
  (req, res, next) => {
    console.log('Wayback API route hit');
    next();
  },
  waybackRouter
);

app.get('/', (req, res) => res.send('Home Page'));

// catch-all route handler for any requests to an unknown route
app.use('*', (req, res) => res.sendStatus(404));

/**
 * configure express global error handler
 * @see https://expressjs.com/en/guide/error-handling.html#writing-error-handlers
 */
app.use((err, req, res, next) => {
  // defaultErr object
  const defaultErr = {
    log: 'Express error handler caught unknown middleware error',
    status: 500,
    message: { err: 'An error occurred' },
  };
  const errorObj = Object.assign({}, defaultErr, err);
  res.locals.message = errorObj.message;
  console.log(errorObj.log);
  return res.status(errorObj.status).json(res.locals.message); // pass message to JSON
});

app.listen(PORT, () => {
  console.log(`Listening on port ${PORT}`);
});
