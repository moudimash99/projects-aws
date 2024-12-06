const swaggerJSDoc = require('swagger-jsdoc');

const swaggerDefinition = {
  openapi: '3.0.0',
  info: {
    title: 'Projects API',
    version: '1.0.0',
    description: 'API documentation for managing projects',
  },
  servers: [
    {
      url: 'https://<API_GATEWAY_ENDPOINT>', 
      description: 'Production server',
    },
  ],
};

const options = {
  swaggerDefinition,
  apis: ['./routes/*.js'], 
};

const swaggerSpec = swaggerJSDoc(options);

module.exports = swaggerSpec;