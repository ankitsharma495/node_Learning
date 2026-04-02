const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');

const app = express();
const { serverConfig, Logger } = require('./config');
const apirouter = require('./routes');
const globalErrorHandler = require('./middlewares/global-error-handler');

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
        error: { explanation: 'Rate limit exceeded' }
    }
});

app.use('/api', limiter);
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use('/api', apirouter);

app.use(globalErrorHandler);

app.listen(serverConfig.PORT, () => {
    Logger.info(`Booking Service started on port ${serverConfig.PORT}`);
});
