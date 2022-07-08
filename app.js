require('dotenv').config();

const bodyParser = require('body-parser');

const cors = require('cors');

const express = require('express');

const { errors } = require('celebrate');

const mongoose = require('mongoose');

const helmet = require('helmet');

const rateLimit = require('express-rate-limit');

const { NODE_ENV } = require('./utils/constants');

const { PORT = 3000 } = process.env;

const { login, createUser } = require('./controllers/users');

const { auth } = require('./middlewares/auth');

const {
  requestLogger,
  errorLogger,
} = require('./middlewares/logger');

const centralErrHandler = require('./middlewares/centralErrHandler');

const { NotFoundError } = require('./errors/errorHandler');

const usersRouter = require('./routes/users');
const articlesRouter = require('./routes/articles');

const app = express();

const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // Limit each IP to 100 requests per `window` (here, per 15 minutes)
  standardHeaders: true, // Return rate limit info in the `RateLimit-*` headers
  legacyHeaders: false, // Disable the `X-RateLimit-*` headers
});

mongoose.connect('mongodb://localhost:27017/finalproject');

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

app.post('/signup', createUser);
app.post('/signin', login);

app.use(auth);

app.use('/users', usersRouter);
app.use('/articles', articlesRouter);

app.use('/', (req, res, next) => {
  next(new NotFoundError('Path not found!'));
});

app.use(errorLogger);

app.use(errors());
app.use(centralErrHandler);

app.listen(PORT, () => {
  console.log('running on PORT: ', PORT);
});
