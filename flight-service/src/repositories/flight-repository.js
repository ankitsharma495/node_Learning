const { Op } = require('sequelize');
const CrudRepository = require('./crud-repository');
const { Flight, Airplane, Airport } = require('../models');

class FlightRepository extends CrudRepository {
    constructor() {
        super(Flight);
    }

    /**
     * Override getAll to support filtering, sorting, and eager loading.
     *
     * Supported filters (all optional, passed via query params):
     *   - departureAirportId  : airport code string (e.g. "DEL")
     *   - arrivalAirportId    : airport code string (e.g. "BOM")
     *   - price (minPrice / maxPrice)  : integer range
     *   - departureTime       : ISO date string — returns flights departing on that calendar day
     *   - sort                : field to sort by (default: departureTime)
     *   - order               : ASC or DESC (default: ASC)
     *
     * Example query: GET /api/v1/flights?departureAirportId=DEL&arrivalAirportId=BOM&minPrice=1000&maxPrice=5000&sort=price&order=ASC
     */
    async getAll(filter) {
        const where = {};

        // --- Route filtering ---
        if (filter.departureAirportId) {
            where.departureAirportId = filter.departureAirportId;
        }
        if (filter.arrivalAirportId) {
            where.arrivalAirportId = filter.arrivalAirportId;
        }

        // --- Price range filtering ---
        if (filter.minPrice || filter.maxPrice) {
            where.price = {};
            if (filter.minPrice) {
                where.price[Op.gte] = filter.minPrice;
            }
            if (filter.maxPrice) {
                where.price[Op.lte] = filter.maxPrice;
            }
        }

        // --- Departure date filtering (entire calendar day) ---
        if (filter.departureTime) {
            const startOfDay = new Date(filter.departureTime);
            startOfDay.setHours(0, 0, 0, 0);
            const endOfDay = new Date(filter.departureTime);
            endOfDay.setHours(23, 59, 59, 999);
            where.departureTime = {
                [Op.between]: [startOfDay, endOfDay]
            };
        }

        // --- Sorting (whitelist to prevent injection) ---
        const allowedSortFields = ['departureTime', 'arrivalTime', 'price', 'flightNumber', 'totalSeats', 'remainingSeats', 'createdAt'];
        const sortField = allowedSortFields.includes(filter.sort) ? filter.sort : 'departureTime';
        const allowedOrders = ['ASC', 'DESC'];
        const sortOrder = allowedOrders.includes((filter.order || '').toUpperCase()) ? filter.order.toUpperCase() : 'ASC';

        const response = await Flight.findAll({
            where,
            order: [[sortField, sortOrder]],
            include: [
                {
                    model: Airplane,
                    attributes: ['id', 'modelNumber', 'capacity']
                },
                {
                    model: Airport,
                    as: 'departureAirport',
                    attributes: ['code', 'name', 'cityId']
                },
                {
                    model: Airport,
                    as: 'arrivalAirport',
                    attributes: ['code', 'name', 'cityId']
                }
            ]
        });
        return response;
    }

    /**
     * Override get to include associated Airplane and Airport data.
     */
    async get(id) {
        const response = await Flight.findByPk(id, {
            include: [
                {
                    model: Airplane,
                    attributes: ['id', 'modelNumber', 'capacity']
                },
                {
                    model: Airport,
                    as: 'departureAirport',
                    attributes: ['code', 'name', 'cityId']
                },
                {
                    model: Airport,
                    as: 'arrivalAirport',
                    attributes: ['code', 'name', 'cityId']
                }
            ]
        });
        return response;
    }
}

module.exports = FlightRepository;
