module.exports = (err, req, res, next) => {
  if (err.status) {
    res.status(err.status).json({
      error: "Something went wrong, please try after sometime.",
    });
  } else {
    res.status(500).json({
      error: err.message,
    });
  }
};
