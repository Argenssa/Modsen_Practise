// swagger.js
const swaggerJsdoc = require('swagger-jsdoc');
const swaggerUi = require('swagger-ui-express');
const express = require('express');
const router = express.Router();

const swaggerDefinition = {
    openapi: '3.0.0',
    info: {
        title: 'MeetUp API',
        version: '1.0.0',
        description: 'API documentation for the MeetUp project',
    },
    servers: [
        {
            url: 'http://localhost:3000',
            description: 'Local server',
        },
    ],
};

const options = {
    swaggerDefinition,
    apis: ['./server*.js', './models/*.js'], // paths to files with documentation
};

const swaggerSpec = swaggerJsdoc(options);

router.use('/', swaggerUi.serve, swaggerUi.setup(swaggerSpec));

module.exports = router;
