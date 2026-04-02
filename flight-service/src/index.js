const path = require('path');
const express = require('express');
const helmet = require('helmet');
const cors = require('cors');
const rateLimit = require('express-rate-limit');
const swaggerUi = require('swagger-ui-express');
const swaggerSpec = require('./config/swagger-config');

const app = express();
const { serverConfig, Logger } = require('./config');
const apirouter = require('./routes');
const globalErrorHandler = require('./middlewares/global-error-handler');
const { attachRequestId } = require('./middlewares/request-id-middleware');
const { validateApiKey } = require('./middlewares/api-key-middleware');

// Request ID tracing — first middleware so every request gets an ID
app.use(attachRequestId);

// Security middleware
app.use(helmet());
app.use(cors());

const limiter = rateLimit({
    windowMs: 15 * 60 * 1000,
    max: 100,
    standardHeaders: true,
    legacyHeaders: false,
    message: {
        success: false,
        message: 'Too many requests, please try again later',
        data: {},
        error: { explanation: 'Rate limit exceeded - max 100 requests per 15 minutes' }
    }
});

app.use('/api', limiter);

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Swagger API docs (before API key gate so docs are publicly accessible)
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec, {
    customCss: '.swagger-ui .topbar { display: none }',
    customSiteTitle: 'Flight Service API Docs'
}));

// Serve the dashboard UI
app.use(express.static(path.join(__dirname, 'public')));

// API key gate — only enforced when API_KEY is set in .env
app.use('/api', validateApiKey);

app.use('/api', apirouter);

app.use(globalErrorHandler);

app.listen(serverConfig.PORT, () => {
    Logger.info(`Server started successfully on port ${serverConfig.PORT}`);
    Logger.info(`Swagger docs available at http://localhost:${serverConfig.PORT}/api-docs`);
});
