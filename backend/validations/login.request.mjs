import { body } from "express-validator";

export const loginValidation = [
  body("email")
    .isEmail().withMessage("Email must be valid")
    .notEmpty().withMessage("Email is required"),
  body("password")
    .isLength({ min: 6 }).withMessage("Password must be at least 6 characters")
    .notEmpty().withMessage("Password is required")
];
