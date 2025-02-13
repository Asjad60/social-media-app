import { Router } from "express";
import {
  logoutUser,
  userLogin,
  userRegister,
} from "../controller/Auth.controller.js";
import { upload } from "../config/multer.js";
import { auth } from "../middleware/Auth.js";
const router = Router();

router.post("/register", upload.single("profilePic"), userRegister);
router.post("/login", userLogin);
router.get("/logout", auth, logoutUser);

export default router;
