/**
 * @swagger
 * components:
 *   schemas:
 *     MeetUp:
 *       type: object
 *       properties:
 *         id:
 *           type: integer
 *           description: The auto-generated ID of the meetup
 *         Name:
 *           type: string
 *           description: The name of the meetup
 *         Description:
 *           type: string
 *           description: The description of the meetup
 *         Tags:
 *           type: array
 *           items:
 *             type: string
 *           description: The tags associated with the meetup
 *         Time:
 *           type: string
 *           format: time
 *           description: The time of the meetup
 *         Place:
 *           type: string
 *           description: The place of the meetup
 *         RegisteredUsers:
 *           type: array
 *           items:
 *             type: integer
 *           description: The IDs of registered users
 *       example:
 *         id: 1
 *         Name: 'Tech Talk'
 *         Description: 'A talk on the latest in technology'
 *         Tags: ['tech', 'talk']
 *         Time: '18:00'
 *         Place: 'Conference Room 1'
 *         RegisteredUsers: [1, 2, 3]
 */
const sequelize = require("../database/database.js");
const User = require("../models/User");
const { DataTypes } = require("sequelize");

const MeetUp = sequelize.sequelize.define("MeetUp", {
    Name: DataTypes.TEXT,
    Description: DataTypes.TEXT,
    Tags: DataTypes.ARRAY(DataTypes.TEXT),
    Time: DataTypes.TIME,
    Place: DataTypes.TEXT,

}, {
    timestamps: false,
});

User.User.hasMany(MeetUp, { foreignKey: "userId" });

exports.MeetUp = MeetUp;
