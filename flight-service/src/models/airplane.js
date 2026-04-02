'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Airplane extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // One airplane can have many flights
      this.hasMany(models.Flight, {
        foreignKey: 'airplaneId',
        onDelete: 'CASCADE'
      });
    }
  }
  Airplane.init({
    modelNumber: DataTypes.STRING,
    capacity: DataTypes.INTEGER
  }, {
    sequelize,
    modelName: 'Airplane',
  });
  return Airplane;
};