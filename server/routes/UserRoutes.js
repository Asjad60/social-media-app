import { Router } from "express";
import { followUser, getUserDetails } from "../controller/User.controller.js";
import { auth } from "../middleware/Auth.js";

const router = Router();

router.get("/getUserDetails", auth, getUserDetails);
router.post("/follow-user", auth, followUser);

export default router;
