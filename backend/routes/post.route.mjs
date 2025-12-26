import express from "express";
import { 
  createSpace, getSpaces, getSpaceById,
  createTeamUp, getTeamUps, getTeamUpById,
  toggleSavePost, getSavedPosts, getMyAds,
  createSpaceWanted, getSpaceWanted, getSpaceWantedById,
  requestTeamUp, getSpaceTeamUps, removeTeamUp,
  updateAd, updateAdAvailability, deleteAd,
  handleStripeWebhook,
  createReport
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
router.post(
  "/stripe/webhook",
  express.raw({ type: "application/json" }),
  handleStripeWebhook
);
router.get("/spaces", getSpaces);
router.get("/spaces/:id", getSpaceById);
router.post("/space/:id/teamup", auth, requestTeamUp);
router.get("/space/:id/teamups", getSpaceTeamUps);
router.delete("/space/:id/teamup", auth, removeTeamUp);
router.post("/createteamup", auth, upload.array("photos"), validate(createTeamUpSchema), createTeamUp);
router.get("/teamups", getTeamUps);
router.get("/teamup/:id", getTeamUpById);
router.post("/save", auth, toggleSavePost);
router.get("/save/list", auth, getSavedPosts);
router.get("/my-ads", auth, getMyAds);
router.put("/my-ads/:id", auth, upload.array("photos"), updateAd);
router.put("/spaces/:id", auth, uploadFields, updateAd);
router.put("/spacewanted/:id", auth, upload.array("photos"), updateAd);
router.put("/teamup/:id", auth, upload.array("photos"), updateAd);
router.put("/ad-availability/:id", auth, updateAdAvailability);
router.put("/ad-delete/:id", auth, deleteAd);
router.post("/createspacewanted", auth, upload.array("photos"), createSpaceWanted);
router.get("/spacewanted", getSpaceWanted);
router.get("/spacewanted/:id", getSpaceWantedById);
router.post("/create-report", auth, createReport);
router.get("/getplans", getActivePromotionOptions);


export default router;