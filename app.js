const express = require('express');
const cors = require('cors');

const logger = require('./utils/logger'); 
const requestLogger = require('./middleware/requestLogger'); 
const projectRoutes = require('./routes/projects');
const departmentRoutes = require('./routes/departments');
const errorHandler = require('./middleware/errorHandler');
const validationErrorHandler = require('./middleware/validationErrorHandler');
require('dotenv').config();
const db = require('./models'); 
const app = express();
const swaggerUi = require('swagger-ui-express');
const swaggerSpec = require('./swagger');

app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec))

app.use(cors());
app.use(express.json());

app.use(requestLogger);

app.use('/projects', projectRoutes);
app.use('/departments', departmentRoutes);

app.use(validationErrorHandler);

app.use(errorHandler);

const PORT = process.env.PORT || 3000;

const startServer = async () => {
  try {

    await db.Sequelize.authenticate();
    console.log('Database connected successfully.');

    app.listen(PORT, () => {
      console.log(`Server is running on port ${PORT}`);
    });
  } catch (error) {
    console.error('Unable to connect to the database:', error);
    process.exit(1); 
  }
};

startServer();

process.on('SIGINT', async () => {
  console.log('Shutting down gracefully...');
  await db.Sequelize.close();
  console.log('Database connection closed.');
  process.exit(0);
});