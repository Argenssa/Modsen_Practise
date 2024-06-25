/**
 * @swagger
 * components:
 *   schemas:
 *     UserMeetUp:
 *       type: object
 *       properties:
 *         userId:
 *           type: integer
 *           description: The ID of the user
 *         meetUpId:
 *           type: integer
 *           description: The ID of the meetup
 *       example:
 *         userId: 10
 *         meetUpId: 1
 */

const sequelize = require("../database/database.js");
const User = require("../models/User");
const MeetUp = require("../models/MeetUp");
const { DataTypes } = require("sequelize");

const UserMeetUp = sequelize.sequelize.define("UserMeetUp", {
    userId: {
        type: DataTypes.INTEGER,
        references: {
            model: User,
            key: 'id'
        }
    },
    meetUpId: {
        type: DataTypes.INTEGER,
        references: {
            model: MeetUp,
            key: 'id'
        }
    }
}, {
    timestamps: false,
    tableName: 'UserMeetUps'
});

User.User.belongsToMany(MeetUp.MeetUp, { through: UserMeetUp, foreignKey: 'userId' });
MeetUp.MeetUp.belongsToMany(User.User, { through: UserMeetUp, foreignKey: 'meetUpId' });

exports.UserMeetUp = UserMeetUp;
