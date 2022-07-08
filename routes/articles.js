const { celebrate, Joi } = require('celebrate');

const express = require('express');

const { isURLValid } = require('../utils/constants');

const router = express.Router();

const {
  getUserArticles,
  createSavedArticle,
  deleteSavedArticle,
} = require('../controllers/articles');

router.get('/', getUserArticles);

router.post(
  '/',
  celebrate({
    body: Joi.object().keys({
      keyword: Joi.string().required(),
      title: Joi.string().required(),
      text: Joi.string().required(),
      date: Joi.string().required(),
      source: Joi.string().required(),
      link: Joi.string().required().required(isURLValid),
      image: Joi.string().required().required(isURLValid),
    }),
  }),
  createSavedArticle
);

router.delete(
  '/:articleId',
  celebrate({
    params: Joi.object().keys({
      articleId: Joi.string()
        .required()
        .alphanum()
        .length(24)
        .hex(),
    }),
  }),
  deleteSavedArticle
);

module.exports = router;
