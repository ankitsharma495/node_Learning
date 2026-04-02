const { StatusCodes } = require('http-status-codes');
const { Logger } = require('../config');
const { AuthService } = require('../services');

async function signup(req, res, next) {
    try {
        Logger.info('Controller: signup request received');
        const user = await AuthService.signup({
            email: req.body.email,
            password: req.body.password,
            role: req.body.role
        });
        return res.status(StatusCodes.CREATED).json({
            success: true,
            message: 'User created successfully',
            data: user,
            error: {}
        });
    } catch (error) {
        next(error);
    }
}

async function login(req, res, next) {
    try {
        Logger.info('Controller: login request received');
        const result = await AuthService.login({
            email: req.body.email,
            password: req.body.password
        });
        return res.status(StatusCodes.OK).json({
            success: true,
            message: 'Login successful',
            data: result,
            error: {}
        });
    } catch (error) {
        next(error);
    }
}

async function verify(req, res, next) {
    try {
        Logger.info('Controller: verify token request received');
        const token = req.headers['authorization']?.split(' ')[1];
        if (!token) {
            return res.status(StatusCodes.UNAUTHORIZED).json({
                success: false,
                message: 'No token provided',
                data: {},
                error: { explanation: 'Provide a Bearer token in the Authorization header' }
            });
        }
        const decoded = AuthService.verifyToken(token);
        return res.status(StatusCodes.OK).json({
            success: true,
            message: 'Token is valid',
            data: decoded,
            error: {}
        });
    } catch (error) {
        next(error);
    }
}

module.exports = {
    signup,
    login,
    verify
}
