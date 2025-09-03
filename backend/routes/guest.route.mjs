import express from "express";
import { sendMessage } from "../controllers/guest.controller.mjs";
import { contactFormCreateSchema } from "../validations/contactform.validator.mjs";
import { validate } from "../middleware/validate.mjs";

const router = express.Router();

router.post("/sendMessage", validate(contactFormCreateSchema), sendMessage);

export default router;