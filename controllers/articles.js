const {
  BadRequestError,
  ForbiddenError,
  NotFoundError,
} = require('../errors/errorHandler');
const Article = require('../models/article');
const User = require('../models/user');

const getUserArticles = async (req, res, next) => {
  const { _id } = req.user;

  try {
    const articles = await Article.find({
      owner: _id,
    }).orFail(new NotFoundError('No articles found'));

    res.send(articles);
  } catch (e) {
    console.log('Caught the error:', e);
    next(e);
  }
};

const createSavedArticle = async (req, res, next) => {
  const { _id } = req.user;
  const { keyword, title, text, date, source, link, image } =
    req.body;
  try {
    const user = await User.findById({ _id });
    console.log('user:', user);
    console.log('req.body:', req.body);

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
      throw new BadRequestError('Invalid or missing data');
    }

    res.status(201).send(newArticle);
  } catch (e) {
    if (e.name === 'ValidationError') {
      next(BadRequestError('Invalid User Id'));
      return;
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
      '+owner'
    );

    if (!articleById) {
      throw new NotFoundError('No article by that id');
    }

    const articleOwnerId = articleById.owner.toHexString();

    if (articleOwnerId !== _id) {
      throw new ForbiddenError(
        'Can not delete an article saved by someone else'
      );
    }

    const removeArticle = await Article.findByIdAndDelete(
      articleId
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
