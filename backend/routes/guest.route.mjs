import express from "express";
import { sendMessage, getAllFaq, searchLocations } from "../controllers/guest.controller.mjs";
import { contactFormCreateSchema } from "../validations/contactform.validator.mjs";
import { validate } from "../middleware/validate.mjs";

const router = express.Router();

router.post("/sendMessage", validate(contactFormCreateSchema), sendMessage);
router.get("/faqs", getAllFaq);
router.get("/locations", searchLocations);

export default router;