const { createLogger, format, transports } = require('winston');
const DailyRotateFile = require('winston-daily-rotate-file');
const path = require('path');

const logDirectory = path.join(__dirname, '..', 'logs');

const logger = createLogger({
  level: process.env.LOG_LEVEL || 'info', 
  format: format.combine(
    format.timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }), 
    format.errors({ stack: true }), 
    format.splat(), 
    format.json() 
  ),
  transports: [

    new transports.Console({
      format: format.combine(
        format.colorize(), 
        format.simple() 
      ),
      silent: process.env.NODE_ENV === 'production', 
    }),

    new DailyRotateFile({
      filename: path.join(logDirectory, 'error-%DATE%.log'),
      datePattern: 'YYYY-MM-DD',
      level: 'error', 
      zippedArchive: true, 
      maxSize: '20m', 
      maxFiles: '14d', 
    }),

    new DailyRotateFile({
      filename: path.join(logDirectory, 'combined-%DATE%.log'),
      datePattern: 'YYYY-MM-DD',
      zippedArchive: true,
      maxSize: '20m',
      maxFiles: '30d', 
    }),
  ],
  exitOnError: false, 
});

module.exports = logger;