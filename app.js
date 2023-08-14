/* eslint-disable import/no-extraneous-dependencies */
require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cookieParser = require('cookie-parser');
const { errors } = require('celebrate');
const router = require('./routes/index');
const validateSign = require('./middlewares/validation');
const errorHandler = require('./middlewares/error');
const { requestLogger, errorLogger } = require('./middlewares/logger');

const { PORT, NODE_ENV, DB_URL } = process.env;
const BASE_URL = NODE_ENV === 'production' ? DB_URL : 'mongodb://0.0.0.0:27017/bitfilmsdb';

const allowedCors = [
  'movies-ana-bear.nomoredomains.xyz',
  'http://localhost:3001',
  'localhost:3001',
  'https://praktikum.tk',
  'http://praktikum.tk',
];

mongoose
  .connect(BASE_URL)
  .then(() => {
    console.log('Connected');
  })
  .catch((err) => {
    console.log(`Something went wrong ${err}`);
  });

const app = express();

app.use(express.json());
app.use(cookieParser());

app.use((req, res, next) => {
  const { origin } = req.headers;
  const { method } = req;
  if (allowedCors.includes(origin)) {
    res.header('Access-Control-Allow-Origin', origin);
    res.header('Access-Control-Allow-Credentials', true);
  }

  const DEFAULT_ALLOWED_METHODS = 'GET,HEAD,PUT,PATCH,POST,DELETE';
  const requestHeaders = req.headers['access-control-request-headers'];
  if (method === 'OPTIONS') {
    res.header('Access-Control-Allow-Methods', DEFAULT_ALLOWED_METHODS);
    res.header('Access-Control-Allow-Headers', requestHeaders);
    res.header('Access-Control-Allow-Credentials', true);

    return res.end();
  }

  next();

  return null;
});

app.use(requestLogger);

app.get('/crash-test', () => {
  setTimeout(() => {
    throw new Error('Сервер сейчас упадёт');
  }, 0);
});

app.use(validateSign);
app.use('/', router);

app.use(errorLogger);
app.use(errors());
app.use(errorHandler);

app.listen(PORT, () => {
  console.log(`App listening on port ${PORT}`);
});
