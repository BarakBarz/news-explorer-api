const express = require('express');

const indexRouter = express.Router();

const { auth } = require('../middlewares/auth');

const usersRouter = require('./users');
const articlesRouter = require('./articles');
const badPathRouter = require('./badPath');

const { login } = require('../controllers/login');
const { createUser } = require('../controllers/createUser');

indexRouter.post('/signup', createUser);

indexRouter.post('/signin', login);

indexRouter.use(auth);

indexRouter.use('/users', usersRouter);
indexRouter.use('/articles', articlesRouter);
indexRouter.use(badPathRouter);

module.exports = indexRouter;
