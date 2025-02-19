import { Router } from "express";
import {
  createStory,
  getFollowingStories,
  getUserStories,
  viewStory,
  deleteStory,
  addToHighlights,
  getHighlights,
  addReaction,
  getViewerStats,
} from "../controller/Story.controller.js";
import { upload } from "../config/multer.js";
import { auth } from "../middleware/Auth.js";

const router = Router();

// Core story routes
router.post("/createStories", auth, upload.single("storyMedia"), createStory);
router.get("/stories/feed", auth, getFollowingStories);
router.get("/stories/user/:userId", auth, getUserStories);
router.post("/stories/:storyId/view", auth, viewStory);
router.delete("/stories/:storyId", auth, deleteStory);

// Highlight routes
router.post("/stories/:storyId/highlight", auth, addToHighlights);
router.get("/highlights/:userId", auth, getHighlights);

// Engagement routes
router.post("/stories/:storyId/reaction", auth, addReaction);
router.get("/stories/:storyId/stats", auth, getViewerStats);

export default router;
