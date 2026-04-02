const { StatusCodes } = require("http-status-codes");
const { FlightService } = require("../services");
const { Logger } = require("../config");

/**
 * POST /api/v1/flights
 */
async function createFlight(req, res, next) {
    try {
        Logger.info('Controller: createFlight request received', { body: req.body });
        const flight = await FlightService.createFlight({
            flightNumber: req.body.flightNumber,
            airplaneId: req.body.airplaneId,
            departureAirportId: req.body.departureAirportId,
            arrivalAirportId: req.body.arrivalAirportId,
            departureTime: req.body.departureTime,
            arrivalTime: req.body.arrivalTime,
            price: req.body.price,
            boardingGate: req.body.boardingGate,
            totalSeats: req.body.totalSeats,
            remainingSeats: req.body.remainingSeats
        });
        Logger.info('Controller: createFlight success', { id: flight.id });
        return res.status(StatusCodes.CREATED).json({
            success: true,
            message: 'Successfully created a flight',
            data: flight,
            error: {}
        });
    } catch (error) {
        next(error);
    }
}

/**
 * GET /api/v1/flights (with query param filtering)
 */
async function getFlights(req, res, next) {
    try {
        Logger.info('Controller: getFlights request received', { query: req.query });
        const filter = {
            departureAirportId: req.query.departureAirportId,
            arrivalAirportId: req.query.arrivalAirportId,
            minPrice: req.query.minPrice ? parseInt(req.query.minPrice) : undefined,
            maxPrice: req.query.maxPrice ? parseInt(req.query.maxPrice) : undefined,
            departureTime: req.query.departureTime,
            sort: req.query.sort,
            order: req.query.order
        };
        const flights = await FlightService.getFlights(filter);
        Logger.info('Controller: getFlights success', { count: flights.length });
        return res.status(StatusCodes.OK).json({
            success: true,
            message: 'Successfully fetched flights',
            data: flights,
            error: {}
        });
    } catch (error) {
        next(error);
    }
}

/**
 * GET /api/v1/flights/:id
 */
async function getFlight(req, res, next) {
    try {
        Logger.info('Controller: getFlight request received', { id: req.params.id });
        const flight = await FlightService.getFlight(req.params.id);
        Logger.info('Controller: getFlight success', { id: req.params.id });
        return res.status(StatusCodes.OK).json({
            success: true,
            message: 'Successfully fetched the flight',
            data: flight,
            error: {}
        });
    } catch (error) {
        next(error);
    }
}

/**
 * PATCH /api/v1/flights/:id
 */
async function updateFlight(req, res, next) {
    try {
        Logger.info('Controller: updateFlight request received', { id: req.params.id, body: req.body });
        const response = await FlightService.updateFlight(req.params.id, req.body);
        Logger.info('Controller: updateFlight success', { id: req.params.id });
        return res.status(StatusCodes.OK).json({
            success: true,
            message: 'Successfully updated the flight',
            data: response,
            error: {}
        });
    } catch (error) {
        next(error);
    }
}

/**
 * DELETE /api/v1/flights/:id
 */
async function destroyFlight(req, res, next) {
    try {
        Logger.info('Controller: destroyFlight request received', { id: req.params.id });
        const response = await FlightService.destroyFlight(req.params.id);
        Logger.info('Controller: destroyFlight success', { id: req.params.id });
        return res.status(StatusCodes.OK).json({
            success: true,
            message: 'Successfully deleted the flight',
            data: response,
            error: {}
        });
    } catch (error) {
        next(error);
    }
}

/**
 * PATCH /api/v1/flights/:id/seats
 */
async function updateSeats(req, res, next) {
    try {
        Logger.info('Controller: updateSeats request received', { id: req.params.id, body: req.body });
        const response = await FlightService.updateRemainingSeats(req.params.id, req.body.remainingSeats);
        Logger.info('Controller: updateSeats success', { id: req.params.id });
        return res.status(StatusCodes.OK).json({
            success: true,
            message: 'Successfully updated remaining seats',
            data: response,
            error: {}
        });
    } catch (error) {
        next(error);
    }
}

module.exports = {
    createFlight,
    getFlights,
    getFlight,
    updateFlight,
    destroyFlight,
    updateSeats
};
