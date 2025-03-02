import User from "../models/UserModel.js";
import Profile from "../models/ProfileModel.js";
import {
  removeFileFromCloud,
  uploadFileToCloud,
} from "../utils/UploadFileToCloud.js";
import fsPromises from "fs/promises";
import Post from "../models/PostsModel.js";

export const getUserPosts = async (req, res) => {
  try {
    const userId = req.user.id;
    const posts = await Post.find({ user: userId })
      .populate({
        path: "likes comments",
        populate: {
          path: "user",
        },
      })
      .exec();

    if (!posts || posts.length === 0) {
      return res.status(201).json({
        success: true,
        message: "Nothing Posted",
      });
    }
    return res.status(200).json({
      success: true,
      message: "Posts found",
      data: posts,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      success: false,
      message: "something went wrong while getting user posts",
    });
  }
};

export const updateProfile = async (req, res) => {
  try {
    const userId = req.user.id;
    const { name, email, age = null, gender, bio } = req.body;
    const { coverPic, profilePic } = req.files;

    const user = await User.findById(userId).populate("profile");
    if (!user) {
      if (coverPic) await fsPromises.unlink(coverPic.path);
      if (profilePic) await fsPromises.unlink(profilePic.path);
      return res
        .status(404)
        .json({ success: false, message: "User not found" });
    }

    if (coverPic?.[0] && user?.profile?.coverPic) {
      await removeFileFromCloud(user.profile.coverPic);
    }
    if (profilePic?.[0] && user?.profilePic) {
      const isExternalProfilePic = user.profilePic.includes(
        "googleusercontent.com"
      );

      if (!isExternalProfilePic) {
        await removeFileFromCloud(user.profilePic);
      }
    }

    const [coverpic, profilepic] = await Promise.all([
      coverPic?.[0].path
        ? uploadFileToCloud(coverPic[0].path, process.env.CLOUDI_FOLDER)
        : null,
      profilePic?.[0].path
        ? uploadFileToCloud(profilePic[0].path, process.env.CLOUDI_FOLDER)
        : null,
    ]);

    if (user.profile) {
      // Update existing profile
      if (name || email || profilePic?.[0].path) {
        if (name) user.name = name;
        if (email) user.email = email;
        if (profilepic) user.profilePic = profilepic.secure_url;
        await user.save();
      }

      await Profile.findByIdAndUpdate(
        user.profile,
        {
          $set: {
            age,
            gender,
            bio,
            coverPic: coverpic?.secure_url,
          },
        },
        { new: true }
      );
    } else {
      // Create new profile
      const profileData = {
        age,
        gender,
        bio,
      };

      // Only add coverPic if we have one
      if (coverpic && coverpic.secure_url) {
        profileData.coverPic = coverpic.secure_url;
      }

      const newProfile = await Profile.create(profileData);

      user.profile = newProfile._id;
      await user.save();
    }

    const updatedUser = await User.findById(userId).populate(
      "profile following followers"
    );

    return res.status(200).json({
      success: true,
      message: "Profile Updated",
      data: updatedUser,
    });
  } catch (error) {
    if (req.files?.coverPic?.[0]) {
      try {
        await fsPromises.unlink(req.files.coverPic?.[0].path);
      } catch (err) {
        console.error("Error deleting cover pic:", err);
      }
    }
    if (req.files?.profilePic?.[0]) {
      try {
        await fsPromises.unlink(req.files.profilePic?.[0].path);
      } catch (err) {
        console.error("Error deleting profile pic:", err);
      }
    }

    console.log(error);
    return res.status(500).json({ success: false, message: error.message });
  }
};

export const getUserProfile = async (req, res) => {
  try {
    const userId = req.params.id;
    const user = await User.findById(userId)
      .populate("profile following followers")
      .populate({
        path: "posts",
        populate: {
          path: "likes comments",
          populate: {
            path: "user",
            select: "name profilePic",
          },
        },
      })
      .select("-password")
      .lean();
    if (!user) {
      return res
        .status(404)
        .json({ success: false, message: "User not found" });
    } else {
      return res
        .status(200)
        .json({ success: true, message: "User found", data: user });
    }
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      success: false,
      message: "Something went wrong while getting user profile",
    });
  }
};
