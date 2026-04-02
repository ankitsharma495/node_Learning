const { StatusCodes } = require('http-status-codes');
const { Logger } = require('../config');

function validateCreateRequest(req, res, next) {
    // flightNumber is required (e.g., "AI-302")
    if (!req.body.flightNumber) {
        Logger.warn('Middleware: Flight validateCreateRequest — flightNumber missing', { body: req.body });
        return res.status(StatusCodes.BAD_REQUEST).json({
            success: false,
            message: 'Flight number is required',
            data: {},
            error: { explanation: 'A valid flight number must be provided (e.g., AI-302)' }
        });
    }

    // airplaneId is required and must be a positive integer
    if (!req.body.airplaneId || !Number.isInteger(req.body.airplaneId) || req.body.airplaneId <= 0) {
        Logger.warn('Middleware: Flight validateCreateRequest — invalid airplaneId', { airplaneId: req.body.airplaneId });
        return res.status(StatusCodes.BAD_REQUEST).json({
            success: false,
            message: 'airplaneId is required and must be a positive integer',
            data: {},
            error: { explanation: 'Provide a valid airplaneId referencing an existing airplane' }
        });
    }

    // departureAirportId is required (airport code string like "DEL")
    if (!req.body.departureAirportId) {
        Logger.warn('Middleware: Flight validateCreateRequest — departureAirportId missing');
        return res.status(StatusCodes.BAD_REQUEST).json({
            success: false,
            message: 'departureAirportId is required',
            data: {},
            error: { explanation: 'Provide a valid departure airport code (e.g., DEL)' }
        });
    }

    // arrivalAirportId is required (airport code string like "BOM")
    if (!req.body.arrivalAirportId) {
        Logger.warn('Middleware: Flight validateCreateRequest — arrivalAirportId missing');
        return res.status(StatusCodes.BAD_REQUEST).json({
            success: false,
            message: 'arrivalAirportId is required',
            data: {},
            error: { explanation: 'Provide a valid arrival airport code (e.g., BOM)' }
        });
    }

    // Departure and arrival airports must be different
    if (req.body.departureAirportId === req.body.arrivalAirportId) {
        Logger.warn('Middleware: Flight validateCreateRequest — same departure and arrival airport');
        return res.status(StatusCodes.BAD_REQUEST).json({
            success: false,
            message: 'Departure and arrival airports must be different',
            data: {},
            error: { explanation: 'A flight cannot depart and arrive at the same airport' }
        });
    }

    // departureTime and arrivalTime are required
    if (!req.body.departureTime || !req.body.arrivalTime) {
        Logger.warn('Middleware: Flight validateCreateRequest — missing times');
        return res.status(StatusCodes.BAD_REQUEST).json({
            success: false,
            message: 'Both departureTime and arrivalTime are required',
            data: {},
            error: { explanation: 'Provide valid ISO date strings for departure and arrival times' }
        });
    }

    // arrivalTime must be after departureTime
    if (new Date(req.body.arrivalTime) <= new Date(req.body.departureTime)) {
        Logger.warn('Middleware: Flight validateCreateRequest — arrivalTime not after departureTime');
        return res.status(StatusCodes.BAD_REQUEST).json({
            success: false,
            message: 'Arrival time must be after departure time',
            data: {},
            error: { explanation: 'arrivalTime must be a later timestamp than departureTime' }
        });
    }

    // price is required and must be a positive integer
    if (!req.body.price || !Number.isInteger(req.body.price) || req.body.price <= 0) {
        Logger.warn('Middleware: Flight validateCreateRequest — invalid price', { price: req.body.price });
        return res.status(StatusCodes.BAD_REQUEST).json({
            success: false,
            message: 'price is required and must be a positive integer',
            data: {},
            error: { explanation: 'Provide a valid price (positive integer)' }
        });
    }

    // totalSeats is required and must be a positive integer
    if (!req.body.totalSeats || !Number.isInteger(req.body.totalSeats) || req.body.totalSeats <= 0) {
        Logger.warn('Middleware: Flight validateCreateRequest — invalid totalSeats', { totalSeats: req.body.totalSeats });
        return res.status(StatusCodes.BAD_REQUEST).json({
            success: false,
            message: 'totalSeats is required and must be a positive integer',
            data: {},
            error: { explanation: 'Provide a valid total seat count (positive integer)' }
        });
    }

    // remainingSeats is required and cannot exceed totalSeats
    if (req.body.remainingSeats === undefined || !Number.isInteger(req.body.remainingSeats) || req.body.remainingSeats < 0) {
        Logger.warn('Middleware: Flight validateCreateRequest — invalid remainingSeats');
        return res.status(StatusCodes.BAD_REQUEST).json({
            success: false,
            message: 'remainingSeats is required and must be a non-negative integer',
            data: {},
            error: { explanation: 'Provide a valid remaining seat count (non-negative integer)' }
        });
    }

    if (req.body.remainingSeats > req.body.totalSeats) {
        Logger.warn('Middleware: Flight validateCreateRequest — remainingSeats > totalSeats');
        return res.status(StatusCodes.BAD_REQUEST).json({
            success: false,
            message: 'remainingSeats cannot exceed totalSeats',
            data: {},
            error: { explanation: `remainingSeats (${req.body.remainingSeats}) is greater than totalSeats (${req.body.totalSeats})` }
        });
    }

    Logger.info('Middleware: Flight validateCreateRequest passed');
    next();
}

function validateUpdateRequest(req, res, next) {
    const allowedFields = ['flightNumber', 'airplaneId', 'departureAirportId', 'arrivalAirportId',
        'departureTime', 'arrivalTime', 'price', 'boardingGate', 'totalSeats', 'remainingSeats'];
    const hasAtLeastOne = allowedFields.some(field => req.body[field] !== undefined);

    if (!hasAtLeastOne) {
        Logger.warn('Middleware: Flight validateUpdateRequest — no valid fields provided', { body: req.body });
        return res.status(StatusCodes.BAD_REQUEST).json({
            success: false,
            message: `At least one field must be provided: ${allowedFields.join(', ')}`,
            data: {},
            error: { explanation: 'Nothing to update — provide at least one field' }
        });
    }

    // If price is provided, it must be a positive integer
    if (req.body.price !== undefined && (!Number.isInteger(req.body.price) || req.body.price <= 0)) {
        Logger.warn('Middleware: Flight validateUpdateRequest — invalid price');
        return res.status(StatusCodes.BAD_REQUEST).json({
            success: false,
            message: 'price must be a positive integer',
            data: {},
            error: { explanation: 'Provide a valid price (positive integer)' }
        });
    }

    // If airplaneId is provided, it must be a positive integer
    if (req.body.airplaneId !== undefined && (!Number.isInteger(req.body.airplaneId) || req.body.airplaneId <= 0)) {
        Logger.warn('Middleware: Flight validateUpdateRequest — invalid airplaneId');
        return res.status(StatusCodes.BAD_REQUEST).json({
            success: false,
            message: 'airplaneId must be a positive integer',
            data: {},
            error: { explanation: 'Provide a valid airplaneId' }
        });
    }

    Logger.info('Middleware: Flight validateUpdateRequest passed');
    next();
}

function validateUpdateSeatsRequest(req, res, next) {
    if (req.body.remainingSeats === undefined || !Number.isInteger(req.body.remainingSeats) || req.body.remainingSeats < 0) {
        Logger.warn('Middleware: Flight validateUpdateSeatsRequest — invalid remainingSeats');
        return res.status(StatusCodes.BAD_REQUEST).json({
            success: false,
            message: 'remainingSeats is required and must be a non-negative integer',
            data: {},
            error: { explanation: 'Provide a valid remaining seat count (non-negative integer)' }
        });
    }

    Logger.info('Middleware: Flight validateUpdateSeatsRequest passed');
    next();
}

module.exports = {
    validateCreateRequest,
    validateUpdateRequest,
    validateUpdateSeatsRequest
};
