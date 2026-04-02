const swaggerJsdoc = require('swagger-jsdoc');

const options = {
    definition: {
        openapi: '3.0.0',
        info: {
            title: 'Flight Service API',
            version: '1.0.0',
            description: 'Airline Booking System — Flight Service. Manages cities, airports, airplanes, and flights with filtering, sorting, and seat inventory.',
            contact: {
                name: 'API Support'
            }
        },
        servers: [
            {
                url: '/api/v1',
                description: 'Version 1'
            }
        ],
        components: {
            securitySchemes: {
                ApiKeyAuth: {
                    type: 'apiKey',
                    in: 'header',
                    name: 'x-api-key',
                    description: 'API key (optional — only enforced when API_KEY is set in .env)'
                }
            },
            schemas: {
                City: {
                    type: 'object',
                    properties: {
                        id: { type: 'integer', example: 1 },
                        name: { type: 'string', example: 'Mumbai' },
                        createdAt: { type: 'string', format: 'date-time' },
                        updatedAt: { type: 'string', format: 'date-time' }
                    }
                },
                Airport: {
                    type: 'object',
                    properties: {
                        id: { type: 'integer', example: 1 },
                        name: { type: 'string', example: 'Chhatrapati Shivaji International Airport' },
                        code: { type: 'string', example: 'BOM' },
                        address: { type: 'string', example: 'Mumbai, Maharashtra' },
                        cityId: { type: 'integer', example: 1 },
                        createdAt: { type: 'string', format: 'date-time' },
                        updatedAt: { type: 'string', format: 'date-time' }
                    }
                },
                Airplane: {
                    type: 'object',
                    properties: {
                        id: { type: 'integer', example: 1 },
                        modelNumber: { type: 'string', example: 'Boeing 737' },
                        capacity: { type: 'integer', example: 180 },
                        createdAt: { type: 'string', format: 'date-time' },
                        updatedAt: { type: 'string', format: 'date-time' }
                    }
                },
                Flight: {
                    type: 'object',
                    properties: {
                        id: { type: 'integer', example: 1 },
                        flightNumber: { type: 'string', example: 'AI-302' },
                        airplaneId: { type: 'integer', example: 1 },
                        departureAirportId: { type: 'string', example: 'DEL' },
                        arrivalAirportId: { type: 'string', example: 'BOM' },
                        departureTime: { type: 'string', format: 'date-time' },
                        arrivalTime: { type: 'string', format: 'date-time' },
                        price: { type: 'integer', example: 4500 },
                        boardingGate: { type: 'string', example: 'A12' },
                        totalSeats: { type: 'integer', example: 180 },
                        remainingSeats: { type: 'integer', example: 150 },
                        createdAt: { type: 'string', format: 'date-time' },
                        updatedAt: { type: 'string', format: 'date-time' }
                    }
                },
                SuccessResponse: {
                    type: 'object',
                    properties: {
                        success: { type: 'boolean', example: true },
                        message: { type: 'string' },
                        data: { type: 'object' },
                        error: { type: 'object' }
                    }
                },
                ErrorResponse: {
                    type: 'object',
                    properties: {
                        success: { type: 'boolean', example: false },
                        message: { type: 'string' },
                        data: { type: 'object' },
                        error: { type: 'object', properties: { explanation: { type: 'string' } } }
                    }
                }
            }
        }
    },
    apis: ['./src/routes/v1/*.js']
};

const swaggerSpec = swaggerJsdoc(options);

module.exports = swaggerSpec;
