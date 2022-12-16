const express = require("express");
const app = express();
const { getTopics } = require('./controllers/controllers.topics');
const { getArticles, getArticleById, getCommentsById, addComments } = require("./controllers/controllers.articles");
const { handleError404, handleError500, handleCustomErrors, handlePsqlErrors } = require("./controllers/controllers.errors");

app.use(express.json());
app.get('/api/topics', getTopics);
app.get('/api/articles', getArticles);
app.get('/api/articles/:article_id', getArticleById);
app.get('/api/articles/:article_id/comments', getCommentsById);
app.post('/api/articles/:article_id/comments', addComments);
app.all('*', handleError404);

app.use(handleCustomErrors);
app.use(handlePsqlErrors);
app.use(handleError500);

module.exports = app