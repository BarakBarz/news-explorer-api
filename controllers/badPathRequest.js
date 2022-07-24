const { NotFoundError } = require('../utils/errorHandler');
const { messages } = require('../utils/constants');

const handleBadPathRequest = (req, res, next) => {
  next(new NotFoundError(messages.notFound));
};

module.exports = {
  handleBadPathRequest,
};
