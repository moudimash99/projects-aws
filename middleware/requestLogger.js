// middleware/requestLogger.js

const logger = require('../utils/logger');

const requestLogger = (req, res, next) => {
  const startHrTime = process.hrtime(); // Start timer

  
  res.on('finish', () => {
    const elapsedHrTime = process.hrtime(startHrTime); 
    const elapsedTimeInMs = elapsedHrTime[0] * 1000 + elapsedHrTime[1] / 1e6;

    logger.info(`${req.method} ${req.originalUrl} ${res.statusCode} ${elapsedTimeInMs.toFixed(3)}ms`, {
      method: req.method,
      url: req.originalUrl,
      statusCode: res.statusCode,
      responseTime: `${elapsedTimeInMs.toFixed(3)}ms`,
      ip: req.ip,
      userAgent: req.headers['user-agent'],
    });
  });

  next(); 
};

module.exports = requestLogger;
