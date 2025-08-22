import Joi from "joi";

export const profileValidator = Joi.object({
    firstName: Joi.string().min(3).max(50).required().messages({
        "string.min": "Full name must be at least 3 characters",
        "string.max": "Full name cannot exceed 50 characters",
    }),
        lastName: Joi.string().min(3).max(50).required().messages({
        "string.min": "Full name must be at least 3 characters",
        "string.max": "Full name cannot exceed 50 characters",
    }),
    age: Joi.number().integer().min(18).max(100).required().messages({
        "number.base": "Age must be a number",
        "number.min": "Age must be at least 18",
        "number.max": "Age cannot exceed 100",
    }),
    gender: Joi.string().valid("male", "female", "other").messages({
        "any.only": "Gender must be male, female, or other",
    }),
    occupation: Joi.string().max(100).required(),
    bio: Joi.string().max(500).messages({
        "string.max": "Bio cannot exceed 500 characters",
    }),
    city: Joi.string().max(50).required().messages({
        "string.max": "City name cannot exceed 50 characters",
    }),
    state: Joi.string().max(50).required().messages({
        "string.max": "State name cannot exceed 50 characters",
    }),
    country: Joi.string().max(50).messages({
        "string.max": "Country name cannot exceed 50 characters",
    }),
    lifestyleTags: Joi.array()
        .items(Joi.string().max(30))
        .required()
        .messages({
            "array.base": "Lifestyle tags must be an array of strings",
            "string.max": "Each lifestyle tag cannot exceed 30 characters",
        }),
    photos: Joi.array()
        .items(Joi.string().uri())
        .messages({
            "array.base": "Photos must be an array of URLs",
            "string.uri": "Each photo must be a valid URL",
        }),
});