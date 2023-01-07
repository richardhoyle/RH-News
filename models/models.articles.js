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
        msg: `No article found for article_id ${article_id}`,
      });
    }
    return articles[0];
  });
};
exports.readCommentsById = (article_id) => {
  const SQLQuery =
    "SELECT comment_id, votes, created_at, author, body FROM comments  WHERE article_id = $1";
  return db.query(SQLQuery, [article_id]).then(({ rows: comments }) => {
    return comments;
  });
};
exports.insertComment = (newComment, article_id) => {
  const { username, body } = newComment;
  return db
    .query(
      "INSERT INTO comments (author, body, article_id) VALUES ($1, $2, $3) RETURNING *;",
      [newComment.username, newComment.body, article_id]
    )
    .then(({ rows }) => {return rows[0] });
};
exports.updateArticle = (article_id, update) => {
  return db
    .query('UPDATE articles SET votes = votes + $1 WHERE article_id = $2 RETURNING *;',
      [update, article_id])
    .then(
  ({ rows }) => {
      return rows;
  })
}
