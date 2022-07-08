const jwt = require('jsonwebtoken');

const { UnauthorizedError } = require('../utils/errorHandler');

const {
  NODE_ENV,
  JWT_SECRET,
  messages,
  DEV_KEY,
} = require('../utils/constants');

const auth = (req, res, next) => {
  const { authorization } = req.headers;

  if (!authorization || !authorization.startsWith('Bearer ')) {
    console.log('No Authorization!!!');
    throw new UnauthorizedError(messages.UnauthorizedError);
  }
  const token = authorization.replace('Bearer ', '');
  let payload;
  try {
    payload = jwt.verify(
      token,
      NODE_ENV === 'production' ? JWT_SECRET : DEV_KEY,
    );
  } catch (err) {
    next(new UnauthorizedError(messages.UnauthorizedError));
  }

  req.user = payload;
  next();
};

module.exports = {
  auth,
};
