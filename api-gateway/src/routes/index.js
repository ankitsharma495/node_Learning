const express = require('express');
const axios = require('axios');
const { StatusCodes } = require('http-status-codes');
const { serverConfig, Logger } = require('../config');
const { authenticate } = require('../middlewares/auth-middleware');

const router = express.Router();

// ──────────────────────────────────────────────
// AUTH ROUTES — Proxy to Auth Service (no auth needed)
// ──────────────────────────────────────────────

router.post('/auth/signup', async (req, res) => {
    try {
        const response = await axios.post(`${serverConfig.AUTH_SERVICE_URL}/api/v1/signup`, req.body);
        return res.status(response.status).json(response.data);
    } catch (error) {
        return forwardError(res, error, 'Auth Service');
    }
});

router.post('/auth/login', async (req, res) => {
    try {
        const response = await axios.post(`${serverConfig.AUTH_SERVICE_URL}/api/v1/login`, req.body);
        return res.status(response.status).json(response.data);
    } catch (error) {
        return forwardError(res, error, 'Auth Service');
    }
});

// ──────────────────────────────────────────────
// FLIGHT SERVICE ROUTES — Public read, auth for write
// ──────────────────────────────────────────────

// Public: anyone can browse flights, cities, airports, airplanes
router.get('/flights', proxy('GET', '/flights'));
router.get('/flights/:id', proxy('GET', '/flights/:id'));
router.get('/cities', proxy('GET', '/cities'));
router.get('/cities/:id', proxy('GET', '/cities/:id'));
router.get('/airports', proxy('GET', '/airports'));
router.get('/airports/:id', proxy('GET', '/airports/:id'));
router.get('/airplanes', proxy('GET', '/airplanes'));
router.get('/airplanes/:id', proxy('GET', '/airplanes/:id'));
router.get('/info', proxy('GET', '/info'));

// Protected: must be logged in to create/update/delete flights etc.
router.post('/flights', authenticate, proxy('POST', '/flights'));
router.patch('/flights/:id', authenticate, proxy('PATCH', '/flights/:id'));
router.delete('/flights/:id', authenticate, proxy('DELETE', '/flights/:id'));
router.patch('/flights/:id/seats', authenticate, proxy('PATCH', '/flights/:id/seats'));

router.post('/cities', authenticate, proxy('POST', '/cities'));
router.patch('/cities/:id', authenticate, proxy('PATCH', '/cities/:id'));
router.delete('/cities/:id', authenticate, proxy('DELETE', '/cities/:id'));

router.post('/airports', authenticate, proxy('POST', '/airports'));
router.patch('/airports/:id', authenticate, proxy('PATCH', '/airports/:id'));
router.delete('/airports/:id', authenticate, proxy('DELETE', '/airports/:id'));

router.post('/airplanes', authenticate, proxy('POST', '/airplanes'));
router.patch('/airplanes/:id', authenticate, proxy('PATCH', '/airplanes/:id'));
router.delete('/airplanes/:id', authenticate, proxy('DELETE', '/airplanes/:id'));

// ──────────────────────────────────────────────
// BOOKING ROUTES — All protected
// ──────────────────────────────────────────────

router.post('/bookings', authenticate, async (req, res) => {
    try {
        // Inject userId from JWT token
        const body = { ...req.body, userId: req.user.id };
        const response = await axios.post(`${serverConfig.BOOKING_SERVICE_URL}/api/v1/bookings`, body);
        return res.status(response.status).json(response.data);
    } catch (error) {
        return forwardError(res, error, 'Booking Service');
    }
});

router.get('/bookings', authenticate, async (req, res) => {
    try {
        // Users see their own bookings, query by userId from token
        const url = `${serverConfig.BOOKING_SERVICE_URL}/api/v1/bookings?userId=${req.user.id}`;
        const response = await axios.get(url);
        return res.status(response.status).json(response.data);
    } catch (error) {
        return forwardError(res, error, 'Booking Service');
    }
});

router.get('/bookings/:id', authenticate, async (req, res) => {
    try {
        const response = await axios.get(`${serverConfig.BOOKING_SERVICE_URL}/api/v1/bookings/${req.params.id}`);
        return res.status(response.status).json(response.data);
    } catch (error) {
        return forwardError(res, error, 'Booking Service');
    }
});

router.patch('/bookings/:id/cancel', authenticate, async (req, res) => {
    try {
        const response = await axios.patch(`${serverConfig.BOOKING_SERVICE_URL}/api/v1/bookings/${req.params.id}/cancel`);
        return res.status(response.status).json(response.data);
    } catch (error) {
        return forwardError(res, error, 'Booking Service');
    }
});

// ──────────────────────────────────────────────
// HELPER: Forward downstream error responses
// ──────────────────────────────────────────────

function proxy(method, pathTemplate) {
    return async (req, res) => {
        try {
            let targetPath = pathTemplate;
            for (const [key, value] of Object.entries(req.params)) {
                targetPath = targetPath.replace(`:${key}`, value);
            }
            const url = `${serverConfig.FLIGHT_SERVICE_URL}/api/v1${targetPath}`;
            const config = { method, url };

            if (req.query && Object.keys(req.query).length) {
                config.params = req.query;
            }
            if (['POST', 'PATCH', 'PUT'].includes(method) && req.body) {
                config.data = req.body;
            }

            const response = await axios(config);
            return res.status(response.status).json(response.data);
        } catch (error) {
            return forwardError(res, error, 'Flight Service');
        }
    };
}

function forwardError(res, error, serviceName) {
    if (error.response) {
        Logger.warn(`Gateway: ${serviceName} responded with ${error.response.status}`, {
            path: error.config?.url,
            status: error.response.status
        });
        return res.status(error.response.status).json(error.response.data);
    }
    Logger.error(`Gateway: ${serviceName} is unreachable`, { error: error.message });
    return res.status(StatusCodes.SERVICE_UNAVAILABLE).json({
        success: false,
        message: `${serviceName} is currently unavailable`,
        data: {},
        error: { explanation: 'The downstream service is not responding' }
    });
}

module.exports = router;
