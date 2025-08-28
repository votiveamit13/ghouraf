import Joi from "joi";

export const profileValidator = Joi.object({
  firstName: Joi.string().min(3).max(50),
  lastName: Joi.string().min(3).max(50),
  age: Joi.number().integer().min(18).max(100),
  mobile: Joi.number().integer().min(10).max(15),
  gender: Joi.string().valid("male", "female", "other"),
  occupation: Joi.string().max(100),
  bio: Joi.string().max(500),
  city: Joi.string().max(50),
  state: Joi.string().max(50),
  country: Joi.string().max(50),
  lifestyleTags: Joi.array().items(Joi.string().max(30)),
  photos: Joi.array().items(Joi.string().uri()),
});