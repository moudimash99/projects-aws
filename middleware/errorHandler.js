// middleware/errorHandler.js

const logger = require('../utils/logger');

function errorHandler(err, req, res, next) {
  const statusCode = err.status || 500; 
  const message = err.message || 'Internal Server Error';
  
  logger.error(`Error: ${message}`, {
    statusCode,
    method: req.method,
    url: req.originalUrl,
    ip: req.ip,
    stack: err.stack,
  });

  
  res.status(statusCode).json({
    message, 


    
    ...(process.env.NODE_ENV === 'test' && { stack: err.stack }),
    
    ...(err.details && { errors: err.details }),
  });
  if (err.details) res.errors = err.details; 

}

module.exports = errorHandler;
