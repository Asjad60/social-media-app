import Story from "../models/StoryModel.js";
import User from "../models/UserModel.js";
import { uploadFileToCloud } from "../utils/UploadFileToCloud.js";
import fs from "fs/promises";

// Create a new story
export const createStory = async (req, res) => {
  try {
    const userId = req.user.id;
    const { content, tags, status, duration = 15 } = req.body;
    const storyMedia = req.file;

    if (!content && !storyMedia) {
      if (storyMedia) await fs.unlink(storyMedia.path);
      return res.status(400).json({
        success: false,
        message: "Story must contain text or media",
      });
    }

    // Set expiration (24 hours from now)
    const expiresAt = new Date(Date.now() + 24 * 60 * 60 * 1000);

    let mediaUrl = "";
    let mediaType = "text";

    if (storyMedia) {
      try {
        const fileExt = storyMedia.originalname.split(".").pop().toLowerCase();
        const videoFormats = ["mp4", "mov", "avi", "webm"];
        mediaType = videoFormats.includes(fileExt) ? "video" : "image";

        // Upload to cloudinary
        const result = await uploadFileToCloud(
          storyMedia.path,
          process.env.CLOUDI_FOLDER
        );

        mediaUrl = result.secure_url;

        // Clean up the local file
        await fs.unlink(storyMedia.path);
      } catch (error) {
        console.error("Media upload error:", error);
        return res.status(500).json({
          success: false,
          message: "Error uploading media",
        });
      }
    }

    // Create the story
    const story = await Story.create({
      content,
      user: userId,
      tags: tags ? JSON.parse(tags) : [],
      mediaUrl,
      mediaType,
      status: status || "published",
      duration: Math.min(Math.max(parseInt(duration) || 15, 1), 30), // Ensure duration is between 1-30 seconds
      expiresAt,
    });

    // Populate user info for the response
    const populatedStory = await Story.findById(story._id).populate(
      "user",
      "name username profilePic"
    );

    return res.status(201).json({
      success: true,
      message: "Story created successfully",
      data: populatedStory,
    });
  } catch (error) {
    // Clean up file if exists
    if (req.file) {
      try {
        await fs.unlink(req.file.path);
      } catch (err) {
        console.error("Error cleaning temporary file:", err);
      }
    }

    console.error("Story creation error:", error);
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// Get all active stories from followed users
export const getFollowingStories = async (req, res) => {
  try {
    const userId = req.user.id;

    // Find current user to get following list
    const currentUser = await User.findById(userId);
    if (!currentUser) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    // Get all following IDs plus current user (to see own stories)
    const followingIds = [...currentUser.following, userId];

    // Find active stories from followed users
    const stories = await Story.find({
      user: { $in: followingIds },
      expiresAt: { $gt: new Date() },
      status: "published",
      hiddenFrom: { $ne: userId }, // Exclude stories hidden from current user
    })
      .sort({ createdAt: -1 })
      .populate("user", "name username profilePic")
      .lean();

    // Group stories by user for a feed-like structure
    const userStories = {};
    stories.forEach((story) => {
      const userId = story.user._id.toString();
      if (!userStories[userId]) {
        userStories[userId] = {
          user: story.user,
          hasUnseenStories: !story.viewers.some(
            (viewer) => viewer.user.toString() === req.user.id
          ),
          stories: [],
        };
      }
      userStories[userId].stories.push(story);
    });

    return res.status(200).json({
      success: true,
      data: Object.values(userStories),
    });
  } catch (error) {
    console.error("Get stories error:", error);
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// Get stories from a specific user
export const getUserStories = async (req, res) => {
  try {
    const { userId } = req.params;
    const viewerId = req.user.id;

    // Find active stories from the user
    const stories = await Story.find({
      user: userId,
      expiresAt: { $gt: new Date() },
      status: "published",
      hiddenFrom: { $ne: viewerId },
    })
      .sort({ createdAt: 1 }) // Oldest first for chronological viewing
      .populate("user", "name username profilePic");

    if (!stories.length) {
      return res.status(404).json({
        success: false,
        message: "No active stories found",
      });
    }

    return res.status(200).json({
      success: true,
      data: stories,
    });
  } catch (error) {
    console.error("Get user stories error:", error);
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// Mark a story as viewed
export const viewStory = async (req, res) => {
  try {
    const { storyId } = req.params;
    const userId = req.user.id;

    const story = await Story.findById(storyId);
    if (!story) {
      return res.status(404).json({
        success: false,
        message: "Story not found",
      });
    }

    // Check if already viewed
    const alreadyViewed = story.viewers.some(
      (viewer) => viewer.user.toString() === userId
    );

    if (!alreadyViewed) {
      story.viewers.push({ user: userId, viewedAt: new Date() });
      await story.save();
    }

    return res.status(200).json({
      success: true,
      message: "Story marked as viewed",
    });
  } catch (error) {
    console.error("View story error:", error);
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// Delete a story
export const deleteStory = async (req, res) => {
  try {
    const { storyId } = req.params;
    const userId = req.user.id;

    const story = await Story.findById(storyId);
    if (!story) {
      return res.status(404).json({
        success: false,
        message: "Story not found",
      });
    }

    // Ensure the user owns the story
    if (story.user.toString() !== userId) {
      return res.status(403).json({
        success: false,
        message: "Not authorized to delete this story",
      });
    }

    // Remove file from cloud storage if exists
    if (story.mediaUrl) {
      try {
        await removeFileFromCloud(story.mediaUrl);
      } catch (err) {
        console.error("Error removing media from cloud:", err);
      }
    }

    await Story.findByIdAndDelete(storyId);

    return res.status(200).json({
      success: true,
      message: "Story deleted successfully",
    });
  } catch (error) {
    console.error("Delete story error:", error);
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// Add a story to highlights (prevent auto-deletion)
export const addToHighlights = async (req, res) => {
  try {
    const { storyId } = req.params;
    const { category } = req.body;
    const userId = req.user.id;

    if (!category) {
      return res.status(400).json({
        success: false,
        message: "Highlight category is required",
      });
    }

    const story = await Story.findById(storyId);
    if (!story) {
      return res.status(404).json({
        success: false,
        message: "Story not found",
      });
    }

    // Ensure the user owns the story
    if (story.user.toString() !== userId) {
      return res.status(403).json({
        success: false,
        message: "Not authorized to highlight this story",
      });
    }

    // Add to highlights by removing expiration and setting category
    story.expiresAt = null; // Remove expiration
    story.highlightCategory = category;
    await story.save();

    return res.status(200).json({
      success: true,
      message: "Story added to highlights",
      data: story,
    });
  } catch (error) {
    console.error("Add to highlights error:", error);
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// Get user's story highlights grouped by category
export const getHighlights = async (req, res) => {
  try {
    const { userId } = req.params;

    // Find highlighted stories
    const stories = await Story.find({
      user: userId,
      highlightCategory: { $exists: true, $ne: null },
    })
      .populate("user", "name username profilePic")
      .sort({ createdAt: -1 });

    // Group by highlight category
    const highlights = {};
    stories.forEach((story) => {
      const category = story.highlightCategory;
      if (!highlights[category]) {
        highlights[category] = [];
      }
      highlights[category].push(story);
    });

    return res.status(200).json({
      success: true,
      data: highlights,
    });
  } catch (error) {
    console.error("Get highlights error:", error);
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// Add a reaction to a story
export const addReaction = async (req, res) => {
  try {
    const { storyId } = req.params;
    const { emoji } = req.body;
    const userId = req.user.id;

    if (!emoji) {
      return res.status(400).json({
        success: false,
        message: "Emoji reaction is required",
      });
    }

    const story = await Story.findById(storyId);
    if (!story) {
      return res.status(404).json({
        success: false,
        message: "Story not found",
      });
    }

    // Add reaction
    story.reactions.push({
      emoji,
      user: userId,
      createdAt: new Date(),
    });

    await story.save();

    return res.status(200).json({
      success: true,
      message: "Reaction added",
      data: story.reactions,
    });
  } catch (error) {
    console.error("Add reaction error:", error);
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// Get viewer statistics for a story
export const getViewerStats = async (req, res) => {
  try {
    const { storyId } = req.params;
    const userId = req.user.id;

    const story = await Story.findById(storyId).populate(
      "viewers.user",
      "name username profilePic"
    );

    if (!story) {
      return res.status(404).json({
        success: false,
        message: "Story not found",
      });
    }

    // Ensure the user owns the story
    if (story.user.toString() !== userId) {
      return res.status(403).json({
        success: false,
        message: "Not authorized to view statistics",
      });
    }

    // Sort viewers by view time
    const viewers = story.viewers.sort((a, b) => b.viewedAt - a.viewedAt);

    const stats = {
      totalViews: viewers.length,
      viewers: viewers,
      viewPercentage:
        story.viewers.length > 0
          ? (
              (story.viewers.length / story.user.followers.length) *
              100
            ).toFixed(1)
          : 0,
    };

    return res.status(200).json({
      success: true,
      data: stats,
    });
  } catch (error) {
    console.error("Get viewer stats error:", error);
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};
