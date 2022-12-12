const db = require('../db/connection')

exports.selectTopics = () => {
    return db.query('SELECT * from topics').then(({ rows: topics }) => {
        console.log(topics, )
        return topics
    })
}
