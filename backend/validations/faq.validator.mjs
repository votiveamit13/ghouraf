import Joi from "joi";

export const faqSchema = Joi.object({
    question: Joi.string().min(5).required()
        .messages({
            "string.empty": "Question is required",
            "string.min": "Question must be at least 5 characters"
        }),
    answer: Joi.string().min(5).required()
        .messages({
            "string.empty": "Answer is required",
            "string.min": "Answer must be at least 5 characters"
        })
});