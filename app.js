const express = require("express");
const app = express();
const { getTopics } = require('./controllers/controllers.topics');
const { handleError404 } = require("./controllers/controllers.errors");



app.get('/api/topics', getTopics)
app.all('*', handleError404 )

module.exports = app