require('dotenv').config();

const {
  SALT = 10,
  JWT_SECRET,
  NODE_ENV,
  MONGO_URL,
  PORT = 3000,
} = process.env;

const DEV_KEY = 'some-secret-key';

const messages = {
  notFound: 'The resource was not found',
  unauthorized: 'Authorization required',
  invalid: 'Invalid or missing data',
  forbidden: 'Request is forbidden',
  conflict: 'Resource already exists',
  badRequest: 'Missing information',
  incorrectEmailOrPassword: 'Incorrect Email or Password',
  default: 'An error occured on the server',
};

const errorCodes = { default: 500 };

module.exports = {
  SALT,
  JWT_SECRET,
  NODE_ENV,
  MONGO_URL,
  PORT,
  DEV_KEY,
  messages,
  errorCodes,
};
