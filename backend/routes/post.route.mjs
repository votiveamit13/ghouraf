import express from "express";
import { createSpace, getSpaces } from "../controllers/post.controller.mjs";
import { auth } from "../middleware/auth.mjs";
import { validate } from "../middleware/validate.mjs";
import { createSpaceSchema } from "../validations/space.validator.mjs";
import { upload } from "../middleware/upload.mjs";

const router = express.Router();

const uploadFields = upload.fields([
  { name: "featuredImage", maxCount: 1 },
  { name: "photos"},
]);

router.post("/createspaces", auth, uploadFields, validate(createSpaceSchema), createSpace);
router.get("/spaces", getSpaces);

export default router;