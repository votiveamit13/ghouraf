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
    createPolicy, getAllPolicies, getPolicyById, updatePolicy, deletePolicy,
    getAllReports, deleteReport, handlePostAction,
    toggleSpaceAdminPromotion, toggleSpaceWantedAdminPromotion, toggleTeamUpAdminPromotion,
    createAd, updateAd, getAllAds, deleteAd, updateAdStatus,
    getAboutUsImage, updateAboutUsImage,
    getDashboardStats, getDashboardCharts,
    getAllNewsletters, deleteNewsletter,
    getAdminProfile,
    updateAdminProfile
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
router.get("/aboutus-image", adminAuth, getAboutUsImage);
router.get("/aboutussection-image", getAboutUsImage);
router.post("/aboutus-image", adminAuth, upload.fields([
    { name: "image1", maxCount: 1 },
    { name: "image2", maxCount: 1 },
    { name: "image3", maxCount: 1 },
]), updateAboutUsImage);
router.post("/policies", adminAuth, createPolicy);
router.get("/policies", adminAuth, getAllPolicies);
router.get("/policies/:id", adminAuth, getPolicyById);
router.put("/policies/:id", adminAuth, updatePolicy);
router.delete("/policies/:id", adminAuth, deletePolicy);
router.get("/reports", adminAuth, getAllReports);
router.delete("/report/:id", adminAuth, deleteReport);
router.patch("/space/:id/promotion", adminAuth, toggleSpaceAdminPromotion);
router.patch("/spacewanted/:id/promotion", adminAuth, toggleSpaceWantedAdminPromotion);
router.patch("/teamup/:id/promotion", adminAuth, toggleTeamUpAdminPromotion);
router.patch("/post-action/:postType/:id", handlePostAction);
router.post("/create-ad", adminAuth, upload.single("image"), createAd);
router.put("/edit-ad/:id", adminAuth, upload.single("image"), updateAd);
router.get("/getAllAds", adminAuth, getAllAds);
router.delete("/deleteAd/:id", adminAuth, deleteAd);
router.put("/updateAdStatus/:id", adminAuth, updateAdStatus);
router.get("/stats", adminAuth, getDashboardStats);
router.get("/charts", adminAuth, getDashboardCharts);
router.get("/newsletter", adminAuth, getAllNewsletters);
router.delete("/newsletter/:id", adminAuth, deleteNewsletter);
router.get("/profile", adminAuth, getAdminProfile);
router.put("/edit-profile", adminAuth, upload.single("image"), updateAdminProfile);

export default router;
