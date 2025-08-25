import Joi from "joi";
export const loginValidator = Joi.object({
  idToken: Joi.string().required(),
});
