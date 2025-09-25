import Joi from "joi";
import propertyType from "../constants/property.type.mjs";
import budgetType from "../constants/budget.type.mjs";
import roomAvailableForType from "../constants/roomAvailableFor.type.mjs";
import bedroomsType from "../constants/bedrooms.type.mjs";

export const createSpaceSchema = Joi.object({
    title: Joi.string()
        .trim()
        .min(3)
        .max(100)
        .required()
        .messages({
            "string.empty": "Title is required",
            "string.min": "Title should be at least 3 characters",
            "string.max": "Title cannot exceed 100 characters",
        }),

    propertyType: Joi.string()
        .valid(...propertyType)
        .required()
        .messages({
            "any.only": `Property Type must be one of: ${propertyType.join(", ")}`,
            "string.empty": "Property Type is required",
        }),

    budget: Joi.number()
        .positive()
        .required()
        .messages({
            "number.base": "Budget must be a number",
            "number.positive": "Budget must be greater than 0",
            "any.required": "Budget is required",
        }),

    budgetType: Joi.string()
        .valid(...budgetType)
        .required()
        .messages({
            "any.only": `Budget Type must be one of: ${budgetType.join(", ")}`,
            "string.empty": "Budget Type is required",
        }),

    personalInfo: Joi.string()
        .valid("Landlord", "Agent")
        .required()
        .messages({
            "any.only": "Personal Info must be either 'Landlord' or 'Agent'",
            "string.empty": "Personal Info is required",
        }),

    size: Joi.number()
        .positive()
        .required()
        .messages({
            "number.base": "Size must be a number",
            "number.positive": "Size must be greater than 0",
            "any.required": "Size is required",
        }),

    furnishing: Joi.boolean()
        .required()
        .messages({
            "boolean.base": "Furnishing must be true or false",
            "any.required": "Furnishing is required",
        }),

    smoking: Joi.boolean()
        .required()
        .messages({
            "boolean.base": "Smoking must be true or false",
            "any.required": "Smoking is required",
        }),

    roomsAvailableFor: Joi.string()
        .valid(...roomAvailableForType)
        .required()
        .messages({
            "any.only": `Rooms Available For must be one of: ${roomAvailableForType.join(", ")}`,
            "string.empty": "Rooms Available For is required",
        }),

    bedrooms: Joi.number()
        .valid(...bedroomsType)
        .required()
        .messages({
            "any.only": `Bedrooms must be one of: ${bedroomsType.join(", ")}`,
            "any.required": "Number of bedrooms is required",
        }),

    country: Joi.string()
        .required()
        .messages({ "string.empty": "Country is required" }),

    state: Joi.string()
        .required()
        .messages({ "string.empty": "State is required" }),

    city: Joi.string()
        .required()
        .messages({ "string.empty": "City is required" }),

    location: Joi.string()
        .allow("")
        .messages({}),

    description: Joi.string()
        .min(5)
        .required()
        .messages({
            "string.empty": "Description is required",
            "string.min": "Description must be at least 5 characters",
        }),

    amenities: Joi.array()
        .items(Joi.string())
        .min(1)
        .required()
        .messages({
            "array.min": "At least one amenity is required",
            "any.required": "Amenities are required",
        }),

});
