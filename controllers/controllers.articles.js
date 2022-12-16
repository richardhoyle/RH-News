const {
  selectArticles,
  readArticleById,
  readCommentsById,
  insertComment,
} = require("../models/models.articles");

const getArticles = (req, res, next) => {
  selectArticles().then((articles) => res.status(200).send({ articles }));
};

const getArticleById = (req, res, next) => {
  const {
    params: { article_id },
  } = req;
  readArticleById(article_id)
    .then((article) => {
      res.status(200).send({ article });
    })
    .catch((err) => next(err));
};

const getCommentsById = (req, res, next) => {
  const {
    params: { article_id },
  } = req;
  readArticleById(article_id)
    .then(() => {
      return readCommentsById(article_id).then((comments) => {
        res.status(200).send({ comments });
      });
    })
    .catch((err) => {
      next(err);
    });
};

const addComments = (req, res, next) => {
  const {
    params: { article_id },
  } = req;
  const articleComment = req.body;
  readArticleById(article_id)
    .then(() => {
      insertComment(articleComment, article_id).then((comment) =>
        res.status(201).send({ comment })
      );
    })
    .catch((err) => {
      next(err);
    });
};

module.exports = { getArticles, getArticleById, getCommentsById, addComments };
