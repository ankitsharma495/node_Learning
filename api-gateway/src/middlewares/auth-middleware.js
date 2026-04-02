const jwt = require('jsonwebtoken');
const { StatusCodes } = require('http-status-codes');
const { serverConfig, Logger } = require('../config');

function authenticate(req, res, next) {
    const authHeader = req.headers['authorization'];
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
        Logger.warn('Gateway: Missing or malformed Authorization header', { path: req.path });
        return res.status(StatusCodes.UNAUTHORIZED).json({
            success: false,
            message: 'Authentication required',
            data: {},
            error: { explanation: 'Provide a valid Bearer token in the Authorization header' }
        });
    }

    const token = authHeader.split(' ')[1];
    try {
        const decoded = jwt.verify(token, serverConfig.JWT_SECRET);
        req.user = decoded;
        Logger.info('Gateway: Token verified', { userId: decoded.id, role: decoded.role });
        next();
    } catch (error) {
        Logger.warn('Gateway: Invalid token', { error: error.message });
        return res.status(StatusCodes.UNAUTHORIZED).json({
            success: false,
            message: 'Invalid or expired token',
            data: {},
            error: { explanation: 'Token verification failed — login again' }
        });
    }
}

function authorizeAdmin(req, res, next) {
    if (req.user?.role !== 'admin') {
        Logger.warn('Gateway: Admin access denied', { userId: req.user?.id, role: req.user?.role });
        return res.status(StatusCodes.FORBIDDEN).json({
            success: false,
            message: 'Admin access required',
            data: {},
            error: { explanation: 'This route requires admin privileges' }
        });
    }
    next();
}

module.exports = {
    authenticate,
    authorizeAdmin
}
