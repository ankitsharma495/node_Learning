const express = require('express');
const router = express.Router();

const { Citycontroller } = require('../../controllers');
const { CityMiddleware } = require('../../middlewares');

/**
 * @swagger
 * /cities:
 *   get:
 *     summary: Get all cities
 *     tags: [Cities]
 *     responses:
 *       200:
 *         description: List of cities
 *   post:
 *     summary: Create a city
 *     tags: [Cities]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [name]
 *             properties:
 *               name:
 *                 type: string
 *                 example: Mumbai
 *     responses:
 *       201:
 *         description: City created
 *       400:
 *         description: Validation error
 * /cities/{id}:
 *   get:
 *     summary: Get a city by ID
 *     tags: [Cities]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: City details
 *       404:
 *         description: City not found
 *   patch:
 *     summary: Update a city
 *     tags: [Cities]
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
 *     responses:
 *       200:
 *         description: City updated
 *   delete:
 *     summary: Delete a city (cascades to airports)
 *     tags: [Cities]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: City deleted
 */

router.get('/', Citycontroller.getCities);
router.post('/', CityMiddleware.validateCreateRequest, Citycontroller.createCity);
router.get('/:id', Citycontroller.getCity);
router.patch('/:id', CityMiddleware.validateUpdateRequest, Citycontroller.updateCity);
router.delete('/:id', Citycontroller.destroyCity);

module.exports = router;
