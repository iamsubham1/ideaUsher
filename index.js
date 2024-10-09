const express = require('express');
const { connectToDb } = require('./config/db');
const cors = require('cors');
const swaggerJsDoc = require('swagger-jsdoc');
const swaggerUi = require('swagger-ui-express');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 8081;

// Swagger definition
const swaggerOptions = {
    swaggerDefinition: {
        openapi: '3.0.0',
        info: {
            title: 'Idea Usher Assignment',
            version: '1.0.0',
            description: 'Documentation for Post APIs',
        },
        components: {
            schemas: {
                Post: {
                    type: 'object',
                    properties: {
                        id: {
                            type: 'string',
                            description: 'The unique identifier for the post.',
                            example: '609c3a60f9c2c3012e14c34f',
                        },
                        title: {
                            type: 'string',
                            description: 'The title of the post.',
                            example: 'My first post',
                        },
                        description: {
                            type: 'string',
                            description: 'The content of the post.',
                            example: 'This is the description of my first post.',
                        },
                        image: {
                            type: 'string',
                            description: 'URL of the post image.',
                            example: 'https://example.com/image.jpg',
                        },
                        tags: {
                            type: 'array',
                            items: {
                                type: 'string',
                            },
                            description: 'An array of tags associated with the post.',
                            example: ['technology', 'coding'],
                        },
                    },
                },
            },
        },
    },
    apis: ['./routes/postRoutes.js'], // Path to your API docs
};

// Initialize swagger-jsdoc
const swaggerDocs = swaggerJsDoc(swaggerOptions);

// Middleware
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

// CORS configuration
const allowedOrigins = ['http://localhost:5713', '*', 'http://localhost:8081'];
app.use(cors({
    origin: function (origin, callback) {
        if (allowedOrigins.indexOf(origin || '') !== -1 || !origin) {
            callback(null, true);
        } else {
            console.error('Not allowed by CORS:', origin);
            callback(new Error('Not allowed by CORS'));
        }
    },
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
    credentials: true
}));

// Health check endpoint
app.get('/health', (req, res) => {
    res.send('server is up');
});

// Swagger UI setup
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocs));

// API routes
app.use('/api/post', require('./routes/postRoutes'));

// Start server
const startServer = async () => {
    await connectToDb();
    app.listen(PORT, () => {
        console.log(`app is listening on port ${PORT}`);
        console.log(`Docs are avaliable on http://localhost:8081/api-docs/`);
    });
};

startServer();
