/**
 * @swagger
 * components:
 *   schemas:
 *     User:
 *       type: object
 *       properties:
 *         id:
 *           type: integer
 *           description: The auto-generated ID of the user
 *         username:
 *           type: string
 *           description: The username of the user
 *         password:
 *           type: string
 *           description: The password of the user
 *         role:
 *           type: string
 *           description: The role of the user
 *       example:
 *         id: 10
 *         username: 'johndoe'
 *         password: 'password123'
 *         role: 'user'
 */
const sequelize = require("../database/database");
const { DataType, DataTypes } = require("sequelize");

const User = sequelize.sequelize.define("User", {
    username: DataTypes.TEXT,
    password: DataTypes.TEXT,
    role: DataTypes.STRING,
}, {
    timestamps: false,
});

exports.User = User;