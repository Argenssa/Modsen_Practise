const User = require('../models/User');
const jwt = require('jsonwebtoken');
require('dotenv').config();
const { RefreshToken } = require('../models/RefreshToken');
async function Registration(name,password,role){
console.log(name,password);
    const CheckUser = await User.User.findOne({where:{username:name}});
    if(CheckUser){
        throw new Error(`${name} is already registered`);
    }else{
        const user = await User.User.create({username:name,password:password,role:role});
        const token = jwt.sign({userId:user.id,role:user.role},process.env.JWT_SECRET);
        const refreshToken = jwt.sign({ userId: user.id }, process.env.JWT_REFRESH_SECRET, { expiresIn: '7d' });
        await RefreshToken.create({ token: refreshToken, userId: user.id, expires: new Date(Date.now() + 7*24*60*60*1000) });
        return token;
    }



} exports.Registration = Registration;