'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Flight extends Model {
    static associate(models) {
      // A flight uses one airplane
      this.belongsTo(models.Airplane, {
        foreignKey: 'airplaneId',
        onDelete: 'CASCADE'
      });
      // A flight departs from one airport (FK references Airports.code, not Airports.id)
      this.belongsTo(models.Airport, {
        foreignKey: 'departureAirportId',
        targetKey: 'code',
        as: 'departureAirport',
        onDelete: 'CASCADE'
      });
      // A flight arrives at one airport (FK references Airports.code, not Airports.id)
      this.belongsTo(models.Airport, {
        foreignKey: 'arrivalAirportId',
        targetKey: 'code',
        as: 'arrivalAirport',
        onDelete: 'CASCADE'
      });
    }
  }
  Flight.init({
    flightNumber: {
      type: DataTypes.STRING,
      allowNull: false
    },
    airplaneId: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    departureAirportId: {
      type: DataTypes.STRING,
      allowNull: false
    },
    arrivalAirportId: {
      type: DataTypes.STRING,
      allowNull: false
    },
    departureTime: {
      type: DataTypes.DATE,
      allowNull: false
    },
    arrivalTime: {
      type: DataTypes.DATE,
      allowNull: false
    },
    price: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    boardingGate: {
      type: DataTypes.STRING,
      allowNull: true
    },
    totalSeats: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    remainingSeats: {
      type: DataTypes.INTEGER,
      allowNull: false
    }
  }, {
    sequelize,
    modelName: 'Flight',
  });
  return Flight;
};
