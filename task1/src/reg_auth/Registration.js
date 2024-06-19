const User = require('./User');
const jwt = require('jsonwebtoken');
function Registration(name,password,role){

    const CheckUser = User.findOne({name:name});
    if(CheckUser){
        throw new Error(`${name} is already registered`);
    }else{
        const newUser = new User({name:name,password:password,role:role});
    }
    const token = jwt.sign({userId:newUser.Id,role:newUser.role},process.env.JWT_SECRET);
    res.cookie('token', token);


}