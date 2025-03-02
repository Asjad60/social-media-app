import { AppError } from "../middleware/Error.middleware.js";
import Notification from "../models/NotificationModel.js";
import User from "../models/UserModel.js";

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

export const followUser = async (currentUserId, usersSocketIds, socket, io) => {
  try {
    const currentUserSocketId = usersSocketIds.get(currentUserId);
    socket.on("follow_user", async ({ toUser }, callback) => {
      if (!toUser) {
        throw new AppError("Missing toUserFollow", 400);
      }

      const userToFollow = await User.findById(toUser);
      if (!userToFollow) {
        throw new AppError("User to follow not found", 404);
      }

      const session = await User.startSession();
      session.startTransaction();

      try {
        const [currentUser, followedUser] = await Promise.all([
          User.findByIdAndUpdate(
            currentUserId,
            { $addToSet: { following: toUser } },
            { new: true }
          ).populate("following", "_id name profilePic"),

          User.findOneAndUpdate(
            toUser,
            { $addToSet: { followers: currentUserId } },
            { new: true }
          ).populate("followers", "_id name profilePic"),
        ]);

        await session.commitTransaction();

        io.to(currentUserSocketId).emit("follow_success", {
          success: true,
          message: "Followed",
          data: currentUser.following,
        });

        const notification = await Notification.create({
          user: currentUserId,
          to: toUser,
          type: "FOLLOW_REQUEST",
          content: {
            avatar: currentUser.profilePic,
            title: `${currentUser.name} is following you`,
          },
        });

        io.to(usersSocketIds.get(toUser)).emit("notification", {
          success: true,
          data: notification,
        });

        if (callback) callback({ success: true });
      } catch (error) {
        await session.abortTransaction();
        if (callback) callback({ success: false });
        throw error;
      } finally {
        session.endSession();
      }
    });
  } catch (error) {
    console.log("Follow Error: ", error.message);
    if (callback) callback({ success: false, message: error.message });
  }
};
