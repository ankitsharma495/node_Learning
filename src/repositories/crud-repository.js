const {Logger} = require('../config');
const { where } = require("sequelize");

class CrudRepository {
    constructor(model){
        this.model = model
    }

    async create(data){ 
        try {
            const response = await this.model.create(data);
            return response;
            
        } catch (error) {  
            throw error;  
        }
    }

    async destroy(data){
        try {

            const response = this.model.destroy({
                where:{
                    id:data
                }
            });
            return response;
            
        } catch (error) {
            throw error;
            
        }
    }
    async get(data){
        try {

            const response = this.model.findByPk() ;
            return response;
            
        } catch (error) {
            throw error;
            
        }
    }

    async getALL(data){
        try {

            const response = this.model.findAll() ;
            return response;
            
        } catch (error) {
            throw error;
            
        }
    }
    async update(data , id){
        try {

            const response = this.model.update(data, {
                where : {
                    id:id
                }
            }) ;
            return response;
            
        } catch (error) {
            throw error;
            
        }
    }

    

}

module.exports = CrudRepository;