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
