const winston = require('winston');

/*
 * Winston Logger Configuration
 * 
 * HOW WINSTON WORKS:
 * 
 * 1. You create a "logger" instance with createLogger()
 * 2. You tell it what FORMAT to use (how logs should look)
 * 3. You tell it what TRANSPORTS to use (where logs should go)
 * 4. You set a LOG LEVEL (which severity and above to capture)
 * 
 * LOG LEVELS (from most severe to least):
 *   error: 0   → Something broke, needs immediate attention
 *   warn:  1   → Something unexpected, but app still works
 *   info:  2   → Normal operation events (server started, request received)
 *   http:  3   → HTTP request/response logging
 *   debug: 4   → Detailed info for debugging (variable values, flow tracing)
 * 
 * If you set level to 'info', it captures: error + warn + info
 * If you set level to 'debug', it captures: error + warn + info + http + debug
 */

const logger = winston.createLogger({

    // Set the minimum level to log. 
    // 'info' means: log error, warn, and info. Ignore http and debug.
    level: 'info',

    // FORMAT: How each log entry looks.
    // combine() lets us stack multiple format rules together.
    format: winston.format.combine(

        // Add a timestamp to every log entry
        // Example: "2026-04-02T10:30:00.000Z"
        winston.format.timestamp({
            format: 'YYYY-MM-DD HH:mm:ss'
        }),

        // Output as JSON. This makes logs machine-readable.
        // Example: {"level":"info","message":"Server started","timestamp":"2026-04-02 10:30:00"}
        winston.format.json()
    ),

    // TRANSPORTS: Where do logs go?
    transports: [

        // Transport 1: Write ALL logs (info and above) to a file
        // This file grows over time — useful for post-mortem debugging
        new winston.transports.File({
            filename: 'logs/combined.log'
        }),

        // Transport 2: Write ONLY error logs to a separate file
        // When something breaks at 3am, you check this file first
        new winston.transports.File({
            filename: 'logs/error.log',
            level: 'error'   // Only error-level logs go here
        })
    ]
});

/*
 * In development (non-production), also log to the CONSOLE.
 * 
 * Why not in production? Because in production, logs usually go to 
 * a log aggregator (CloudWatch, Datadog, ELK) via the file transport 
 * or a dedicated transport. Console output in Docker containers is 
 * captured by the container runtime anyway.
 * 
 * colorize() makes errors red, warnings yellow, info green in terminal.
 * simple() outputs: "info: Server started on port 3000" (human-readable)
 */
if (process.env.NODE_ENV !== 'production') {
    logger.add(new winston.transports.Console({
        format: winston.format.combine(
            winston.format.colorize(),   // Colors based on level
            winston.format.simple()      // "level: message" format
        )
    }));
}

module.exports = logger;