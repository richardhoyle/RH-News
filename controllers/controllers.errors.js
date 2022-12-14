const handleError404 = (req, res, next) => {
  res.status(404).send({ msg: "Error, path not found..." });
};

const handleCustomErrors = (err, req, res, next) => {
  if (err.msg) {
    res.status(err.status).send({ msg: err.msg });
  } else {
    next(err);
  }
};

const handlePsqlErrors = (err, req, res, next) => {
  if (err.code === "22P02") {
    res.status(400).send({ msg: "Bad Path" });
  }
};

const handleError500 = (err, req, res, next) => {
  console.log(err);
  res.status(500).send({ msg: "Server Error!" });
};

module.exports = { handleError404, handleError500, handleCustomErrors, handlePsqlErrors };
