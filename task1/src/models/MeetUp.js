const sequelize = require("../database/database.js");
const User = require("../models/User");
const {DataType, DataTypes} = require("sequelize");

const MeetUp = sequelize.sequelize.define("MeetUp", {
    Name:DataTypes.TEXT,
    Description:DataTypes.TEXT,
    Tags:DataTypes.ARRAY(DataTypes.TEXT),
    Time:DataTypes.TIME,
    Place:DataTypes.TEXT,
},
    {
        timestamps:false,
    }
    )

User.User.hasMany(MeetUp, {foreignKey: "userId"})

exports.MeetUp = MeetUp;