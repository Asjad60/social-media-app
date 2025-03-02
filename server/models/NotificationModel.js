import mongoose from "mongoose";

const notificationSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    to: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    type: {
      type: String,
      required: true,
      enum: ["COMMENT", "LIKE", "FOLLOW_REQUEST", "PROFILE_VIEW"],
    },

    content: {
      avatar: {
        type: String,
        required: true,
      },
      title: {
        type: String,
        trim: true,
        required: true,
      },
    },

    isViewed: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true }
);

const Notification =
  mongoose.models.Notificaion ||
  mongoose.model("Notification", notificationSchema);
export default Notification;
