import { Router } from "express";
const router = Router();
import { createComment } from "../controller/Comment.js";
import { auth } from "../middleware/Auth.js";

router.post("/createComment", auth, createComment);

export default router;
