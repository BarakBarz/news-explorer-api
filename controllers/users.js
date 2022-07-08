const User = require('../models/user');

const bcrypt = require('bcrypt');

const jwt = require('jsonwebtoken');

const {
  NODE_ENV,
  JWT_SECRET,
  SALT,
} = require('../utils/constants');

const {
  NotFoundError,
  BadRequestError,
  ConflictError,
  UnauthorizedError,
} = require('../errors/errorHandler');

const getUserInfo = (req, res, next) => {
  const { _id } = req.user;

  return User.findOne({ _id })
    .orFail(new NotFoundError('No such user'))
    .then((user) => res.status(200).send(user))
    .catch((e) => {
      if (e.name === 'CastError') {
        next(
          new BadRequestError('You have submitted invalid data')
        );
      }
      next(e);
    });
};

const createUser = async (req, res, next) => {
  const { email, password, name } = req.body;

  try {
    const isEmailExist = await User.findOne({ email });

    if (isEmailExist) {
      throw new ConflictError(
        'A user with this email already exists'
      );
    }

    const hashedPassword = await bcrypt.hash(password, SALT);

    if (!hashedPassword) {
      throw new Error('error');
    }

    const newUser = await User.create({
      email,
      password: hashedPassword,
      name,
    });

    if (!newUser) {
      throw new ConflictError(
        'A user with this email already exist'
      );
    }

    const { _id } = newUser;
    res.status(201).send({
      _id,
      name: newUser.name,
      about: newUser.about,
      avatar: newUser.avatar,
      email,
    });
  } catch (e) {
    console.log('Error in registration:', e);
    next(e);
  }
};

const login = (req, res, next) => {
  const { email, password } = req.body;

  if (!email || !password) {
    throw new BadRequestError('Please enter email and password');
  }

  User.findOne({ email })
    .select('+password')
    .orFail(new UnauthorizedError('Incorrect Email or Password'))
    .then((user) => {
      bcrypt
        .compare(password, user.password)
        .then((match) => {
          if (!match) {
            throw new UnauthorizedError(
              'Incorrect Email or Password'
            );
          }
          const token = jwt.sign(
            { _id: user._id },
            NODE_ENV === 'production'
              ? JWT_SECRET
              : 'some-secret-key',
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
  getUserInfo,
  createUser,
  login,
};
