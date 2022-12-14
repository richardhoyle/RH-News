const {
  selectArticles,
  readArticleById,
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
      res.status(200).send(article);
    })
    .catch((err) => next(err));
};

module.exports = { getArticles, getArticleById };
