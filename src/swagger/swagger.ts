import swaggerJsdoc from 'swagger-jsdoc';
import swaggerUi from 'swagger-ui-express';
import { Express } from 'express';

const PORT = process.env.PORT || 3000; // Ensure PORT is available

const options = {
    definition: {
      openapi: '3.0.0',
      info: {
        title: 'Fundoo Notes API',
        version: '1.0.0',
        description: 'API documentation for Fundoo Notes app',
      },
      servers: [
        {
          url: `http://localhost:${PORT}/api`,
        },
      ],
      components: {
        securitySchemes: {
          Bearer: {
            type: 'http',
            scheme: 'bearer',
            bearerFormat: 'JWT',
          },
        },
      },
    },
    apis: ['./src/routes/*.ts'],
};

const swaggerSpec = swaggerJsdoc(options);

export function setupSwagger(app: Express) {
  app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));
}
