import { Router } from "express";
import { createLike, unlikePost } from "../controller/Like.js";
import { auth } from "../middleware/Auth.js";
const router = Router();

router.post("/like", auth, createLike);
router.post("/unlike", auth, unlikePost);

export default router;
