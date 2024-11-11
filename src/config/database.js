const { Sequelize } = require('sequelize');

const sequelize = new Sequelize('pim', 'root', '123456', {
    host: 'localhost',
    dialect: 'mysql',
    logging: console.log, // Exibe as queries SQL no console
    pool: {
        max: 5,
        min: 0,
        acquire: 30000,
        idle: 10000
    }
});

module.exports = sequelize;
