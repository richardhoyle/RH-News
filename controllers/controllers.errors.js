const handleError404 = (req, res, next) => {
    res.status(404).send({ msg: 'Error, path not found...' })
};

const handleError500 = (err, req, res, next) => {
  console.log(err);
  res.status(500).send({ msg: "Server Error!" });
};

module.exports = {handleError404, handleError500}
