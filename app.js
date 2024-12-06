//app.js
const express = require('express');
const cors = require('cors');

const logger = require('./utils/logger'); // Centralized logger
const requestLogger = require('./middleware/requestLogger'); // Request logging middleware
const projectRoutes = require('./routes/projects');
const departmentRoutes = require('./routes/departments');
const errorHandler = require('./middleware/errorHandler');
const validationErrorHandler = require('./middleware/validationErrorHandler');
require('dotenv').config();
const db = require('./models'); // Import the models including sequelize
const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Apply request logging middleware
app.use(requestLogger);

// Routes
app.use('/projects', projectRoutes);
app.use('/departments', departmentRoutes);

// Apply validation error handling middleware
app.use(validationErrorHandler);


// Error Handling Middleware
app.use(errorHandler);
 
// Start the server after ensuring the database is connected
const PORT = process.env.PORT || 3000;

const startServer = async () => {
  try {
    // Authenticate and sync (if not using migrations)
    await db.Sequelize.authenticate();
    console.log('Database connected successfully.');

    // Uncomment the following line if you want Sequelize to sync models (not recommended for production)
    // await db.sequelize.sync();

    app.listen(PORT, () => {
      console.log(`Server is running on port ${PORT}`);
    });
  } catch (error) {
    console.error('Unable to connect to the database:', error);
    process.exit(1); // Exit process with failure
  }
};

startServer();

// Handle graceful shutdown
process.on('SIGINT', async () => {
  console.log('Shutting down gracefully...');
  await db.Sequelize.close();
  console.log('Database connection closed.');
  process.exit(0);
});
