const { CityRepository } = require('../repositories');
const { Logger } = require('../config');
const { AppError } = require('../utils');
const { StatusCodes } = require('http-status-codes');

const cityRepository = new CityRepository();

async function createCity(data) {
    try {
        Logger.info('City service: createCity called', { data });
        const city = await cityRepository.create(data);
        return city;
    } catch (error) {
        Logger.error('City service: createCity failed', { error: error.message });
        if (error.name === 'SequelizeValidationError' || error.name === 'SequelizeUniqueConstraintError') {
            throw new AppError(error.errors?.[0]?.message || error.message, StatusCodes.BAD_REQUEST);
        }
        throw new AppError('Cannot create city', StatusCodes.INTERNAL_SERVER_ERROR);
    }
}

async function getCities() {
    try {
        Logger.info('City service: getCities called');
        const cities = await cityRepository.getAll();
        return cities;
    } catch (error) {
        Logger.error('City service: getCities failed', { error: error.message });
        throw new AppError('Cannot fetch cities', StatusCodes.INTERNAL_SERVER_ERROR);
    }
}

async function getCity(id) {
    try {
        Logger.info('City service: getCity called', { id });
        const city = await cityRepository.get(id);
        if (!city) {
            throw new AppError(`City with id ${id} not found`, StatusCodes.NOT_FOUND);
        }
        return city;
    } catch (error) {
        Logger.error('City service: getCity failed', { error: error.message });
        if (error instanceof AppError) throw error;
        throw new AppError('Cannot fetch city', StatusCodes.INTERNAL_SERVER_ERROR);
    }
}

async function updateCity(id, data) {
    try {
        Logger.info('City service: updateCity called', { id, data });
        const result = await cityRepository.update(data, id);
        if (result[0] === 0) {
            throw new AppError(`City with id ${id} not found`, StatusCodes.NOT_FOUND);
        }
        return result;
    } catch (error) {
        Logger.error('City service: updateCity failed', { error: error.message });
        if (error instanceof AppError) throw error;
        if (error.name === 'SequelizeValidationError' || error.name === 'SequelizeUniqueConstraintError') {
            throw new AppError(error.errors?.[0]?.message || error.message, StatusCodes.BAD_REQUEST);
        }
        throw new AppError('Cannot update city', StatusCodes.INTERNAL_SERVER_ERROR);
    }
}

async function destroyCity(id) {
    try {
        Logger.info('City service: destroyCity called', { id });
        const response = await cityRepository.destroy(id);
        if (response === 0) {
            throw new AppError(`City with id ${id} not found`, StatusCodes.NOT_FOUND);
        }
        return response;
    } catch (error) {
        Logger.error('City service: destroyCity failed', { error: error.message });
        if (error instanceof AppError) throw error;
        throw new AppError('Cannot delete city', StatusCodes.INTERNAL_SERVER_ERROR);
    }
}

module.exports = {
    createCity,
    getCities,
    getCity,
    updateCity,
    destroyCity
};
