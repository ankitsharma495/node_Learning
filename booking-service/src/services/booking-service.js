const axios = require('axios');
const { StatusCodes } = require('http-status-codes');
const { Logger, serverConfig } = require('../config');
const AppError = require('../utils/errors/app-error');
const BookingRepository = require('../repositories/booking-repository');

const bookingRepository = new BookingRepository();
const FLIGHT_SERVICE = `${serverConfig.FLIGHT_SERVICE_URL}/api/v1`;

async function createBooking(data) {
    try {
        Logger.info('Service: createBooking called', { flightId: data.flightId, userId: data.userId, noOfSeats: data.noOfSeats });

        // 1. Fetch flight details from Flight Service
        let flight;
        try {
            const response = await axios.get(`${FLIGHT_SERVICE}/flights/${data.flightId}`);
            flight = response.data.data;
        } catch (error) {
            if (error.response?.status === 404) {
                throw new AppError('Flight not found', StatusCodes.NOT_FOUND);
            }
            Logger.error('Service: Failed to reach Flight Service', { error: error.message });
            throw new AppError('Flight Service is unavailable', StatusCodes.SERVICE_UNAVAILABLE);
        }

        // 2. Check seat availability
        if (flight.remainingSeats < data.noOfSeats) {
            throw new AppError(
                `Only ${flight.remainingSeats} seats available, but ${data.noOfSeats} requested`,
                StatusCodes.BAD_REQUEST
            );
        }

        // 3. Calculate total cost
        const totalCost = flight.price * data.noOfSeats;

        // 4. Create booking record
        const booking = await bookingRepository.create({
            flightId: data.flightId,
            userId: data.userId,
            noOfSeats: data.noOfSeats,
            totalCost,
            status: 'booked'
        });

        // 5. Update remaining seats on Flight Service
        try {
            await axios.patch(`${FLIGHT_SERVICE}/flights/${data.flightId}/seats`, {
                remainingSeats: flight.remainingSeats - data.noOfSeats
            });
        } catch (error) {
            // Rollback: delete the booking if seat update fails
            Logger.error('Service: Failed to update seats, rolling back booking', { bookingId: booking.id });
            await bookingRepository.destroy(booking.id);
            throw new AppError('Failed to reserve seats — booking rolled back', StatusCodes.INTERNAL_SERVER_ERROR);
        }

        Logger.info('Service: Booking created successfully', { bookingId: booking.id, totalCost });
        return booking;
    } catch (error) {
        if (error instanceof AppError) throw error;
        Logger.error('Service: createBooking error', { error: error.message });
        throw new AppError('Failed to create booking', StatusCodes.INTERNAL_SERVER_ERROR);
    }
}

async function cancelBooking(bookingId) {
    try {
        Logger.info('Service: cancelBooking called', { bookingId });

        const booking = await bookingRepository.get(bookingId);
        if (!booking) {
            throw new AppError('Booking not found', StatusCodes.NOT_FOUND);
        }
        if (booking.status === 'cancelled') {
            throw new AppError('Booking is already cancelled', StatusCodes.BAD_REQUEST);
        }

        // Release seats back to the Flight Service
        try {
            const flightResponse = await axios.get(`${FLIGHT_SERVICE}/flights/${booking.flightId}`);
            const flight = flightResponse.data.data;
            await axios.patch(`${FLIGHT_SERVICE}/flights/${booking.flightId}/seats`, {
                remainingSeats: flight.remainingSeats + booking.noOfSeats
            });
        } catch (error) {
            Logger.error('Service: Failed to release seats on Flight Service', { error: error.message });
            throw new AppError('Failed to release seats — cancellation aborted', StatusCodes.INTERNAL_SERVER_ERROR);
        }

        // Update booking status
        await bookingRepository.update({ status: 'cancelled' }, bookingId);
        const updatedBooking = await bookingRepository.get(bookingId);

        Logger.info('Service: Booking cancelled successfully', { bookingId });
        return updatedBooking;
    } catch (error) {
        if (error instanceof AppError) throw error;
        Logger.error('Service: cancelBooking error', { error: error.message });
        throw new AppError('Failed to cancel booking', StatusCodes.INTERNAL_SERVER_ERROR);
    }
}

async function getBooking(bookingId) {
    try {
        Logger.info('Service: getBooking called', { bookingId });
        const booking = await bookingRepository.get(bookingId);
        if (!booking) {
            throw new AppError('Booking not found', StatusCodes.NOT_FOUND);
        }
        return booking;
    } catch (error) {
        if (error instanceof AppError) throw error;
        Logger.error('Service: getBooking error', { error: error.message });
        throw new AppError('Failed to fetch booking', StatusCodes.INTERNAL_SERVER_ERROR);
    }
}

async function getBookingsByUser(userId) {
    try {
        Logger.info('Service: getBookingsByUser called', { userId });
        const bookings = await bookingRepository.getAll({ userId });
        return bookings;
    } catch (error) {
        Logger.error('Service: getBookingsByUser error', { error: error.message });
        throw new AppError('Failed to fetch bookings', StatusCodes.INTERNAL_SERVER_ERROR);
    }
}

async function getAllBookings() {
    try {
        Logger.info('Service: getAllBookings called');
        const bookings = await bookingRepository.getAll();
        return bookings;
    } catch (error) {
        Logger.error('Service: getAllBookings error', { error: error.message });
        throw new AppError('Failed to fetch bookings', StatusCodes.INTERNAL_SERVER_ERROR);
    }
}

module.exports = {
    createBooking,
    cancelBooking,
    getBooking,
    getBookingsByUser,
    getAllBookings
}
