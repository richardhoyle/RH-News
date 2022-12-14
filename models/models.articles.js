const db = require("../db/connection");

exports.selectArticles = () => {
  return db
    .query(
      "SELECT articles.*, COUNT(comment_id) ::INT AS comment_count FROM articles LEFT JOIN comments ON articles.article_id = comments.article_id GROUP BY articles.article_id ORDER BY articles.created_at desc"
    )
    .then(({ rows: articles }) => {
      return articles;
    });
};

exports.readArticleById = (article_id) => {
  const SQLQuery = "SELECT * FROM articles WHERE article_id = $1";
  return db.query(SQLQuery, [article_id]).then(({ rows: articles }) => {
    if (!articles[0]) {
      return Promise.reject({
        status: 404,
        msg: `No article found for article_id ${article_id}`
      })
    }
    return articles[0];
  });
};
