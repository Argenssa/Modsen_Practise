const User = require('../models/User.js');
const jwt = require('jsonwebtoken');
require('dotenv').config();
const { RefreshToken } = require('../models/RefreshToken.js');
async function Authorization(name, password) {
    console.log(name, password);
    const user = await User.User.findOne({ where: { username: name, password: password } });
    if (!user) {
        throw new Error("Wrong data");
    } else {
        const token = jwt.sign({ userId: user.id, role: user.role }, process.env.JWT_SECRET);
        const refreshToken = jwt.sign({ userId: user.id }, process.env.JWT_REFRESH_SECRET, { expiresIn: '7d' });
        await RefreshToken.create({ token: refreshToken, userId: user.id, expires: new Date(Date.now() + 7*24*60*60*1000) });
        return {token, refreshToken}; ;
    }
}

exports.Authorization = Authorization;
