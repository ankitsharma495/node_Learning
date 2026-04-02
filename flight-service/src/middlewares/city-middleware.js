const { StatusCodes } = require('http-status-codes');
const { Logger } = require('../config');

function validateCreateRequest(req, res, next) {
    // City only needs a name — must be a non-empty string
    if (!req.body.name) {
        Logger.warn('Middleware: City validateCreateRequest — name missing', { body: req.body });
        return res.status(StatusCodes.BAD_REQUEST).json({
            success: false,
            message: 'City name is required and cannot be empty',
            data: {},
            error: { explanation: 'A valid city name must be provided in the request body' }
        });
    }

    Logger.info('Middleware: City validateCreateRequest passed');
    next();
}

function validateUpdateRequest(req, res, next) {
    if (!req.body.name) {
        Logger.warn('Middleware: City validateUpdateRequest — name missing', { body: req.body });
        return res.status(StatusCodes.BAD_REQUEST).json({
            success: false,
            message: 'City name must be provided for update',
            data: {},
            error: { explanation: 'Provide a new name for the city' }
        });
    }

    Logger.info('Middleware: City validateUpdateRequest passed');
    next();
}

module.exports = {
    validateCreateRequest,
    validateUpdateRequest
};
