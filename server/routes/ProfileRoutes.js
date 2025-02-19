import { Router } from "express";
import {
  getUserDetails,
  updateProfile,
} from "../controller/Profile.controller.js";
import { auth } from "../middleware/Auth.js";
import { upload } from "../config/multer.js";

const router = Router();

router.get("/getUserDetails", auth, getUserDetails);
router.post(
  "/updateProfile",
  auth,
  upload.fields([
    { name: "coverPic", maxCount: 1 },
    { name: "profilePic", maxCount: 1 },
  ]),
  updateProfile
);

export default router;
