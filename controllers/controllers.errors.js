const handleError404 = (req, res, next) => {
    res.status(404).send({ msg: 'Error, path not found...' })
};


module.exports = {handleError404}
