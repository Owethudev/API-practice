const errorHandler = (err, req, res, next) => {
  console.error(err);

  if (err instanceof SyntaxError && err.status === 400 && "body" in err) {
    return res.status(400).json({
      message: "Malformed JSON request body",
    });
  }

  if (err.status) {
    return res.status(err.status).json({
      message: err.message,
    });
  }

  res.status(500).json({
    message: "Internal server error",
  });
};

module.exports = errorHandler;