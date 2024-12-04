// app.js

require('dotenv').config();
const express = require('express');
const morgan = require('morgan');
const logger = require('./middlewares/logger');
const app = express();
const port = process.env.PORT || 3000;

// Middleware to parse JSON bodies
app.use(express.json());

// HTTP request logging
app.use(morgan('combined', { stream: { write: message => logger.info(message.trim()) } }));

// Import routes
const projectRoutes = require('./routes/projects');

// Use routes
app.use('/projects', projectRoutes);

// Error handling middleware
const errorHandler = require('./middlewares/errorHandler');
app.use(errorHandler);

app.listen(port, () => {
  logger.info(`API server is running on http://localhost:${port}`);
});

module.exports = app;
