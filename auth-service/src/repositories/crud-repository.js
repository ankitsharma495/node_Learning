const { Logger } = require('../config');

class CrudRepository {
    constructor(model) {
        this.model = model;
    }

    async create(data) {
        Logger.info(`Repository: Creating ${this.model.name}`);
        const response = await this.model.create(data);
        return response;
    }

    async get(id) {
        Logger.info(`Repository: Fetching ${this.model.name} with id ${id}`);
        const response = await this.model.findByPk(id);
        return response;
    }

    async getAll() {
        Logger.info(`Repository: Fetching all ${this.model.name}`);
        const response = await this.model.findAll();
        return response;
    }

    async destroy(id) {
        Logger.info(`Repository: Deleting ${this.model.name} with id ${id}`);
        const response = await this.model.destroy({ where: { id } });
        return response;
    }
}

module.exports = CrudRepository;
