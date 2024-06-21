const { DataTypes } = require('sequelize');
const {User} = require("../models/User")
const sequelize = require('../database/database');

const RefreshToken = sequelize.sequelize.define("RefreshToken", {
    token: DataTypes.STRING,
    expires: DataTypes.DATE,
},
    {
    timestamps:false,


});
User.hasOne(RefreshToken, {foreignKey: "userId"})
RefreshToken.belongsTo(User, { foreignKey: "userId" });
exports.RefreshToken = RefreshToken;