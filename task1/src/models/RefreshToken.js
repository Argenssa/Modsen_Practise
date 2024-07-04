/**
 * @swagger
 * components:
 *   schemas:
 *     RefreshToken:
 *       type: object
 *       properties:
 *         token:
 *           type: string
 *           description: The refresh token
 *         expires:
 *           type: string
 *           format: date-time
 *           description: Expiration date of the refresh token
 *         userId:
 *           type: integer
 *           description: The ID of the user associated with the token
 *       example:
 *         token: 'some_random_token'
 *         expires: '2023-12-31T23:59:59.999Z'
 *         userId: 1
 */
const { DataTypes } = require('sequelize');
const { User } = require("../models/User");
const sequelize = require('../database/database');

const RefreshToken = sequelize.sequelize.define("RefreshToken", {
    token: DataTypes.STRING,
    expires: DataTypes.DATE,
}, {
    timestamps: false,
});

User.hasOne(RefreshToken, { foreignKey: "userId" });
RefreshToken.belongsTo(User, { foreignKey: "userId" });

exports.RefreshToken = RefreshToken;