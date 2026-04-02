const { AirportRepository } = require('../repositories');
const { Logger } = require('../config');
const { AppError } = require('../utils');
const { StatusCodes } = require('http-status-codes');

const airportRepository = new AirportRepository();

async function createAirport(data) {
    try {
        Logger.info('Airport service: createAirport called', { data });
        const airport = await airportRepository.create(data);
        return airport;
    } catch (error) {
        Logger.error('Airport service: createAirport failed', { error: error.message });
        if (error.name === 'SequelizeValidationError' || error.name === 'SequelizeUniqueConstraintError') {
            throw new AppError(error.errors?.[0]?.message || error.message, StatusCodes.BAD_REQUEST);
        }
        if (error.name === 'SequelizeForeignKeyConstraintError') {
            throw new AppError('The referenced city does not exist', StatusCodes.BAD_REQUEST);
        }
        throw new AppError('Cannot create airport', StatusCodes.INTERNAL_SERVER_ERROR);
    }
}

async function getAirports() {
    try {
        Logger.info('Airport service: getAirports called');
        const airports = await airportRepository.getAll();
        return airports;
    } catch (error) {
        Logger.error('Airport service: getAirports failed', { error: error.message });
        throw new AppError('Cannot fetch airports', StatusCodes.INTERNAL_SERVER_ERROR);
    }
}

async function getAirport(id) {
    try {
        Logger.info('Airport service: getAirport called', { id });
        const airport = await airportRepository.get(id);
        if (!airport) {
            throw new AppError(`Airport with id ${id} not found`, StatusCodes.NOT_FOUND);
        }
        return airport;
    } catch (error) {
        Logger.error('Airport service: getAirport failed', { error: error.message });
        if (error instanceof AppError) throw error;
        throw new AppError('Cannot fetch airport', StatusCodes.INTERNAL_SERVER_ERROR);
    }
}

async function updateAirport(id, data) {
    try {
        Logger.info('Airport service: updateAirport called', { id, data });
        const result = await airportRepository.update(data, id);
        if (result[0] === 0) {
            throw new AppError(`Airport with id ${id} not found`, StatusCodes.NOT_FOUND);
        }
        return result;
    } catch (error) {
        Logger.error('Airport service: updateAirport failed', { error: error.message });
        if (error instanceof AppError) throw error;
        if (error.name === 'SequelizeValidationError' || error.name === 'SequelizeUniqueConstraintError') {
            throw new AppError(error.errors?.[0]?.message || error.message, StatusCodes.BAD_REQUEST);
        }
        throw new AppError('Cannot update airport', StatusCodes.INTERNAL_SERVER_ERROR);
    }
}

async function destroyAirport(id) {
    try {
        Logger.info('Airport service: destroyAirport called', { id });
        const response = await airportRepository.destroy(id);
        if (response === 0) {
            throw new AppError(`Airport with id ${id} not found`, StatusCodes.NOT_FOUND);
        }
        return response;
    } catch (error) {
        Logger.error('Airport service: destroyAirport failed', { error: error.message });
        if (error instanceof AppError) throw error;
        throw new AppError('Cannot delete airport', StatusCodes.INTERNAL_SERVER_ERROR);
    }
}

module.exports = {
    createAirport,
    getAirports,
    getAirport,
    updateAirport,
    destroyAirport
};
