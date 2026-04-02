const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
const rateLimit = require('express-rate-limit');

const app = express();
const { serverConfig, Logger } = require('./config');
const apiRoutes = require('./routes');

// Security
app.use(helmet());
app.use(cors());

// Request logging
app.use(morgan('combined', {
    stream: { write: (message) => Logger.info(message.trim()) }
}));

// Rate limiting
const limiter = rateLimit({
    windowMs: 15 * 60 * 1000,
    max: 200,
    standardHeaders: true,
    legacyHeaders: false,
    message: {
        success: false,
        message: 'Too many requests from this IP',
        data: {},
        error: { explanation: 'Rate limit exceeded — max 200 requests per 15 minutes' }
    }
});

app.use('/api', limiter);

// Body parsers
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Gateway health check
app.get('/health', (req, res) => {
    res.json({
        success: true,
        message: 'API Gateway is running',
        data: {
            uptime: Math.floor(process.uptime()),
            services: {
                flights: serverConfig.FLIGHT_SERVICE_URL,
                bookings: serverConfig.BOOKING_SERVICE_URL,
                auth: serverConfig.AUTH_SERVICE_URL
            },
            timestamp: new Date().toISOString()
        },
        error: {}
    });
});

// All API routes
app.use('/api/v1', apiRoutes);

// 404 handler
app.use((req, res) => {
    res.status(404).json({
        success: false,
        message: 'Route not found',
        data: {},
        error: { explanation: `${req.method} ${req.path} does not exist on this gateway` }
    });
});

// Global error handler
app.use((err, req, res, next) => {
    Logger.error('Gateway error', { error: err.message, path: req.path });
    res.status(err.statusCode || 500).json({
        success: false,
        message: err.message || 'Internal gateway error',
        data: {},
        error: { explanation: err.message }
    });
});

app.listen(serverConfig.PORT, () => {
    Logger.info(`API Gateway started on port ${serverConfig.PORT}`);
    Logger.info(`Proxying to: Flight(${serverConfig.FLIGHT_SERVICE_URL}), Booking(${serverConfig.BOOKING_SERVICE_URL}), Auth(${serverConfig.AUTH_SERVICE_URL})`);
});
