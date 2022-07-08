const articlesRouter = require('express').Router();

const { celebrate, Joi } = require('celebrate');

const { isURLValid } = require('../helper/validation');

const {
  getUserArticles,
  createSavedArticle,
  deleteSavedArticle,
} = require('../controllers/articles');

articlesRouter.get('/', getUserArticles);

articlesRouter.post(
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
  createSavedArticle,
);

articlesRouter.delete(
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
  deleteSavedArticle,
);

module.exports = articlesRouter;
