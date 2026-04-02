const { StatusCodes } = require('http-status-codes');
const { Logger } = require('../config');

function validateSignupRequest(req, res, next) {
    if (!req.body.email || typeof req.body.email !== 'string') {
        Logger.warn('Middleware: signup validation — email missing');
        return res.status(StatusCodes.BAD_REQUEST).json({
            success: false,
            message: 'Email is required',
            data: {},
            error: { explanation: 'Provide a valid email address' }
        });
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(req.body.email)) {
        Logger.warn('Middleware: signup validation — invalid email format');
        return res.status(StatusCodes.BAD_REQUEST).json({
            success: false,
            message: 'Invalid email format',
            data: {},
            error: { explanation: 'Provide a valid email address' }
        });
    }

    if (!req.body.password || typeof req.body.password !== 'string' || req.body.password.length < 6) {
        Logger.warn('Middleware: signup validation — password too short');
        return res.status(StatusCodes.BAD_REQUEST).json({
            success: false,
            message: 'Password must be at least 6 characters',
            data: {},
            error: { explanation: 'Provide a password with at least 6 characters' }
        });
    }

    if (req.body.role && !['user', 'admin'].includes(req.body.role)) {
        Logger.warn('Middleware: signup validation — invalid role');
        return res.status(StatusCodes.BAD_REQUEST).json({
            success: false,
            message: 'Role must be either user or admin',
            data: {},
            error: { explanation: 'Valid roles are: user, admin' }
        });
    }

    Logger.info('Middleware: signup validation passed');
    next();
}

function validateLoginRequest(req, res, next) {
    if (!req.body.email || !req.body.password) {
        Logger.warn('Middleware: login validation — missing credentials');
        return res.status(StatusCodes.BAD_REQUEST).json({
            success: false,
            message: 'Email and password are required',
            data: {},
            error: { explanation: 'Provide both email and password' }
        });
    }

    Logger.info('Middleware: login validation passed');
    next();
}

module.exports = {
    validateSignupRequest,
    validateLoginRequest
}
