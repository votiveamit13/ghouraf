import Joi from "joi";
import budgetType from "../constants/budget.type.mjs";
import roomAvailableForType from "../constants/roomAvailableFor.type.mjs";

export const createSpaceWantedSchema = Joi.object({
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

  description: Joi.string()
    .min(5)
    .required()
    .messages({
      "string.empty": "Description is required",
      "string.min": "Description must be at least 5 characters",
    }),

  propertyType: Joi.string()
    .required()
    .messages({
      "string.empty": "Space Wanted Type is required",
    }),

  roomSize: Joi.string()
    .required()
    .messages({
      "string.empty": "Space Size is required",
    }),

  country: Joi.string()
    .required()
    .messages({
      "string.empty": "Country is required",
    }),

  state: Joi.string()
    .required()
    .messages({
      "string.empty": "State is required",
    }),

  city: Joi.string()
    .required()
    .messages({
      "string.empty": "City is required",
    }),

  // zip: Joi.string()
  //   .required()
  //   .messages({
  //     "string.empty": "ZIP code is required",
  //   }),

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

moveInDate: Joi.string().allow('').optional(),

  period: Joi.string()
    .required()
    .messages({
      "string.empty": "Period is required",
    }),

  amenities: Joi.array()
    .items(Joi.string()).optional(),

  name: Joi.string()
    .required()
    .messages({
      "string.empty": "Name is required",
    }),

  age: Joi.number()
    .min(18)
    .max(100)
    .required()
    .messages({
      "number.base": "Age must be a number",
      "number.min": "Age must be at least 18",
      "number.max": "Age cannot exceed 100",
      "any.required": "Age is required",
    }),

  gender: Joi.string()
    .valid("male", "female")
    .required()
    .messages({
      "any.only": "Gender must be either 'male' or 'female'",
      "string.empty": "Gender is required",
    }),

  occupation: Joi.string()
    .valid("Student", "Professional")
    .required()
    .messages({
      "any.only": "Occupation must be 'Student' or 'Professional'",
      "string.empty": "Occupation is required",
    }),

  smoke: Joi.string()
    .valid("Yes", "No", "Sometimes")
    .optional()
    .messages({
      "any.only": "Smoke must be 'Yes', 'No' or 'Sometimes'",
    }),

  pets: Joi.string()
    .valid("Yes", "No")
    .optional()
    .messages({
      "any.only": "Pets must be 'Yes' or 'No'",
    }),

  // language: Joi.string().allow("").optional(),

  // roommatePref: Joi.string()
  //   .valid(...roomAvailableForType)
  //   .required()
  //   .messages({
  //     "any.only": `Roommate Preference must be one of: ${roomAvailableForType.join(", ")}`,
  //     "string.empty": "Roommate Preference is required",
  //   }),

  photos: Joi.array()
    .items(
      Joi.object({
        id: Joi.string().required().messages({
          "string.empty": "Photo ID is required",
        }),
        url: Joi.string().uri().required().messages({
          "string.uri": "Photo URL must be a valid URI",
          "string.empty": "Photo URL is required",
        }),
      })
    )
    .optional()
    .messages({
      "array.base": "Photos must be an array of objects with id and url",
    }),

  teamUp: Joi.boolean().default(false),
  reportsCount: Joi.number().default(0),
  status: Joi.string().valid("active", "inactive").default("inactive"),
  available: Joi.boolean().default(true),
  is_deleted: Joi.boolean().default(false),
  postCategory: Joi.string().default("Spacewanted"),
});
