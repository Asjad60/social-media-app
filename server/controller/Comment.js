import { Comment } from "../models/CommentsModel.js";
import { Post } from "../models/PostsModel.js";

export const createComment = async (req, res) => {
  try {
    const user = req.user.id;
    const { postId, comment } = req.body;

    if (!postId || !comment) {
      return res.status(400).json({
        success: false,
        message: "postId and comment are required",
      });
    }

    const newComment = await Comment.create({
      userId: user,
      postId,
      comment,
    });

    const updatedPost = await Post.findByIdAndUpdate(
      postId,
      { $push: { comments: newComment._id } },
      { new: true }
    );

    return res.status(200).json({
      success: true,
      message: "Commented to Post",
      updatedPost,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      success: false,
      message: "Something went wrong while creating comment",
    });
  }
};
