const { StatusCodes } = require('http-status-codes');
const { Logger } = require('../config');
const AppError = require('../utils/errors/app-error');

function globalErrorHandler(err, req, res, next) {
    Logger.error('Global error handler caught an error', {
        name: err.name,
        message: err.message,
        statusCode: err.statusCode,
        path: req.path,
        method: req.method
    });

    const statusCode = err.statusCode || StatusCodes.INTERNAL_SERVER_ERROR;
    const message = err.explanation || err.message || 'Something went wrong';

    return res.status(statusCode).json({
        success: false,
        message: message,
        data: {},
        error: {
            explanation: message
        }
    });
}

module.exports = globalErrorHandler;
