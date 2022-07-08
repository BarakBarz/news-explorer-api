const User = require('../models/user');
const { messages } = require('../utils/constants');

const {
  NotFoundError,
  BadRequestError,
} = require('../utils/errorHandler');

const getUserInfo = (req, res, next) => {
  const { _id } = req.user;

  return User.findOne({ _id })
    .orFail(new NotFoundError(messages.notFound))
    .then((user) => res.status(200).send(user))
    .catch((e) => {
      if (e.name === 'CastError') {
        next(new BadRequestError(messages.badRequest));
      }
      next(e);
    });
};

module.exports = {
  getUserInfo,
};
