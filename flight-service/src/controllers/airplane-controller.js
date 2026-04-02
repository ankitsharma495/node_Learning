const { StatusCodes } = require("http-status-codes");
const { AirplaneService } = require("../services");
const { Logger } = require("../config");

/**
 * POST /api/v1/airplanes
 */
async function createAirplane(req, res, next) {
    try {
        Logger.info('Controller: createAirplane request received', { body: req.body });
        const airplane = await AirplaneService.createAirplane({
            modelNumber: req.body.modelNumber,
            capacity: req.body.capacity
        });
        Logger.info('Controller: createAirplane success', { id: airplane.id });
        return res.status(StatusCodes.CREATED).json({
            success: true,
            message: 'Successfully created an airplane',
            data: airplane,
            error: {}
        });
    } catch (error) {
        next(error);
    }
}

/**
 * GET /api/v1/airplanes
 */
async function getAirplanes(req, res, next) {
    try {
        Logger.info('Controller: getAirplanes request received');
        const airplanes = await AirplaneService.getAirplanes();
        Logger.info('Controller: getAirplanes success', { count: airplanes.length });
        return res.status(StatusCodes.OK).json({
            success: true,
            message: 'Successfully fetched all airplanes',
            data: airplanes,
            error: {}
        });
    } catch (error) {
        next(error);
    }
}

/**
 * GET /api/v1/airplanes/:id
 */
async function getAirplane(req, res, next) {
    try {
        Logger.info('Controller: getAirplane request received', { id: req.params.id });
        const airplane = await AirplaneService.getAirplane(req.params.id);
        Logger.info('Controller: getAirplane success', { id: req.params.id });
        return res.status(StatusCodes.OK).json({
            success: true,
            message: 'Successfully fetched the airplane',
            data: airplane,
            error: {}
        });
    } catch (error) {
        next(error);
    }
}

/**
 * PATCH /api/v1/airplanes/:id
 */
async function updateAirplane(req, res, next) {
    try {
        Logger.info('Controller: updateAirplane request received', { id: req.params.id, body: req.body });
        const response = await AirplaneService.updateAirplane(req.params.id, req.body);
        Logger.info('Controller: updateAirplane success', { id: req.params.id });
        return res.status(StatusCodes.OK).json({
            success: true,
            message: 'Successfully updated the airplane',
            data: response,
            error: {}
        });
    } catch (error) {
        next(error);
    }
}

/**
 * DELETE /api/v1/airplanes/:id
 */
async function destroyAirplane(req, res, next) {
    try {
        Logger.info('Controller: destroyAirplane request received', { id: req.params.id });
        const response = await AirplaneService.destroyAirplane(req.params.id);
        Logger.info('Controller: destroyAirplane success', { id: req.params.id });
        return res.status(StatusCodes.OK).json({
            success: true,
            message: 'Successfully deleted the airplane',
            data: response,
            error: {}
        });
    } catch (error) {
        next(error);
    }
}

module.exports = {
    createAirplane,
    getAirplanes,
    getAirplane,
    updateAirplane,
    destroyAirplane
};
