const express = require('express');
const router = express.Router();
const { AuthController } = require('../../controllers');
const { AuthMiddleware } = require('../../middlewares');

router.post('/signup', AuthMiddleware.validateSignupRequest, AuthController.signup);
router.post('/login', AuthMiddleware.validateLoginRequest, AuthController.login);
router.get('/verify', AuthController.verify);

module.exports = router;
