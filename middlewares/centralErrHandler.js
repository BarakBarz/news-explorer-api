module.exports = (err, req, res, next) => {
  if (err.statusCode === undefined) {
    const { statusCode = 500, message } = err;
    res.status(statusCode).send({
      message:
        statusCode === 500
          ? 'An error occured on the server'
          : message,
    });
    return;
  }
  res.status(err.statusCode).send({ message: err.message });
};
