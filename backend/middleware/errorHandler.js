const errorHandler = (err, req, res, _next) => {
  const status = err.status || err.statusCode || 500;
  const message = err.message || "Internal server error.";

  if (process.env.NODE_ENV !== "production") {
    // eslint-disable-next-line no-console
    console.error(err);
  }

  return res.status(status).json({ message });
};

module.exports = errorHandler;
