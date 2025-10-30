import express from "express";
import {
    login,
    getAllUsers, updateUserStatus, updateUserDetails, deleteUser,
    getAllMessage, deleteMessage,
    addFaq, getAllFaq, updateFaqStatus, updateFaq, deleteFaq,
    getAllSpaces, updateSpaceStatus, deleteSpace,
    getAllTeamUps, updateTeamUpStatus, deleteTeamUp,
    getAllSpaceWanted, updateSpaceWantedStatus, deleteSpaceWanted,
    updateHomeImage, getHomeImage,
    createPolicy, getAllPolicies, getPolicyById, updatePolicy, deletePolicy
} from "../controllers/admin/admin.controller.mjs";
import { adminAuth } from "../middleware/adminAuth.mjs";
import { upload } from "../middleware/upload.mjs";
import { validate } from "../middleware/validate.mjs";
import { faqSchema } from "../validations/faq.validator.mjs";
import { profileValidator } from "../validations/profile.validator.mjs";

const router = express.Router();

router.post("/login", login);
router.get("/users", adminAuth, getAllUsers);
router.patch("/users/:id/status", adminAuth, updateUserStatus);
router.patch("/users/:id", adminAuth, validate(profileValidator), upload.single("photo"), updateUserDetails);
router.delete("/user/:id", adminAuth, deleteUser);
router.get("/messages", adminAuth, getAllMessage);
router.delete("/message/:id", adminAuth, deleteMessage);
router.post("/addfaq", validate(faqSchema), addFaq);
router.get("/faqs", adminAuth, getAllFaq);
router.patch("/faq/:id/status", adminAuth, updateFaqStatus);
router.patch("/faq/:id", adminAuth, validate(faqSchema), updateFaq);
router.delete("/faq/:id", adminAuth, deleteFaq);
router.get("/spaces", adminAuth, getAllSpaces);
router.patch("/spaces/:id/status", adminAuth, updateSpaceStatus);
router.patch("/spaces/:id/delete", adminAuth, deleteSpace);
router.get("/teamups", adminAuth, getAllTeamUps);
router.patch("/teamup/:id/status", adminAuth, updateTeamUpStatus);
router.patch("/teamup/:id/delete", adminAuth, deleteTeamUp);
router.get("/spacewanted", adminAuth, getAllSpaceWanted);
router.patch("/spacewanted/:id/status", adminAuth, updateSpaceWantedStatus);
router.patch("/spacewanted/:id/delete", adminAuth, deleteSpaceWanted);
router.get("/hero-image", adminAuth, getHomeImage);
router.get("/herosection-image", getHomeImage);
router.post("/hero-image", adminAuth, upload.single("image"), updateHomeImage);
router.post("/policies", adminAuth, createPolicy);
router.get("/policies", adminAuth, getAllPolicies);
router.get("/policies/:id", adminAuth, getPolicyById);
router.put("/policies/:id", adminAuth, updatePolicy);
router.delete("/policies/:id", adminAuth, deletePolicy);


export default router;
