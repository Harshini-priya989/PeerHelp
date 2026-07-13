import express from "express";
import { acceptrequest, rejectrequest, cancelrequest, createRequest, InReq, OutReq } from "../controllers/requestController.js";
import { verifyToken } from "../middleware/authMiddleware.js";
const router = express.Router();

router.post("/createrequest",verifyToken,createRequest);
router.get("/inrequests",verifyToken,InReq);
router.get("/outrequests",verifyToken,OutReq);
router.put("/acceptedrequests",verifyToken,acceptrequest);
router.put("/rejectrequest",verifyToken,rejectrequest);
router.delete("/cancelrequest",verifyToken,cancelrequest);

export default router;