const { messages, errorCodes } = require('../utils/constants');

module.exports = (err, req, res, next) => {
  console.log(err);
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
  console.log(err.message);
  res.status(err.statusCode).send({ message: err.message });
};
