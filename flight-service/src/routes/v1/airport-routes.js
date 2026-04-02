const express = require('express');
const router = express.Router();

const { Airportcontroller } = require('../../controllers');
const { AirportMiddleware } = require('../../middlewares');

/**
 * @swagger
 * /airports:
 *   get:
 *     summary: Get all airports (with city data)
 *     tags: [Airports]
 *     responses:
 *       200:
 *         description: List of airports with nested city info
 *   post:
 *     summary: Create an airport
 *     tags: [Airports]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [name, code, address, cityId]
 *             properties:
 *               name:
 *                 type: string
 *                 example: Chhatrapati Shivaji International Airport
 *               code:
 *                 type: string
 *                 example: BOM
 *               address:
 *                 type: string
 *                 example: Mumbai, Maharashtra
 *               cityId:
 *                 type: integer
 *                 example: 1
 *     responses:
 *       201:
 *         description: Airport created
 *       400:
 *         description: Validation error
 * /airports/{id}:
 *   get:
 *     summary: Get an airport by ID (with city data)
 *     tags: [Airports]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Airport details with city
 *       404:
 *         description: Airport not found
 *   patch:
 *     summary: Update an airport
 *     tags: [Airports]
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
 *               name:
 *                 type: string
 *               code:
 *                 type: string
 *               address:
 *                 type: string
 *               cityId:
 *                 type: integer
 *     responses:
 *       200:
 *         description: Airport updated
 *   delete:
 *     summary: Delete an airport
 *     tags: [Airports]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Airport deleted
 */

router.get('/', Airportcontroller.getAirports);
router.post('/', AirportMiddleware.validateCreateRequest, Airportcontroller.createAirport);
router.get('/:id', Airportcontroller.getAirport);
router.patch('/:id', AirportMiddleware.validateUpdateRequest, Airportcontroller.updateAirport);
router.delete('/:id', Airportcontroller.destroyAirport);

module.exports = router;
