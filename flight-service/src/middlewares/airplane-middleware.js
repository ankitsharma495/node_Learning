const { StatusCodes } = require('http-status-codes');
const { Logger } = require('../config');

function validateCreateRequest(req, res, next) {
    // Check if modelNumber is present and is a non-empty string
    if (!req.body.modelNumber) {
        Logger.warn('Middleware: validateCreateRequest — modelNumber missing', { body: req.body });
        return res.status(StatusCodes.BAD_REQUEST).json({
            success: false,
            message: 'modelNumber is required and cannot be empty',
            data: {},
            error: { explanation: 'A valid model number must be provided in the request body' }
        });
    }

    // Check if capacity is present and is a positive integer
    if (!req.body.capacity || !Number.isInteger(req.body.capacity) || req.body.capacity <= 0) {
        Logger.warn('Middleware: validateCreateRequest — invalid capacity', { capacity: req.body.capacity });
        return res.status(StatusCodes.BAD_REQUEST).json({
            success: false,
            message: 'capacity is required and must be a positive integer',
            data: {},
            error: { explanation: 'A valid capacity (positive integer) must be provided in the request body' }
        });
    }

    Logger.info('Middleware: validateCreateRequest passed');
    // All validations passed — move to the next middleware or controller
    next();
}

function validateUpdateRequest(req, res, next) {
    // For updates, at least one field should be present
    if (!req.body.modelNumber && !req.body.capacity) {
        Logger.warn('Middleware: validateUpdateRequest — no fields provided', { body: req.body });
        return res.status(StatusCodes.BAD_REQUEST).json({
            success: false,
            message: 'At least one of modelNumber or capacity must be provided',
            data: {},
            error: { explanation: 'Nothing to update — provide modelNumber or capacity' }
        });
    }

    // If capacity is provided, it must be a positive integer
    if (req.body.capacity !== undefined && (!Number.isInteger(req.body.capacity) || req.body.capacity <= 0)) {
        Logger.warn('Middleware: validateUpdateRequest — invalid capacity', { capacity: req.body.capacity });
        return res.status(StatusCodes.BAD_REQUEST).json({
            success: false,
            message: 'capacity must be a positive integer',
            data: {},
            error: { explanation: 'A valid capacity (positive integer) must be provided' }
        });
    }

    Logger.info('Middleware: validateUpdateRequest passed');
    next();
}

module.exports = {
    validateCreateRequest,
    validateUpdateRequest
};