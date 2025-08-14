import { body } from "express-validator";

export const loginValidation = [
  body("email")
    .isEmail().withMessage("Email must be valid")
    .notEmpty().withMessage("Email is required"),
  body("password")
    .notEmpty().withMessage("Password is required")
];
