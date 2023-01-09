const cors = require('cors');
const express = require("express");
const app = express();
const { getTopics } = require('./controllers/controllers.topics');
const { getArticles, getArticleById, getCommentsById, addComments, patchArticle } = require("./controllers/controllers.articles");
const { handleError404, handleError500, handleCustomErrors, handlePsqlErrors } = require("./controllers/controllers.errors");

app.use(cors());
app.use(express.json());
app.get('/api/topics', getTopics);
app.get('/api/articles', getArticles);
app.get('/api/articles/:article_id', getArticleById);
app.get('/api/articles/:article_id/comments', getCommentsById);
app.post('/api/articles/:article_id/comments', addComments);
app.patch("/api/articles/:article_id", patchArticle);
app.all('*', handleError404);

app.use(handleCustomErrors);
app.use(handlePsqlErrors);
app.use(handleError500);

module.exports = app