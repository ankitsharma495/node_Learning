const dotenv = require('dotenv');
const path = require('path');
dotenv.config({ path: path.resolve(__dirname, '../../.env') });

module.exports = {
    PORT: process.env.PORT || 3002,
    FLIGHT_SERVICE_URL: process.env.FLIGHT_SERVICE_URL || 'http://localhost:3000'
}
