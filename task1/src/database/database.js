const Sequelize = require('sequelize');
const {Model} = require("sequelize");

 const sequelize = new Sequelize("modsen_task","postgres","SuperSasha2101",{
    dialect: "postgres",
    host: "localhost"
})

exports.sequelize = sequelize;