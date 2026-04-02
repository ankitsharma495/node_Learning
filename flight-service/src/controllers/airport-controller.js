const { StatusCodes } = require("http-status-codes");
const { AirportService } = require("../services");
const { Logger } = require("../config");

/**
 * POST /api/v1/airports
 */
async function createAirport(req, res, next) {
    try {
        Logger.info('Controller: createAirport request received', { body: req.body });
        const airport = await AirportService.createAirport({
            name: req.body.name,
            code: req.body.code,
            address: req.body.address,
            cityId: req.body.cityId
        });
        Logger.info('Controller: createAirport success', { id: airport.id });
        return res.status(StatusCodes.CREATED).json({
            success: true,
            message: 'Successfully created an airport',
            data: airport,
            error: {}
        });
    } catch (error) {
        next(error);
    }
}

/**
 * GET /api/v1/airports
 */
async function getAirports(req, res, next) {
    try {
        Logger.info('Controller: getAirports request received');
        const airports = await AirportService.getAirports();
        Logger.info('Controller: getAirports success', { count: airports.length });
        return res.status(StatusCodes.OK).json({
            success: true,
            message: 'Successfully fetched all airports',
            data: airports,
            error: {}
        });
    } catch (error) {
        next(error);
    }
}

/**
 * GET /api/v1/airports/:id
 */
async function getAirport(req, res, next) {
    try {
        Logger.info('Controller: getAirport request received', { id: req.params.id });
        const airport = await AirportService.getAirport(req.params.id);
        Logger.info('Controller: getAirport success', { id: req.params.id });
        return res.status(StatusCodes.OK).json({
            success: true,
            message: 'Successfully fetched the airport',
            data: airport,
            error: {}
        });
    } catch (error) {
        next(error);
    }
}

/**
 * PATCH /api/v1/airports/:id
 */
async function updateAirport(req, res, next) {
    try {
        Logger.info('Controller: updateAirport request received', { id: req.params.id, body: req.body });
        const response = await AirportService.updateAirport(req.params.id, req.body);
        Logger.info('Controller: updateAirport success', { id: req.params.id });
        return res.status(StatusCodes.OK).json({
            success: true,
            message: 'Successfully updated the airport',
            data: response,
            error: {}
        });
    } catch (error) {
        next(error);
    }
}

/**
 * DELETE /api/v1/airports/:id
 */
async function destroyAirport(req, res, next) {
    try {
        Logger.info('Controller: destroyAirport request received', { id: req.params.id });
        const response = await AirportService.destroyAirport(req.params.id);
        Logger.info('Controller: destroyAirport success', { id: req.params.id });
        return res.status(StatusCodes.OK).json({
            success: true,
            message: 'Successfully deleted the airport',
            data: response,
            error: {}
        });
    } catch (error) {
        next(error);
    }
}

module.exports = {
    createAirport,
    getAirports,
    getAirport,
    updateAirport,
    destroyAirport
};
