import express from "express";
import { sendMessage, getAllFaq } from "../controllers/guest.controller.mjs";
import { contactFormCreateSchema } from "../validations/contactform.validator.mjs";
import { validate } from "../middleware/validate.mjs";

const router = express.Router();

router.post("/sendMessage", validate(contactFormCreateSchema), sendMessage);
router.get("/faqs", getAllFaq);

export default router;