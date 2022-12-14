const { selectArticles } = require("../models/models.articles");

const getArticles = (req, res, next) => {
    selectArticles().then((articles) =>
        res.status(200).send({ articles }))
}
module.exports = { getArticles };
