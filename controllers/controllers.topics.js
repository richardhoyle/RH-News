const {selectTopics} = require('../models/models.topics')

const getTopics = (req, res, next) => {
    selectTopics().then((topics) =>
        res.status(200).send({ topics }))
}

module.exports = { getTopics }