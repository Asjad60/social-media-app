import mongoose from "mongoose";

const ProfileSchema = new mongoose.Schema(
  {
    gender: {
      type: String,
      required: true,
    },
    age: {
      type: Number,
      required: true,
    },
    coverPic: {
      type: String,
      required: true,
    },
    bio: {
      type: String,
      required: true,
    },
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      index: true,
    },
  },
  { timestamps: true }
);

export const Profile =
  mongoose.models.Profile || mongoose.model("Profile", ProfileSchema);
