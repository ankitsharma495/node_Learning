const express = require('express');
const router = express.Router();
const { BookingController } = require('../../controllers');
const { BookingMiddleware } = require('../../middlewares');

router.post('/', BookingMiddleware.validateCreateBooking, BookingController.createBooking);
router.get('/', BookingController.getBookings);
router.get('/:id', BookingController.getBooking);
router.patch('/:id/cancel', BookingController.cancelBooking);

module.exports = router;
