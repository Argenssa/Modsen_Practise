const User = require('../models/User');
const jwt = require('jsonwebtoken');
require('dotenv').config();
async function Authorization(name,password){
    console.log(name,password);
    const CheckUser = await User.User.findOne({where:{username:name,password:password}});
    if(!CheckUser){
        throw new Error("Wrong data");
    }else{
        const token = jwt.sign({userId:CheckUser.Id,role:CheckUser.role},process.env.JWT_SECRET);
        return token;
    }



} exports.Authorization = Authorization;