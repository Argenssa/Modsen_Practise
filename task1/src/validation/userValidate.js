const Joi = require('joi');

const userSchema = Joi.object({
    username: Joi.string().min(3).required(),
    password: Joi.string().min(6).required(),
    role: Joi.string().valid("organizer","user").required(),
})

exports.userSchema = userSchema;