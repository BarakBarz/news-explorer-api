require('dotenv').config();

const bodyParser = require('body-parser');

const cors = require('cors');

const express = require('express');

const { errors } = require('celebrate');

const mongoose = require('mongoose');

const helmet = require('helmet');

const { limiter } = require('./middlewares/rateLimiter');

const { MONGO_URL, PORT, NODE_ENV } = require('./utils/constants');

const { requestLogger, errorLogger } = require('./middlewares/logger');

const indexRouter = require('./routes/index');

const centralErrHandler = require('./middlewares/centralErrHandler');

const app = express();

app.use(cors());
app.options('*', cors());

app.use(bodyParser.json());

app.use(helmet());

app.use(requestLogger);

app.use(limiter);

app.get('/crash-test', () => {
  setTimeout(() => {
    throw new Error('Server will crash now');
  }, 0);
});

app.use('/api/v1', indexRouter);

app.use(errorLogger);

app.use(errors());

app.use(centralErrHandler);

mongoose
  .connect(MONGO_URL)
  .then(() => {
    console.log('MongoDB connected');
    app.listen(PORT, () => {
      if (NODE_ENV !== 'production') {
        console.log('running on PORT: ', PORT);
      }
    });
  })
  .catch((err) => {
    console.log({ err });
    process.exit(1);
  });

