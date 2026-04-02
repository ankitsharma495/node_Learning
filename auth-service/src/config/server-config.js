const dotenv = require('dotenv');
const path = require('path');
dotenv.config({ path: path.resolve(__dirname, '../../.env') });

module.exports = {
    PORT: process.env.PORT || 3003,
    JWT_SECRET: process.env.JWT_SECRET || 'default-secret-change-me',
    JWT_EXPIRY: process.env.JWT_EXPIRY || '24h'
}
