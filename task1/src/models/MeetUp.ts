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
import { Sequelize, DataTypes, Model } from 'sequelize';
import {sequelize} from '../database/database';
import { User } from '../models/User';

class MeetUp extends Model {
    public id!: number;
    public Name!: string;
    public Description!: string;
    public Tags!: string[];
    public Time!: string;
    public Place!: string;
    public RegisteredUsers!: number[];
}

MeetUp.init({
    id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
    },
    Name: {
        type: DataTypes.TEXT,
        allowNull: false,
    },
    Description: {
        type: DataTypes.TEXT,
        allowNull: false,
    },
    Tags: {
        type: DataTypes.ARRAY(DataTypes.TEXT),
        allowNull: false,
    },
    Time: {
        type: DataTypes.TIME,
        allowNull: false,
    },
    Place: {
        type: DataTypes.TEXT,
        allowNull: false,
    },
}, {
    sequelize,
    modelName: 'MeetUp',
    timestamps: false,
});

User.hasMany(MeetUp, { foreignKey: 'userId' });
MeetUp.belongsTo(User, { foreignKey: 'userId' });

export { MeetUp };
