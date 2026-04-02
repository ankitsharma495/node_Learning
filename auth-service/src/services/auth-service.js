const jwt = require('jsonwebtoken');
const { StatusCodes } = require('http-status-codes');
const { Logger, serverConfig } = require('../config');
const AppError = require('../utils/errors/app-error');
const UserRepository = require('../repositories/user-repository');

const userRepository = new UserRepository();

async function signup(data) {
    try {
        Logger.info('Service: signup called', { email: data.email });
        const existingUser = await userRepository.findByEmail(data.email);
        if (existingUser) {
            throw new AppError('A user with this email already exists', StatusCodes.CONFLICT);
        }
        const user = await userRepository.create(data);
        return {
            id: user.id,
            email: user.email,
            role: user.role
        };
    } catch (error) {
        if (error instanceof AppError) throw error;
        if (error.name === 'SequelizeValidationError') {
            throw new AppError(error.errors?.[0]?.message || error.message, StatusCodes.BAD_REQUEST);
        }
        Logger.error('Service: signup error', { error: error.message });
        throw new AppError('Failed to create user', StatusCodes.INTERNAL_SERVER_ERROR);
    }
}

async function login(data) {
    try {
        Logger.info('Service: login called', { email: data.email });
        const user = await userRepository.findByEmail(data.email);
        if (!user) {
            throw new AppError('Invalid email or password', StatusCodes.UNAUTHORIZED);
        }
        const isMatch = await user.comparePassword(data.password);
        if (!isMatch) {
            throw new AppError('Invalid email or password', StatusCodes.UNAUTHORIZED);
        }
        const token = jwt.sign(
            { id: user.id, email: user.email, role: user.role },
            serverConfig.JWT_SECRET,
            { expiresIn: serverConfig.JWT_EXPIRY }
        );
        return { token, user: { id: user.id, email: user.email, role: user.role } };
    } catch (error) {
        if (error instanceof AppError) throw error;
        Logger.error('Service: login error', { error: error.message });
        throw new AppError('Login failed', StatusCodes.INTERNAL_SERVER_ERROR);
    }
}

function verifyToken(token) {
    try {
        const decoded = jwt.verify(token, serverConfig.JWT_SECRET);
        return decoded;
    } catch (error) {
        throw new AppError('Invalid or expired token', StatusCodes.UNAUTHORIZED);
    }
}

module.exports = {
    signup,
    login,
    verifyToken
}
