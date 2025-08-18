// validators/postValidator.js
import Joi from "joi";
import postType from "../constants/post.type.mjs";
import roomType from "../constants/room.type.mjs";
import leaseType from "../constants/lease.type.mjs";
import furnishedType from "../constants/furnished.type.mjs";
import durationType from "../constants/duration.type.mjs";
import occupationType from "../constants/occupation.type.mjs";

const locationSchema = Joi.object({
    line1: Joi.string().required().messages({
        "string.empty": "Address line1 is required"
    }),
    area: Joi.string().allow("").optional(),
    city: Joi.string().required().messages({
        "string.empty": "City is required"
    }),
    state: Joi.string().required().messages({
        "string.empty": "State is required"
    }),
    country: Joi.string().allow("").optional(),
    pincode: Joi.string().pattern(/^[0-9]{5,10}$/).required().messages({
        "string.empty": "Pincode is required",
        "string.pattern.base": "Pincode must be 5–10 digits"
    })
});

const baseSchema = {
    title: Joi.string().min(3).max(100).required(),
    description: Joi.string().min(10).max(1000).required(),
    location: locationSchema.required(),
    budget: Joi.number().min(0).required(),
    type: Joi.string().valid(...postType).required(),
};

// Schema for LOOKING post (Room Wanted)
const lookingSchema = Joi.object({
    ...baseSchema,
    roomType: Joi.string().valid(...roomType).required(),
    gender: Joi.string().valid("male", "female", "any").optional(),
    furnishing: Joi.string().valid(...furnishedType).optional(),
});

// Schema for OFFERING post (Offering a Room/Apartment)
const offeringSchema = Joi.object({
    ...baseSchema,
    rent: Joi.number().min(0).required(),
    deposit: Joi.number().min(0).optional(),
    availableFrom: Joi.date().required(),
    leaseType: Joi.string().valid(...leaseType).required(),
    lifestyleTags: Joi.array().items(Joi.string()).optional(),
    photos: Joi.array().items(Joi.string().uri()).optional(),
});

// Schema for TEAM_UP post (Looking for Flatmate/Group Renting)
const teamUpSchema = Joi.object({
    ...baseSchema,
    moveInDate: Joi.date().required(),
    duration: Joi.string().valid(...durationType).required(),
    lifestyleTags: Joi.array().items(Joi.string()).optional(),
    ageRange: Joi.object({
        min: Joi.number().min(16),
        max: Joi.number().greater(Joi.ref("min")),
    }).optional(),
    occupation: Joi.string().valid(...occupationType).optional(),
});

export function validatePost(data) {
    switch (data.type) {
        case "Looking":
            return lookingSchema.validate(data, { abortEarly: false });
        case "Offering":
            return offeringSchema.validate(data, { abortEarly: false });
        case "Team Up":
            return teamUpSchema.validate(data, { abortEarly: false });
        default:
            return { error: { details: [{ message: "Invalid post type" }] } };
    }
}
