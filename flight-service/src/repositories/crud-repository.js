const { Logger } = require('../config');

class CrudRepository {
    constructor(model){
        this.model = model;
    }

    async create(data){ 
        try {
            const response = await this.model.create(data);
            Logger.info('Successfully created a resource');
            return response;
        } catch (error) {
            Logger.error('Error in create repository layer', { error: error.message });
            throw error;  
        }
    }

    async destroy(data){
        try {
            const response = await this.model.destroy({
                where:{
                    id: data
                }
            });
            Logger.info(`Successfully destroyed resource with id ${data}`);
            return response;
        } catch (error) {
            Logger.error('Error in destroy repository layer', { error: error.message });
            throw error;
        }
    }

    async get(data){
        try {
            const response = await this.model.findByPk(data);
            Logger.info(`Successfully fetched resource with id ${data}`);
            return response;
        } catch (error) {
            Logger.error('Error in get repository layer', { error: error.message });
            throw error;
        }
    }

    async getAll(){
        try {
            const response = await this.model.findAll();
            Logger.info('Successfully fetched all resources');
            return response;
        } catch (error) {
            Logger.error('Error in getAll repository layer', { error: error.message });
            throw error;
        }
    }

    async update(data, id){
        try {
            const response = await this.model.update(data, {
                where: {
                    id: id
                }
            });
            Logger.info(`Successfully updated resource with id ${id}`);
            return response;
        } catch (error) {
            Logger.error('Error in update repository layer', { error: error.message });
            throw error;
        }
    }
}

module.exports = CrudRepository;