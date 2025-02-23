import mongoose from "mongoose";

const viewerSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  viewedAt: {
    type: Date,
    default: Date.now,
  },
});

const commentSchema = new mongoose.Schema({
  content: {
    type: String,
    required: true,
    trim: true,
  },
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

const storySchema = new mongoose.Schema(
  {
    content: {
      type: String,
      trim: true,
    },
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    mediaUrl: {
      type: String,
      trim: true,
    },
    mediaType: {
      type: String,
      enum: ["image", "video", "text"],
      default: "text",
    },

    duration: {
      type: Number,
      default: 15,
      min: 1,
      max: 30,
    },
    tags: [
      {
        type: String,
        trim: true,
      },
    ],

    status: {
      type: String,
      enum: ["draft", "published", "archived"],
      default: "published",
    },

    expiresAt: {
      type: Date,
      required: true,
      default: function () {
        return new Date(Date.now() + 24 * 60 * 60 * 1000);
      },
    },

    viewers: [viewerSchema],

    likes: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
      },
    ],

    reactions: [
      {
        emoji: String,
        user: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "User",
        },
        createdAt: {
          type: Date,
          default: Date.now,
        },
      },
    ],
    comments: [commentSchema],
    // Optional
    hiddenFrom: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
      },
    ],
    // Optional
    highlightCategory: {
      type: String,
      trim: true,
    },
  },
  {
    timestamps: true,
  }
);

// Indexes for better query performance
storySchema.index({ user: 1 });
storySchema.index({ createdAt: -1 });
storySchema.index({ expiresAt: 1 }, { expireAfterSeconds: 0 }); // TTL index for auto-deletion after expiresAt
storySchema.index({ "viewers.user": 1 }); // For querying who viewed stories

// Virtual property to track view count
storySchema.virtual("viewCount").get(function () {
  return this.viewers.length;
});

// Method to check if a story is expired
storySchema.methods.isExpired = function () {
  return new Date() > this.expiresAt;
};

// Method to add a viewer
storySchema.methods.addViewer = function (userId) {
  if (
    !this.viewers.some((viewer) => viewer.user.toString() === userId.toString())
  ) {
    this.viewers.push({ user: userId });
  }
  return this;
};

const Story = mongoose.models.Story || mongoose.model("Story", storySchema);

export default Story;
