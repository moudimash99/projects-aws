// middlewares/logger.js

const { createLogger, format, transports } = require('winston');

const logger = createLogger({
  level: 'info', // Change to 'debug' for more details
  format: format.combine(
    format.timestamp(),
    format.json()
  ),
  transports: [
    new transports.Console(),
    // Add file transport if needed
    // new transports.File({ filename: 'logs/app.log' })
  ],
});

module.exports = logger;
