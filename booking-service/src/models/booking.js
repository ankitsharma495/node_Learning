'use strict';

module.exports = (sequelize, DataTypes) => {
    const Booking = sequelize.define('Booking', {
        flightId: {
            type: DataTypes.INTEGER,
            allowNull: false
        },
        userId: {
            type: DataTypes.INTEGER,
            allowNull: false
        },
        noOfSeats: {
            type: DataTypes.INTEGER,
            allowNull: false,
            defaultValue: 1,
            validate: {
                min: 1
            }
        },
        totalCost: {
            type: DataTypes.INTEGER,
            allowNull: false
        },
        status: {
            type: DataTypes.ENUM('booked', 'cancelled', 'pending', 'confirmed'),
            allowNull: false,
            defaultValue: 'pending'
        }
    });

    Booking.associate = function (models) {
        // flightId and userId reference other services' DBs
        // We don't create foreign keys across databases
    };

    return Booking;
};
