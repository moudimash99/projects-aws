// utils/logger.js

const { createLogger, format, transports } = require('winston');
const DailyRotateFile = require('winston-daily-rotate-file');
const path = require('path');

// Define log directory
const logDirectory = path.join(__dirname, '..', 'logs');

// Create the Winston logger instance
const logger = createLogger({
  level: process.env.LOG_LEVEL || 'info', // Set log level from environment or default to 'info'
  format: format.combine(
    format.timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }), // Add timestamp to logs
    format.errors({ stack: true }), // Include stack trace for errors
    format.splat(), // Enable string interpolation
    format.json() // Log in JSON format for structured logging
  ),
  transports: [
    // Console transport for development
    new transports.Console({
      format: format.combine(
        format.colorize(), // Colorize output for better readability in console
        format.simple() // Simple text format
      ),
      silent: process.env.NODE_ENV === 'production', // Disable console logs in production
    }),

    // Daily rotate file transport for errors
    new DailyRotateFile({
      filename: path.join(logDirectory, 'error-%DATE%.log'),
      datePattern: 'YYYY-MM-DD',
      level: 'error', // Log only error level messages
      zippedArchive: true, // Compress archived log files
      maxSize: '20m', // Maximum size of a log file before rotation
      maxFiles: '14d', // Retain logs for 14 days
    }),

    // Daily rotate file transport for all logs
    new DailyRotateFile({
      filename: path.join(logDirectory, 'combined-%DATE%.log'),
      datePattern: 'YYYY-MM-DD',
      zippedArchive: true,
      maxSize: '20m',
      maxFiles: '30d', // Retain combined logs for 30 days
    }),
  ],
  exitOnError: false, // Do not exit on handled exceptions
});

// Export the logger instance
module.exports = logger;
