import { User } from "../models/UserModel.js";

export const getUserDetails = async (req, res) => {
  try {
    const userId = req.user.id;
    const user = await User.findById(userId)
      .populate("followers following profile posts")
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

export const createProfile = async (req, res) => {
  try {
    const user = req.user.id;
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};
