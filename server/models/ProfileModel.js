import mongoose from "mongoose";

const ProfileSchema = new mongoose.Schema(
  {
    gender: {
      type: String,
      trim: true,
    },
    age: {
      type: Number,
    },
    coverPic: {
      type: String,
    },
    bio: {
      type: String,
      trim: true,
    },
  },
  { timestamps: true }
);

const Profile =
  mongoose.models.Profile || mongoose.model("Profile", ProfileSchema);
export default Profile;
