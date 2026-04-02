const { StatusCodes } = require('http-status-codes');
const { serverConfig, Logger } = require('../config');

function validateApiKey(req, res, next) {
    // If no API key is configured, skip enforcement
    if (!serverConfig.API_KEY) {
        return next();
    }

    const clientKey = req.headers['x-api-key'];

    if (!clientKey) {
        Logger.warn('API key missing', { path: req.path, ip: req.ip });
        return res.status(StatusCodes.UNAUTHORIZED).json({
            success: false,
            message: 'API key is required',
            data: {},
            error: { explanation: 'Provide a valid x-api-key header' }
        });
    }

    if (clientKey !== serverConfig.API_KEY) {
        Logger.warn('Invalid API key', { path: req.path, ip: req.ip });
        return res.status(StatusCodes.FORBIDDEN).json({
            success: false,
            message: 'Invalid API key',
            data: {},
            error: { explanation: 'The provided API key is not valid' }
        });
    }

    next();
}

module.exports = { validateApiKey };
