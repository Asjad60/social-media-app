import Like from "../models/LikesModel.js";
import Post from "../models/PostsModel.js";

export const createLike = async (req, res) => {
  try {
    const user = req.user.id;
    const { postId } = req.body;
    if (!postId) {
      return res.status(400).json({
        success: false,
        message: "Post Id required",
      });
    }

    const newLike = await Like.create({
      user: user,
      post: postId,
    });

    const updatedPost = await Post.findByIdAndUpdate(
      postId,
      { $push: { likes: newLike._id } },
      // { $push: { likes: user } },
      { new: true }
    )
      .populate([
        {
          path: "likes",
          populate: {
            path: "user",
            select: "-password",
          },
        },
        {
          path: "comments",
          populate: {
            path: "user",
            select: "-password",
          },
        },
        {
          path: "user",
          select: "-password",
        },
      ])
      .lean();

    return res.status(200).json({
      success: true,
      message: "Post Liked",
      data: updatedPost,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      success: false,
      message: "Something went wrong while liking the post",
    });
  }
};

export const unlikePost = async (req, res) => {
  try {
    const user = req.user.id;
    const { postId } = req.body;
    if (!postId) {
      return res.status(400).json({
        success: false,
        message: "Post Id required",
      });
    }

    const deleteLike = await Like.findOneAndDelete({
      user: user,
      post: postId,
    });
    const removeLikeFromPost = await Post.findByIdAndUpdate(
      postId,
      { $pull: { likes: deleteLike._id } },
      // { $pull: { likes: user } },
      { new: true }
    )
      .populate([
        {
          path: "likes",
          populate: {
            path: "user",
            select: "-password",
          },
        },
        {
          path: "comments",
          populate: {
            path: "user",
            select: "-password",
          },
        },
        {
          path: "user",
          select: "-password",
        },
      ])
      .lean();
    return res.status(200).json({
      success: true,
      message: "Post unliked",
      data: removeLikeFromPost,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      success: false,
      message: "Something went wrong while liking the post",
    });
  }
};
