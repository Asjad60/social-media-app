import { Router } from "express";
import { getUserDetails } from "../controller/Profile.controller.js";
import { auth } from "../middleware/Auth.js";

const router = Router();

router.get("/getUserDetails", auth, getUserDetails);

export default router;
