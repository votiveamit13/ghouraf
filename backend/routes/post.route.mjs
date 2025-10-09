import express from "express";
import { 
  createSpace, getSpaces, getSpaceById,
  createTeamUp, getTeamUps, getTeamUpById,
  toggleSavePost, getSavedPosts, getMyAds
} from "../controllers/post.controller.mjs";
import { auth } from "../middleware/auth.mjs";
import { validate } from "../middleware/validate.mjs";
import { createSpaceSchema } from "../validations/space.validator.mjs";
import { upload } from "../middleware/upload.mjs";
import { createTeamUpSchema } from "../validations/teamup.validator.mjs";

const router = express.Router();

const uploadFields = upload.fields([
  { name: "featuredImage", maxCount: 1 },
  { name: "photos"},
]);

router.post("/createspaces", auth, uploadFields, validate(createSpaceSchema), createSpace);
router.get("/spaces", getSpaces);
router.get("/spaces/:id", getSpaceById);
router.post("/createteamup", auth, upload.array("photos"), validate(createTeamUpSchema), createTeamUp);
router.get("/teamups", getTeamUps);
router.get("/teamup/:id", getTeamUpById);
router.post("/save", auth, toggleSavePost);
router.get("/save/list", auth, getSavedPosts);
router.get("/my-ads", auth, getMyAds);

export default router;