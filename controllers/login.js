const bcrypt = require('bcrypt');

const jwt = require('jsonwebtoken');
const {
  UnauthorizedError,
  BadRequestError,
} = require('../utils/errorHandler');

const {
  NODE_ENV,
  JWT_SECRET,
  messages,
  DEV_KEY,
} = require('../utils/constants');

const User = require('../models/user');

const login = (req, res, next) => {
  const { email, password } = req.body;

  if (!email || !password) {
    throw new BadRequestError(messages.badRequest);
  }

  User.findOne({ email })
    .select('+password')
    .orFail(
      new UnauthorizedError(messages.incorrectEmailOrPassword)
    )
    .then((user) => {
      bcrypt
        .compare(password, user.password)
        .then((match) => {
          if (!match) {
            throw new UnauthorizedError(
              messages.incorrectEmailOrPassword
            );
          }
          const token = jwt.sign(
            { _id: user._id },
            NODE_ENV === 'production' ? JWT_SECRET : DEV_KEY,
            { expiresIn: '7d' }
          );
          res.send({ token });
        })
        .catch((e) => {
          console.log('Error in login token creation:', e);
          next(e);
        });
    })
    .catch((e) => {
      console.log('Error in login:', e);
      next(e);
    });
};

module.exports = {
  login,
};
