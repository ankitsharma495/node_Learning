const { Logger } = require('../config');
const db = require('../models');

async function info(req, res, next) {
    try {
        // Check database connectivity
        let dbStatus = 'healthy';
        try {
            await db.sequelize.authenticate();
        } catch {
            dbStatus = 'unhealthy';
        }

        const memoryUsage = process.memoryUsage();

        Logger.info('Health check request received');
        return res.json({
            success: true,
            message: 'API is working',
            data: {
                uptime: Math.floor(process.uptime()),
                database: dbStatus,
                memory: {
                    rss: `${Math.round(memoryUsage.rss / 1024 / 1024)} MB`,
                    heapUsed: `${Math.round(memoryUsage.heapUsed / 1024 / 1024)} MB`
                },
                timestamp: new Date().toISOString()
            },
            error: {}
        });
    } catch (error) {
        next(error);
    }
}

module.exports = {
    info
}