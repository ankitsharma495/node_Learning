'use strict';

module.exports = {
    async up(queryInterface, Sequelize) {
        await queryInterface.createTable('Bookings', {
            id: {
                allowNull: false,
                autoIncrement: true,
                primaryKey: true,
                type: Sequelize.INTEGER
            },
            flightId: {
                type: Sequelize.INTEGER,
                allowNull: false
            },
            userId: {
                type: Sequelize.INTEGER,
                allowNull: false
            },
            noOfSeats: {
                type: Sequelize.INTEGER,
                allowNull: false,
                defaultValue: 1
            },
            totalCost: {
                type: Sequelize.INTEGER,
                allowNull: false
            },
            status: {
                type: Sequelize.ENUM('booked', 'cancelled', 'pending', 'confirmed'),
                allowNull: false,
                defaultValue: 'pending'
            },
            createdAt: {
                allowNull: false,
                type: Sequelize.DATE
            },
            updatedAt: {
                allowNull: false,
                type: Sequelize.DATE
            }
        });
    },

    async down(queryInterface) {
        await queryInterface.dropTable('Bookings');
    }
};
