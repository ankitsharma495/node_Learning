const path = require('path');
require('dotenv').config({ path: path.resolve(__dirname, '../../.env') });

module.exports = {
    development: {
        username: process.env.DB_USERNAME || 'root',
        password: process.env.DB_PASSWORD || null,
        database: process.env.DB_NAME || 'Auth_DB',
        host: process.env.DB_HOST || '127.0.0.1',
        dialect: process.env.DB_DIALECT || 'mysql'
    },
    test: {
        username: process.env.DB_USERNAME || 'root',
        password: process.env.DB_PASSWORD || null,
        database: process.env.DB_NAME || 'Auth_DB_Test',
        host: process.env.DB_HOST || '127.0.0.1',
        dialect: process.env.DB_DIALECT || 'mysql'
    },
    production: {
        username: process.env.DB_USERNAME,
        password: process.env.DB_PASSWORD,
        database: process.env.DB_NAME,
        host: process.env.DB_HOST,
        dialect: process.env.DB_DIALECT || 'mysql'
    }
};
