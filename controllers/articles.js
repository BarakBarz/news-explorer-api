const {
  BadRequestError,
  ForbiddenError,
  NotFoundError,
} = require('../utils/errorHandler');

const { messages } = require('../utils/constants');

const Article = require('../models/article');
const User = require('../models/user');

const getUserArticles = async (req, res, next) => {
  const { _id } = req.user;

  try {
    const articles = await Article.find({
      owner: _id,
    }).orFail(new NotFoundError(messages.notFound));

    res.send(articles);
  } catch (e) {
    console.log('Caught the error:', e);
    next(e);
  }
};

const createSavedArticle = async (req, res, next) => {
  const { _id } = req.user;
  const {
    keyword, title, text, date, source, link, image,
  } = req.body;
  try {
    const user = await User.findById({ _id });

    const newArticle = await Article.create({
      keyword,
      title,
      text,
      date,
      source,
      link,
      image,
      owner: user,
    });

    if (!newArticle) {
      throw new BadRequestError(messages.invalid);
    }

    res.status(201).send(newArticle);
  } catch (e) {
    if (e.name === 'ValidationError') {
      next(BadRequestError(messages.invalid));
    } else {
      console.log('Caught the error:', e);
      next(e);
    }
  }
};

const deleteSavedArticle = async (req, res, next) => {
  const { articleId } = req.params;
  const { _id } = req.user;

  try {
    const articleById = await Article.findById(articleId).select(
      '+owner',
    );

    if (!articleById) {
      throw new NotFoundError(messages.notFound);
    }

    const articleOwnerId = articleById.owner.toHexString();

    if (articleOwnerId !== _id) {
      throw new ForbiddenError(messages.forbidden);
    }

    const removeArticle = await Article.findByIdAndDelete(
      articleId,
    );
    if (!removeArticle) {
      throw new Error();
    }

    res.send(articleById);
  } catch (e) {
    console.log('Caught the error:', e);
    next(e);
  }
};

module.exports = {
  getUserArticles,
  createSavedArticle,
  deleteSavedArticle,
};
