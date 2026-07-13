import express from "express";
import { changePassword, profile, updateProfile } from "../controllers/profileController.js";
import { verifyToken } from "../middleware/authMiddleware.js";

const router  = express.Router();

router.get("/profile",verifyToken,profile);
router.put("/updateprofile",verifyToken,updateProfile);
router.post("/changepassword",verifyToken,changePassword);
export default router;