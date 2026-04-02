const { StatusCodes } = require('http-status-codes');
const { Logger } = require('../config');

function validateCreateBooking(req, res, next) {
    if (!req.body.flightId || !Number.isInteger(req.body.flightId) || req.body.flightId <= 0) {
        Logger.warn('Middleware: booking validation — invalid flightId');
        return res.status(StatusCodes.BAD_REQUEST).json({
            success: false,
            message: 'flightId is required and must be a positive integer',
            data: {},
            error: { explanation: 'Provide a valid flightId' }
        });
    }

    if (!req.body.userId || !Number.isInteger(req.body.userId) || req.body.userId <= 0) {
        Logger.warn('Middleware: booking validation — invalid userId');
        return res.status(StatusCodes.BAD_REQUEST).json({
            success: false,
            message: 'userId is required and must be a positive integer',
            data: {},
            error: { explanation: 'Provide a valid userId' }
        });
    }

    if (req.body.noOfSeats !== undefined) {
        if (!Number.isInteger(req.body.noOfSeats) || req.body.noOfSeats < 1) {
            Logger.warn('Middleware: booking validation — invalid noOfSeats');
            return res.status(StatusCodes.BAD_REQUEST).json({
                success: false,
                message: 'noOfSeats must be a positive integer',
                data: {},
                error: { explanation: 'Provide a valid number of seats (minimum 1)' }
            });
        }
    }

    Logger.info('Middleware: booking validation passed');
    next();
}

module.exports = {
    validateCreateBooking
}
