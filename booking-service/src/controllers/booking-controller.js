const { StatusCodes } = require('http-status-codes');
const { Logger } = require('../config');
const { BookingService } = require('../services');

async function createBooking(req, res, next) {
    try {
        Logger.info('Controller: createBooking request received');
        const booking = await BookingService.createBooking({
            flightId: req.body.flightId,
            userId: req.body.userId,
            noOfSeats: req.body.noOfSeats || 1
        });
        return res.status(StatusCodes.CREATED).json({
            success: true,
            message: 'Booking created successfully',
            data: booking,
            error: {}
        });
    } catch (error) {
        next(error);
    }
}

async function cancelBooking(req, res, next) {
    try {
        Logger.info('Controller: cancelBooking request received', { id: req.params.id });
        const booking = await BookingService.cancelBooking(req.params.id);
        return res.status(StatusCodes.OK).json({
            success: true,
            message: 'Booking cancelled successfully',
            data: booking,
            error: {}
        });
    } catch (error) {
        next(error);
    }
}

async function getBooking(req, res, next) {
    try {
        Logger.info('Controller: getBooking request received', { id: req.params.id });
        const booking = await BookingService.getBooking(req.params.id);
        return res.status(StatusCodes.OK).json({
            success: true,
            message: 'Successfully fetched booking',
            data: booking,
            error: {}
        });
    } catch (error) {
        next(error);
    }
}

async function getBookings(req, res, next) {
    try {
        Logger.info('Controller: getBookings request received');
        let bookings;
        if (req.query.userId) {
            bookings = await BookingService.getBookingsByUser(req.query.userId);
        } else {
            bookings = await BookingService.getAllBookings();
        }
        return res.status(StatusCodes.OK).json({
            success: true,
            message: 'Successfully fetched bookings',
            data: bookings,
            error: {}
        });
    } catch (error) {
        next(error);
    }
}

module.exports = {
    createBooking,
    cancelBooking,
    getBooking,
    getBookings
}
