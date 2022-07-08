const validate = require('validator');

const isURLValid = (value, helpers) => {
  if (
    validate.isURL(value, {
      require_protocol: true,
      allow_underscores: true,
    })
  ) {
    return value;
  }
  return helpers.error('string.uri');
};

module.exports = {
  isURLValid,
};
