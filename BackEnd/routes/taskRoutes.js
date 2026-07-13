import express from "express";
import {addTask,allTasks,myTasks,deleteTask} from "../controllers/taskController.js"
import { verifyToken } from "../middleware/authMiddleware.js";
import multer from "multer";

const upload = multer({ dest: "uploads/" });


const router= express.Router();

router.post("/addtask", verifyToken, upload.single("picture"), addTask);
router.get("/feed",verifyToken,allTasks);
router.get("/mytasks",verifyToken,myTasks);
router.delete("/deletetask/:tid",verifyToken,deleteTask);
export default router;