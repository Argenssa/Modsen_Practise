const sequelize = require("../database/database");
const {DataType, DataTypes} = require("sequelize");

const User = sequelize.sequelize.define("User", {
    username: DataTypes.TEXT,
    password: DataTypes.TEXT,
    role: DataTypes.STRING,
},
{
    timestamps:false,
})

exports.User = User;