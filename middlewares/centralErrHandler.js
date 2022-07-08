const { messages, errorCodes } = require('../utils/constants');

module.exports = (err, req, res, next) => {
  if (err.statusCode === undefined) {
    const { statusCode = errorCodes.default, message } = err;
    res.status(statusCode).send({
      message:
        statusCode === errorCodes.default
          ? messages.default
          : message,
    });
    return;
  }
  res.status(err.statusCode).send({ message: err.message });
};
