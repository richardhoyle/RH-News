const express = require("express");
const app = express();
const { getTopics } = require('./controllers/controllers.topics');
const { getArticles, getArticleById } = require("./controllers/controllers.articles");
const { handleError404, handleError500, handleCustomErrors, handlePsqlErrors } = require("./controllers/controllers.errors");


app.get('/api/topics', getTopics);
app.get('/api/articles', getArticles);
app.get('/api/articles/:article_id', getArticleById);
app.all('*', handleError404);

app.use(handleCustomErrors);
app.use(handlePsqlErrors);
app.use(handleError500);

module.exports = app