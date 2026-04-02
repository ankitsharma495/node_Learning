const express = require('express');
const router = express.Router();

const { Airplanecontroller } = require('../../controllers');
const { AirplaneMiddleware } = require('../../middlewares');

/**
 * @swagger
 * /airplanes:
 *   get:
 *     summary: Get all airplanes
 *     tags: [Airplanes]
 *     responses:
 *       200:
 *         description: List of airplanes
 *   post:
 *     summary: Create an airplane
 *     tags: [Airplanes]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [modelNumber, capacity]
 *             properties:
 *               modelNumber:
 *                 type: string
 *                 example: Boeing 737
 *               capacity:
 *                 type: integer
 *                 example: 180
 *     responses:
 *       201:
 *         description: Airplane created
 *       400:
 *         description: Validation error
 * /airplanes/{id}:
 *   get:
 *     summary: Get an airplane by ID
 *     tags: [Airplanes]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Airplane details
 *       404:
 *         description: Airplane not found
 *   patch:
 *     summary: Update an airplane
 *     tags: [Airplanes]
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
 *               modelNumber:
 *                 type: string
 *               capacity:
 *                 type: integer
 *     responses:
 *       200:
 *         description: Airplane updated
 *   delete:
 *     summary: Delete an airplane
 *     tags: [Airplanes]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Airplane deleted
 */

router.get('/', Airplanecontroller.getAirplanes);
router.post('/', AirplaneMiddleware.validateCreateRequest, Airplanecontroller.createAirplane);
router.get('/:id', Airplanecontroller.getAirplane);
router.patch('/:id', AirplaneMiddleware.validateUpdateRequest, Airplanecontroller.updateAirplane);
router.delete('/:id', Airplanecontroller.destroyAirplane);

module.exports = router;