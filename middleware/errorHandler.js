// middleware/errorHandler.js

const logger = require('../utils/logger');

function errorHandler(err, req, res, next) {
  const statusCode = err.status || 500; // Default to 500 if status not set
  const message = err.message || 'Internal Server Error';
  
  // how to get type of error
  // const type = {type: typeof err}; // object
  // Log the error with detailed context
  logger.error(`Error: ${message}`, {
    statusCode,
    method: req.method,
    url: req.originalUrl,
    ip: req.ip,
    stack: err.stack, // Include stack trace for debugging
  });

  // Send standardized error response
  res.status(statusCode).json({
    message, 


    // Optionally include stack trace in development
    ...(process.env.NODE_ENV === 'test' && { stack: err.stack }),
    // include details if available
    ...(err.details && { errors: err.details }),
  });
  if (err.details) res.errors = err.details; // For validation errors

}

module.exports = errorHandler;
