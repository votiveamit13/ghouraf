import Joi from "joi";
import budgetType from "../constants/budget.type.mjs";
import roomAvailableForType from "../constants/roomAvailableFor.type.mjs";

export const createTeamUpSchema = Joi.object({
  title: Joi.string().trim().required(),

  country: Joi.string().required(),
  state: Joi.string().required(),
  city: Joi.string().required(),
  // zip: Joi.string().required(),

  budget: Joi.string().required(),
  budgetType: Joi.string().valid(...budgetType).required(),

  // moveInDate: Joi.date().optional(),
  period: Joi.string().optional(),

  amenities: Joi.array().items(Joi.string()).required(),

  firstName: Joi.string().required(),
  lastName: Joi.string().required(),
  age: Joi.number().integer().min(0).optional(),

  gender: Joi.string().valid(...roomAvailableForType).required(),

  minAge: Joi.number().integer().min(0).optional(),
  maxAge: Joi.number().integer().min(0).optional(),

  occupationPreference: Joi.string().optional(),
  occupation: Joi.string().optional(),

  smoke: Joi.boolean().optional(),
  pets: Joi.boolean().required(),
  petsPreference: Joi.boolean().optional(),

  // language: Joi.string().optional(),
  // languagePreference: Joi.string().optional(),

  // roommatePref: Joi.string().valid(...roomAvailableForType).required(),

  description: Joi.string().allow("").required(),
  buddyDescription: Joi.string().allow("").optional(),

  photos: Joi.array().items(
    Joi.object({
      id: Joi.string().required(),
      url: Joi.string().uri().required(),
    })
  ).optional(),

  status: Joi.string().valid("active", "inactive").default("active"),
  available: Joi.boolean().default(true),
  is_deleted: Joi.boolean().default(false),
});

export const updateTeamUpSchema = createTeamUpSchema.fork(
  Object.keys(createTeamUpSchema.describe().keys),
  (field) => field.optional()
);