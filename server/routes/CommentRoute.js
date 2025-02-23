import { Router } from "express";
const router = Router();
import {
  createComment,
  deleteComment,
  deleteReply,
  getCommentsOfaPost,
  replyToComment,
} from "../controller/Comment.js";
import { auth } from "../middleware/Auth.js";

router.post("/create-comment", auth, createComment);
router.post("/reply-to-comment", auth, replyToComment);
router.delete("/delete", auth, deleteComment);
router.delete("/delete-reply", auth, deleteReply);
router.get("/comments-of-post/:postId", getCommentsOfaPost);

export default router;
