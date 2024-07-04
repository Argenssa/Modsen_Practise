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
import { DataTypes, Model } from 'sequelize';
import {sequelize} from '../database/database';
import { User } from '../models/User';

class RefreshToken extends Model {
    public token!: string;
    public expires!: Date;
    public userId!: number;
}

RefreshToken.init({
    token: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    expires: {
        type: DataTypes.DATE,
        allowNull: false,
    },
}, {
    sequelize,
    modelName: 'RefreshToken',
    timestamps: false,
});

User.hasOne(RefreshToken, { foreignKey: 'userId' });
RefreshToken.belongsTo(User, { foreignKey: 'userId' });

export { RefreshToken };
