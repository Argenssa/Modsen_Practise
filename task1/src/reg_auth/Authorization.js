const User = require('../models/User');
const jwt = require('jsonwebtoken');
require('dotenv').config();

async function Authorization(name, password) {
    console.log(name, password);
    const user = await User.User.findOne({ where: { username: name, password: password } });
    if (!user) {
        throw new Error("Wrong data");
    } else {
        const token = jwt.sign({ userId: user.id, role: user.role }, process.env.JWT_SECRET);
        return token;
    }
}

exports.Authorization = Authorization;
