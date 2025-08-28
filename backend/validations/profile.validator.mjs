import Joi from "joi";

export const profileValidator = Joi.object({
    section: Joi.string().valid("profile", "email", "password").required(),
  firstName: Joi.string().min(3).max(50),
  lastName: Joi.string().min(3).max(50),
  age: Joi.number().integer().min(18).max(100),
  mobile: Joi.string().pattern(/^[0-9]{10,15}$/),
  dob: Joi.date(),
  gender: Joi.string().valid("male", "female", "other"),
  occupation: Joi.string().max(100),
  bio: Joi.string().max(500),
  city: Joi.string().max(50),
  state: Joi.string().max(50),
  country: Joi.string().max(50),
  lifestyleTags: Joi.array().items(Joi.string().max(30)),
  photo: Joi.string().uri(),
});