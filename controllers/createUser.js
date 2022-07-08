const bcrypt = require('bcrypt');
const { ConflictError } = require('../utils/errorHandler');

const { SALT, messages } = require('../utils/constants');

const User = require('../models/user');

const createUser = async (req, res, next) => {
  const { email, password, name } = req.body;

  try {
    const isEmailExist = await User.findOne({ email });

    if (isEmailExist) {
      throw new ConflictError(messages.conflict);
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
      throw new ConflictError(messages.conflict);
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
module.exports = {
  createUser,
};
