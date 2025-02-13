import { Router } from "express";
import { createPost, getAllPosts, getUserPosts } from "../controller/Post.js";
import { upload } from "../config/multer.js";
import { auth } from "../middleware/Auth.js";
const router = Router();

router.post("/createPost", upload.array("media"), auth, createPost);
router.post("/getuserPosts", auth, getUserPosts);
router.get("/getAllPosts", getAllPosts);

export default router;
