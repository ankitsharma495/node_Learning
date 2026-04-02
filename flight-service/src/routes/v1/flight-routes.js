const express = require('express');
const router = express.Router();

const { Flightcontroller } = require('../../controllers');
const { FlightMiddleware } = require('../../middlewares');

/**
 * @swagger
 * /flights:
 *   get:
 *     summary: Get all flights (with filtering and sorting)
 *     tags: [Flights]
 *     parameters:
 *       - in: query
 *         name: departureAirportId
 *         schema:
 *           type: string
 *         description: Departure airport code (e.g. DEL)
 *       - in: query
 *         name: arrivalAirportId
 *         schema:
 *           type: string
 *         description: Arrival airport code (e.g. BOM)
 *       - in: query
 *         name: minPrice
 *         schema:
 *           type: integer
 *         description: Minimum price filter
 *       - in: query
 *         name: maxPrice
 *         schema:
 *           type: integer
 *         description: Maximum price filter
 *       - in: query
 *         name: departureTime
 *         schema:
 *           type: string
 *           format: date
 *         description: Filter flights departing on this date (YYYY-MM-DD)
 *       - in: query
 *         name: sort
 *         schema:
 *           type: string
 *           enum: [departureTime, arrivalTime, price, flightNumber, totalSeats, remainingSeats, createdAt]
 *         description: Sort field (default departureTime)
 *       - in: query
 *         name: order
 *         schema:
 *           type: string
 *           enum: [ASC, DESC]
 *         description: Sort order (default ASC)
 *     responses:
 *       200:
 *         description: List of flights with airplane and airport data
 *   post:
 *     summary: Create a flight
 *     tags: [Flights]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [flightNumber, airplaneId, departureAirportId, arrivalAirportId, departureTime, arrivalTime, price, totalSeats, remainingSeats]
 *             properties:
 *               flightNumber:
 *                 type: string
 *                 example: AI-302
 *               airplaneId:
 *                 type: integer
 *                 example: 1
 *               departureAirportId:
 *                 type: string
 *                 example: DEL
 *               arrivalAirportId:
 *                 type: string
 *                 example: BOM
 *               departureTime:
 *                 type: string
 *                 format: date-time
 *               arrivalTime:
 *                 type: string
 *                 format: date-time
 *               price:
 *                 type: integer
 *                 example: 4500
 *               boardingGate:
 *                 type: string
 *                 example: A12
 *               totalSeats:
 *                 type: integer
 *                 example: 180
 *               remainingSeats:
 *                 type: integer
 *                 example: 180
 *     responses:
 *       201:
 *         description: Flight created
 *       400:
 *         description: Validation error
 * /flights/{id}:
 *   get:
 *     summary: Get a flight by ID (with airplane and airports)
 *     tags: [Flights]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Flight details
 *       404:
 *         description: Flight not found
 *   patch:
 *     summary: Update a flight
 *     tags: [Flights]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     requestBody:
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               flightNumber:
 *                 type: string
 *               price:
 *                 type: integer
 *               boardingGate:
 *                 type: string
 *     responses:
 *       200:
 *         description: Flight updated
 *   delete:
 *     summary: Delete a flight
 *     tags: [Flights]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Flight deleted
 * /flights/{id}/seats:
 *   patch:
 *     summary: Update remaining seats (for booking service)
 *     tags: [Flights]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [remainingSeats]
 *             properties:
 *               remainingSeats:
 *                 type: integer
 *                 example: 150
 *     responses:
 *       200:
 *         description: Seats updated
 *       400:
 *         description: Validation error
 */

router.get('/', Flightcontroller.getFlights);
router.post('/', FlightMiddleware.validateCreateRequest, Flightcontroller.createFlight);
router.get('/:id', Flightcontroller.getFlight);
router.patch('/:id', FlightMiddleware.validateUpdateRequest, Flightcontroller.updateFlight);
router.delete('/:id', Flightcontroller.destroyFlight);
router.patch('/:id/seats', FlightMiddleware.validateUpdateSeatsRequest, Flightcontroller.updateSeats);

module.exports = router;
