const { StatusCodes } = require('http-status-codes');
const { Logger } = require('../config');

function validateCreateRequest(req, res, next) {
    // Airport name is required
    if (!req.body.name) {
        Logger.warn('Middleware: Airport validateCreateRequest — name missing', { body: req.body });
        return res.status(StatusCodes.BAD_REQUEST).json({
            success: false,
            message: 'Airport name is required',
            data: {},
            error: { explanation: 'A valid airport name must be provided' }
        });
    }

    // IATA code is required (e.g., "BOM", "DEL", "JFK")
    if (!req.body.code) {
        Logger.warn('Middleware: Airport validateCreateRequest — code missing', { body: req.body });
        return res.status(StatusCodes.BAD_REQUEST).json({
            success: false,
            message: 'Airport code (IATA) is required',
            data: {},
            error: { explanation: 'A valid IATA code must be provided (e.g., BOM, DEL)' }
        });
    }

    // cityId is required and must be a positive integer
    if (!req.body.cityId || !Number.isInteger(req.body.cityId) || req.body.cityId <= 0) {
        Logger.warn('Middleware: Airport validateCreateRequest — invalid cityId', { cityId: req.body.cityId });
        return res.status(StatusCodes.BAD_REQUEST).json({
            success: false,
            message: 'cityId is required and must be a positive integer',
            data: {},
            error: { explanation: 'Provide a valid cityId referencing an existing city' }
        });
    }

    Logger.info('Middleware: Airport validateCreateRequest passed');
    next();
}

function validateUpdateRequest(req, res, next) {
    // At least one field must be provided for update
    if (!req.body.name && !req.body.code && !req.body.address && !req.body.cityId) {
        Logger.warn('Middleware: Airport validateUpdateRequest — no fields provided', { body: req.body });
        return res.status(StatusCodes.BAD_REQUEST).json({
            success: false,
            message: 'At least one field (name, code, address, cityId) must be provided',
            data: {},
            error: { explanation: 'Nothing to update — provide at least one field' }
        });
    }

    // If cityId is provided, it must be a positive integer
    if (req.body.cityId !== undefined && (!Number.isInteger(req.body.cityId) || req.body.cityId <= 0)) {
        Logger.warn('Middleware: Airport validateUpdateRequest — invalid cityId', { cityId: req.body.cityId });
        return res.status(StatusCodes.BAD_REQUEST).json({
            success: false,
            message: 'cityId must be a positive integer',
            data: {},
            error: { explanation: 'Provide a valid cityId referencing an existing city' }
        });
    }

    Logger.info('Middleware: Airport validateUpdateRequest passed');
    next();
}

module.exports = {
    validateCreateRequest,
    validateUpdateRequest
};
