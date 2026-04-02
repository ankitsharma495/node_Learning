const CrudRepository = require('./crud-repository');
const { Airport, City } = require('../models');

class AirportRepository extends CrudRepository {
    constructor() {
        super(Airport);
    }

    // Override getAll to include the associated City data
    async getAll() {
        const response = await Airport.findAll({
            include: [{
                model: City,
                attributes: ['id', 'name']
            }]
        });
        return response;
    }

    // Override get to include the associated City data
    async get(id) {
        const response = await Airport.findByPk(id, {
            include: [{
                model: City,
                attributes: ['id', 'name']
            }]
        });
        return response;
    }
}

module.exports = AirportRepository;
