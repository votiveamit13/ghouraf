import Joi from "joi";

export const contactFormCreateSchema = Joi.object({
    fullName: Joi.string().trim().min(2).max(100).required()
        .messages({
            "string.empty": "Full name is required",
            "string.min": "Full name must be at least 2 characters"
        }),
    email: Joi.string().email().required()
        .messages({
            "string.empty": "Email is required",
            "string.email": "Please provide a valid email address"
        }),
    subject: Joi.string().trim().max(150).required()
        .messages({
            "string.empty": "Subject is required"
        }),
    message: Joi.string().trim().min(5).max(2000).required()
        .messages({
            "string.empty": "Message is required",
            "string.min": "Message must be at least 5 characters"
        })
});