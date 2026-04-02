const { StatusCodes } = require("http-status-codes");
const { CityService } = require("../services");
const { Logger } = require("../config");

/**
 * POST /api/v1/cities
 */
async function createCity(req, res, next) {
    try {
        Logger.info('Controller: createCity request received', { body: req.body });
        const city = await CityService.createCity({
            name: req.body.name
        });
        Logger.info('Controller: createCity success', { id: city.id });
        return res.status(StatusCodes.CREATED).json({
            success: true,
            message: 'Successfully created a city',
            data: city,
            error: {}
        });
    } catch (error) {
        next(error);
    }
}

/**
 * GET /api/v1/cities
 */
async function getCities(req, res, next) {
    try {
        Logger.info('Controller: getCities request received');
        const cities = await CityService.getCities();
        Logger.info('Controller: getCities success', { count: cities.length });
        return res.status(StatusCodes.OK).json({
            success: true,
            message: 'Successfully fetched all cities',
            data: cities,
            error: {}
        });
    } catch (error) {
        next(error);
    }
}

/**
 * GET /api/v1/cities/:id
 */
async function getCity(req, res, next) {
    try {
        Logger.info('Controller: getCity request received', { id: req.params.id });
        const city = await CityService.getCity(req.params.id);
        Logger.info('Controller: getCity success', { id: req.params.id });
        return res.status(StatusCodes.OK).json({
            success: true,
            message: 'Successfully fetched the city',
            data: city,
            error: {}
        });
    } catch (error) {
        next(error);
    }
}

/**
 * PATCH /api/v1/cities/:id
 */
async function updateCity(req, res, next) {
    try {
        Logger.info('Controller: updateCity request received', { id: req.params.id, body: req.body });
        const response = await CityService.updateCity(req.params.id, req.body);
        Logger.info('Controller: updateCity success', { id: req.params.id });
        return res.status(StatusCodes.OK).json({
            success: true,
            message: 'Successfully updated the city',
            data: response,
            error: {}
        });
    } catch (error) {
        next(error);
    }
}

/**
 * DELETE /api/v1/cities/:id
 */
async function destroyCity(req, res, next) {
    try {
        Logger.info('Controller: destroyCity request received', { id: req.params.id });
        const response = await CityService.destroyCity(req.params.id);
        Logger.info('Controller: destroyCity success', { id: req.params.id });
        return res.status(StatusCodes.OK).json({
            success: true,
            message: 'Successfully deleted the city',
            data: response,
            error: {}
        });
    } catch (error) {
        next(error);
    }
}

module.exports = {
    createCity,
    getCities,
    getCity,
    updateCity,
    destroyCity
};
