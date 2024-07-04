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
import { DataTypes, Model } from 'sequelize';
import {sequelize} from '../database/database';
import { User } from './User';
import { MeetUp } from './MeetUp';

class UserMeetUp extends Model {
    public userId!: number;
    public meetUpId!: number;
}

UserMeetUp.init({
    userId: {
        type: DataTypes.INTEGER,
        references: {
            model: User,
            key: 'id',
        },
        allowNull: false,
    },
    meetUpId: {
        type: DataTypes.INTEGER,
        references: {
            model: MeetUp,
            key: 'id',
        },
        allowNull: false,
    },
}, {
    sequelize,
    modelName: 'UserMeetUp',
    timestamps: false,
    tableName: 'UserMeetUps',
});

User.belongsToMany(MeetUp, { through: UserMeetUp, foreignKey: 'userId' });
MeetUp.belongsToMany(User, { through: UserMeetUp, foreignKey: 'meetUpId' });

export { UserMeetUp };
