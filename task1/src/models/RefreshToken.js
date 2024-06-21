const { DataTypes } = require('sequelize');
const sequelize = require('../database/database');

const RefreshToken = sequelize.define('RefreshToken', {
    token: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    userId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
            model: 'User',
            key: 'id'
        }
    },
    expires: {
        type: DataTypes.DATE,
        allowNull: false,
    }
});

module.exports = RefreshToken;