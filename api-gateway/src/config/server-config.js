const dotenv = require('dotenv');
const path = require('path');
dotenv.config({ path: path.resolve(__dirname, '../../.env') });

module.exports = {
    PORT: process.env.PORT || 3001,
    FLIGHT_SERVICE_URL: process.env.FLIGHT_SERVICE_URL || 'http://localhost:3000',
    BOOKING_SERVICE_URL: process.env.BOOKING_SERVICE_URL || 'http://localhost:3002',
    AUTH_SERVICE_URL: process.env.AUTH_SERVICE_URL || 'http://localhost:3003',
    JWT_SECRET: process.env.JWT_SECRET || 'default-secret-change-me'
}
