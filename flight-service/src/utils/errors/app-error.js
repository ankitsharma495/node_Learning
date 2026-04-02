const { StatusCodes } = require('http-status-codes');

class AppError extends Error {
    constructor(message, statusCode) {
        super(message);
        this.name = 'AppError';
        this.statusCode = statusCode;
        this.explanation = message;
    }
}

module.exports = AppError;