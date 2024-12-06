//validationErrorHandler.js
const { validationResult } = require('express-validator');
const logger = require('../utils/logger');

function validationErrorHandler(err, req, res, next) {
  if (err.status === 400 && err.details) {
    // This is a validation error
    logger.warn('Validation Error', { details: err.details, url: req.originalUrl });
    return res.status(400).json({
      message: 'Validation failed',
      errors: err.details,
    });
  }
  next(err); // If it's not a validation error, pass it to the global errorHandler
}

module.exports = validationErrorHandler;
