import Joi from "joi";

export const loginSchema = Joi.object({
    username: Joi.string().required(),
    password: Joi.string().required()
});

export const registerSchema = Joi.object({
    username: Joi.string().alphanum().min(3).max(30).required(),
    password: Joi.string().pattern(new RegExp('^[a-zA-Z0-9]{3,30}$')).required(),
});