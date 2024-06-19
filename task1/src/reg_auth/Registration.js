const User = require('../models/User');
const jwt = require('jsonwebtoken');
require('dotenv').config();
async function Registration(name,password,role){
console.log(name,password);
    const CheckUser = await User.User.findOne({where:{username:name}});
    if(CheckUser){
        throw new Error(`${name} is already registered`);
    }else{
        const newUser = await User.User.create({username:name,password:password,role:role});
        const token = jwt.sign({userId:newUser.Id,role:newUser.role},process.env.JWT_SECRET);
        return token;
    }



} exports.Registration = Registration;