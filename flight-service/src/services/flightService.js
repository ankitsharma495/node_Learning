const { FlightRepository } = require('../repositories');
const { Logger } = require('../config');
const { AppError } = require('../utils');
const { StatusCodes } = require('http-status-codes');

const flightRepository = new FlightRepository();

async function createFlight(data) {
    try {
        Logger.info('Flight service: createFlight called', { data });
        const flight = await flightRepository.create(data);
        return flight;
    } catch (error) {
        Logger.error('Flight service: createFlight failed', { error: error.message });
        if (error.name === 'SequelizeValidationError' || error.name === 'SequelizeUniqueConstraintError') {
            throw new AppError(error.errors?.[0]?.message || error.message, StatusCodes.BAD_REQUEST);
        }
        if (error.name === 'SequelizeForeignKeyConstraintError') {
            throw new AppError('The referenced airplane or airport does not exist', StatusCodes.BAD_REQUEST);
        }
        throw new AppError('Cannot create flight', StatusCodes.INTERNAL_SERVER_ERROR);
    }
}

async function getFlights(filter) {
    try {
        Logger.info('Flight service: getFlights called', { filter });
        const flights = await flightRepository.getAll(filter);
        return flights;
    } catch (error) {
        Logger.error('Flight service: getFlights failed', { error: error.message });
        throw new AppError('Cannot fetch flights', StatusCodes.INTERNAL_SERVER_ERROR);
    }
}

async function getFlight(id) {
    try {
        Logger.info('Flight service: getFlight called', { id });
        const flight = await flightRepository.get(id);
        if (!flight) {
            throw new AppError(`Flight with id ${id} not found`, StatusCodes.NOT_FOUND);
        }
        return flight;
    } catch (error) {
        Logger.error('Flight service: getFlight failed', { error: error.message });
        if (error instanceof AppError) throw error;
        throw new AppError('Cannot fetch flight', StatusCodes.INTERNAL_SERVER_ERROR);
    }
}

async function updateFlight(id, data) {
    try {
        Logger.info('Flight service: updateFlight called', { id, data });
        const result = await flightRepository.update(data, id);
        if (result[0] === 0) {
            throw new AppError(`Flight with id ${id} not found`, StatusCodes.NOT_FOUND);
        }
        return result;
    } catch (error) {
        Logger.error('Flight service: updateFlight failed', { error: error.message });
        if (error instanceof AppError) throw error;
        if (error.name === 'SequelizeValidationError' || error.name === 'SequelizeUniqueConstraintError') {
            throw new AppError(error.errors?.[0]?.message || error.message, StatusCodes.BAD_REQUEST);
        }
        throw new AppError('Cannot update flight', StatusCodes.INTERNAL_SERVER_ERROR);
    }
}

async function destroyFlight(id) {
    try {
        Logger.info('Flight service: destroyFlight called', { id });
        const response = await flightRepository.destroy(id);
        if (response === 0) {
            throw new AppError(`Flight with id ${id} not found`, StatusCodes.NOT_FOUND);
        }
        return response;
    } catch (error) {
        Logger.error('Flight service: destroyFlight failed', { error: error.message });
        if (error instanceof AppError) throw error;
        throw new AppError('Cannot delete flight', StatusCodes.INTERNAL_SERVER_ERROR);
    }
}

async function updateRemainingSeats(flightId, seats) {
    try {
        Logger.info('Flight service: updateRemainingSeats called', { flightId, seats });
        const response = await flightRepository.update({ remainingSeats: seats }, flightId);
        if (response[0] === 0) {
            throw new AppError(`Flight with id ${flightId} not found`, StatusCodes.NOT_FOUND);
        }
        return response;
    } catch (error) {
        Logger.error('Flight service: updateRemainingSeats failed', { error: error.message });
        if (error instanceof AppError) throw error;
        throw new AppError('Cannot update remaining seats', StatusCodes.INTERNAL_SERVER_ERROR);
    }
}

module.exports = {
    createFlight,
    getFlights,
    getFlight,
    updateFlight,
    destroyFlight,
    updateRemainingSeats
};
