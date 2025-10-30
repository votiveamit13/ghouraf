import express from "express";
import { sendMessage, getAllFaq } from "../controllers/guest.controller.mjs";
import { contactFormCreateSchema } from "../validations/contactform.validator.mjs";
import { validate } from "../middleware/validate.mjs";
import { getPolicyByCategory } from "../controllers/admin/admin.controller.mjs";

const router = express.Router();

router.post("/sendMessage", validate(contactFormCreateSchema), sendMessage);
router.get("/faqs", getAllFaq);
router.get("/policies/:category", getPolicyByCategory);

export default router;