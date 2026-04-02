const { StatusCodes } = require('http-status-codes');
const { Logger } = require('../config');
const AppError = require('../utils/errors/app-error');

/**
 * Global Error Handler Middleware
 *
 * Express recognizes this as an error handler because it has 4 parameters (err, req, res, next).
 * When any middleware or controller calls next(error) or throws, Express skips all remaining
 * normal middleware and jumps straight to error handlers.
 *
 * This handler:
 * 1. Checks if the error is an AppError (our custom error with statusCode)
 * 2. If yes — uses the statusCode and message from AppError
 * 3. If no — defaults to 500 Internal Server Error (unknown/unexpected error)
 */
function globalErrorHandler(err, req, res, next) {
    Logger.error('Global error handler caught an error', {
        name: err.name,
        message: err.message,
        statusCode: err.statusCode,
        path: req.path,
        method: req.method
    });

    // Default to 500 if no specific status code
    const statusCode = err.statusCode || StatusCodes.INTERNAL_SERVER_ERROR;
    const message = err.explanation || err.message || 'Something went wrong';

    return res.status(statusCode).json({
        success: false,
        message: message,
        data: {},
        error: {
            statusCode: statusCode,
            explanation: message
        }
    });
}

module.exports = globalErrorHandler;
