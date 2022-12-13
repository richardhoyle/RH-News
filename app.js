const express = require("express");
const app = express();
const { getTopics } = require('./controllers/controllers.topics');
const { getArticles } = require("./controllers/controllers.articles");
const { handleError404, handleError500 } = require("./controllers/controllers.errors");


app.get('/api/topics', getTopics)
app.get('/api/articles', getArticles)
app.all('*', handleError404)

app.use(handleError500);

module.exports = app