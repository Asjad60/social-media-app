import { Router } from "express";
import { createPost, getAllPosts } from "../controller/Post.js";
import { upload } from "../config/multer.js";
import { auth } from "../middleware/Auth.js";
const router = Router();

router.post("/createPost", auth, upload.array("media"), createPost);
router.get("/getAllPosts", getAllPosts);

export default router;
