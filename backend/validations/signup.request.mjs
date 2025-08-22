import Joi from "joi";
export const signupValidator = Joi.object({
    email: Joi.string().email().required(),
    password: Joi.string().min(5).required(),
    firstName: Joi.string().min(2).max(50).required(),
    lastName: Joi.string().min(2).max(50).required(),
    gender: Joi.string().valid("male", "female").required(),
    dob: Joi.date().iso().required(),
    termsAccepted: Joi.boolean().required(),
});