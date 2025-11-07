import express from "express";
import { sendMessage, getAllFaq, getPolicyByCategory, getPublicAds } from "../controllers/guest.controller.mjs";
import { contactFormCreateSchema } from "../validations/contactform.validator.mjs";
import { validate } from "../middleware/validate.mjs";

const router = express.Router();

router.post("/sendMessage", validate(contactFormCreateSchema), sendMessage);
router.get("/faqs", getAllFaq);
router.get("/policies/:category", getPolicyByCategory);
router.get("/ads", getPublicAds);

export default router;