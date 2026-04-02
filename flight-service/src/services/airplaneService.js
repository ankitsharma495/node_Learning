const { AirplaneRepository } = require('../repositories');
const { Logger } = require('../config');
const { AppError } = require('../utils');
const { StatusCodes } = require('http-status-codes');

const airplaneRepository = new AirplaneRepository();

async function createAirplane(data) {
    try {
        Logger.info('Airplane service: createAirplane called', { data });
        const airplane = await airplaneRepository.create(data);
        return airplane;
    } catch (error) {
        Logger.error('Airplane service: createAirplane failed', { error: error.message });
        if (error.name === 'SequelizeValidationError' || error.name === 'SequelizeUniqueConstraintError') {
            throw new AppError(error.errors?.[0]?.message || error.message, StatusCodes.BAD_REQUEST);
        }
        throw new AppError('Cannot create airplane', StatusCodes.INTERNAL_SERVER_ERROR);
    }
}

async function getAirplanes() {
    try {
        Logger.info('Airplane service: getAirplanes called');
        const airplanes = await airplaneRepository.getAll();
        return airplanes;
    } catch (error) {
        Logger.error('Airplane service: getAirplanes failed', { error: error.message });
        throw new AppError('Cannot fetch airplanes', StatusCodes.INTERNAL_SERVER_ERROR);
    }
}

async function getAirplane(id) {
    try {
        Logger.info('Airplane service: getAirplane called', { id });
        const airplane = await airplaneRepository.get(id);
        if (!airplane) {
            throw new AppError(`Airplane with id ${id} not found`, StatusCodes.NOT_FOUND);
        }
        return airplane;
    } catch (error) {
        Logger.error('Airplane service: getAirplane failed', { error: error.message });
        if (error instanceof AppError) throw error;
        throw new AppError('Cannot fetch airplane', StatusCodes.INTERNAL_SERVER_ERROR);
    }
}

async function updateAirplane(id, data) {
    try {
        Logger.info('Airplane service: updateAirplane called', { id, data });
        const result = await airplaneRepository.update(data, id);
        if (result[0] === 0) {
            throw new AppError(`Airplane with id ${id} not found`, StatusCodes.NOT_FOUND);
        }
        return result;
    } catch (error) {
        Logger.error('Airplane service: updateAirplane failed', { error: error.message });
        if (error instanceof AppError) throw error;
        if (error.name === 'SequelizeValidationError' || error.name === 'SequelizeUniqueConstraintError') {
            throw new AppError(error.errors?.[0]?.message || error.message, StatusCodes.BAD_REQUEST);
        }
        throw new AppError('Cannot update airplane', StatusCodes.INTERNAL_SERVER_ERROR);
    }
}

async function destroyAirplane(id) {
    try {
        Logger.info('Airplane service: destroyAirplane called', { id });
        const response = await airplaneRepository.destroy(id);
        if (response === 0) {
            throw new AppError(`Airplane with id ${id} not found`, StatusCodes.NOT_FOUND);
        }
        return response;
    } catch (error) {
        Logger.error('Airplane service: destroyAirplane failed', { error: error.message });
        if (error instanceof AppError) throw error;
        throw new AppError('Cannot delete airplane', StatusCodes.INTERNAL_SERVER_ERROR);
    }
}

module.exports = {
    createAirplane,
    getAirplanes,
    getAirplane,
    updateAirplane,
    destroyAirplane
};