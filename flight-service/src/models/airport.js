'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Airport extends Model {
    static associate(models) {
      // An airport belongs to a city. cityId is the foreign key on this table.
      this.belongsTo(models.City, {
        foreignKey: 'cityId',
        onDelete: 'CASCADE'
      });
      // An airport can be the departure point for many flights (sourceKey = code, not id)
      this.hasMany(models.Flight, {
        foreignKey: 'departureAirportId',
        sourceKey: 'code',
        as: 'departingFlights',
        onDelete: 'CASCADE'
      });
      // An airport can be the arrival point for many flights (sourceKey = code, not id)
      this.hasMany(models.Flight, {
        foreignKey: 'arrivalAirportId',
        sourceKey: 'code',
        as: 'arrivingFlights',
        onDelete: 'CASCADE'
      });
    }
  }
  Airport.init({
    name: {
      type: DataTypes.STRING,
      allowNull: false
    },
    code: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true
    },
    address: {
      type: DataTypes.STRING,
      allowNull: true
    },
    cityId: {
      type: DataTypes.INTEGER,
      allowNull: false
    }
  }, {
    sequelize,
    modelName: 'Airport',
  });
  return Airport;
};
