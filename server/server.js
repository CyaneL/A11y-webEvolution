const path = require('path');
const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
// const waybackRouter = require('./routes/wayback.js');

const app = express();
const PORT = process.env.PORT || 8080;



const mongoURI = 'mongodb://127.0.0.1:27017/a11yWebEvolution';
mongoose
  .connect(mongoURI)
  .then(() => console.log('MongoDB connected'))
  .catch((err) => console.log(err));

  /**
 * handle parsing request body and cross-origin resource sharing
 */
app.use(cors());
app.use(express.json());

/**
 * require routers
 */
const waybackRouter = require(path.resolve(__dirname, 'routes', 'wayback.js'));


app.use(
  '/api/wayback',
  (req, res, next) => {
    console.log('Wayback API route hit');
    next();
  },
  waybackRouter
);

app.get('/', (req, res) => res.sendFile(path.resolve(__dirname,'../client/index.html')));

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
