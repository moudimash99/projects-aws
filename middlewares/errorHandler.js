// middlewares/errorHandler.js

const logger = require('./logger');

function errorHandler(err, req, res, next) {
  logger.error(`${err.status || 500} - ${err.message} - ${req.originalUrl} - ${req.method} - ${req.ip}`);

  res.status(500).json({
    error: 'Internal Server Error',
    message: err.message,
  });
}

module.exports = errorHandler;
