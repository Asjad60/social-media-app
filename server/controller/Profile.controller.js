import User from "../models/UserModel.js";
import Profile from "../models/ProfileModel.js";
import {
  removeFileFromCloud,
  uploadFileToCloud,
} from "../utils/UploadFileToCloud.js";
import fsPromises from "fs/promises";

export const getUserDetails = async (req, res) => {
  try {
    const userId = req.user.id;
    const user = await User.findById(userId)
      .populate("followers following profile")
      .select("-password")
      .exec();

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    return res.status(200).json({
      success: true,
      message: "User details fetched successfully",
      data: user,
    });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

export const followUser = async (req, res) => {
  try {
    const currentUserId = req.user.id;
    const { userId } = req.body;

    if (!userId) {
      return res.status(400).json({
        success: false,
        message: "Missing User",
      });
    }

    await Promise.all([
      User.findByIdAndUpdate(
        currentUserId,
        { $push: { following: userId } },
        { new: true }
      ),

      User.findOneAndUpdate(
        userId,
        { $push: { followers: currentUserId } },
        { new: true }
      ),
    ]);

    return res.status(200).json({
      success: true,
      message: "User followed",
    });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

export const updateProfile = async (req, res) => {
  try {
    const userId = req.user.id;
    const { name, email, age, gender, bio } = req.body;
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
      // Check if the profile picture is from an external source like Google
      const isExternalProfilePic = user.profilePic.includes(
        "googleusercontent.com"
      );
      // Only remove from cloud if it's not an external profile picture
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
