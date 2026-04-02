const express = require('express');
const router = express.Router();
const airplaneRoutes = require('./airplane-routes');
const cityRoutes = require('./city-routes');
const airportRoutes = require('./airport-routes');
const flightRoutes = require('./flight-routes');
const { Infocontroller } = require('../../controllers');

router.use('/airplanes', airplaneRoutes);
router.use('/cities', cityRoutes);
router.use('/airports', airportRoutes);
router.use('/flights', flightRoutes);

/**
 * @swagger
 * /info:
 *   get:
 *     summary: API health check with uptime and memory stats
 *     tags: [Health]
 *     responses:
 *       200:
 *         description: API status and server metrics
 */
router.get('/info', Infocontroller.info);

module.exports = router;  