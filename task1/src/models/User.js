const sequelize = require("../database/database");
const {DataType, DataTypes} = require("sequelize");

const User = sequelize.sequelize.define("User", {
    Id: DataTypes.UUID,
    name: DataTypes.TEXT,
    password: DataTypes.TEXT,
},
{
    timestamps:false,
})

exports.User = User;