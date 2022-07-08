const badPathRouter = require('express').Router();

const {
  handleBadPathRequest,
} = require('../controllers/badPathRequest');

badPathRouter.get('*', handleBadPathRequest);

module.exports = badPathRouter;
