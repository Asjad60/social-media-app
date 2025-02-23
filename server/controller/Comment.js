import Comment from "../models/CommentsModel.js";
import Post from "../models/PostsModel.js";
import User from "../models/UserModel.js";

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
      user: user,
      post: postId,
      comment,
    });

    const updatedPost = await Post.findByIdAndUpdate(
      postId,
      { $push: { comments: newComment._id } },
      { new: true }
    );

    return res.status(201).json({
      success: true,
      message: "Commented to Post",
      data: newComment,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      success: false,
      message: "Something went wrong while creating comment",
    });
  }
};

export const getCommentsOfaPost = async (req, res) => {
  try {
    const postId = req.params.postId;
    const { page = 1, limit = 10 } = req.query;

    const skip = (Number(page) - 1) * Number(limit);

    if (!postId) {
      return res.status(400).json({
        success: false,
        message: "Post id is required",
      });
    }

    const comments = await Comment.find({ post: postId })
      .populate("user", "name _id profilePic")
      .populate("replies.user", "name _id profilePic")
      .populate("replies.to", "name _id profilePic")
      .sort({ createdAt: -1 })
      .limit(Number(limit))
      .skip(skip)
      .lean();

    if (!comments.length) {
      return res.status(204).json({
        success: true,
        message: "No Comments",
        data: {},
      });
    }

    const total = await Comment.countDocuments({ post: postId });

    return res.status(200).json({
      success: true,
      message: "Comment Found",
      data: {
        comments,
        total,
        page: Number(page),
        pages: Math.ceil(total / Number(limit)),
      },
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      success: false,
      message: "Something went wrong while Getting comment",
    });
  }
};

export const deleteComment = async (req, res) => {
  try {
    const userId = req.user.id;
    const { commentId, postId } = req.body;

    const post = await Post.findById(postId);

    if (!post) {
      return res.status(404).json({
        success: false,
        message: "Post not found",
      });
    }

    const comment = await Comment.findById(commentId);
    if (!comment) {
      return res.status(404).json({
        success: false,
        message: "Comment not found",
      });
    }

    const isPostOwner = post.user.toString() === userId.toString();
    const isCommentOwner = comment.user.toString() === userId.toString();

    if (!isPostOwner && !isCommentOwner) {
      return res.status(403).json({
        success: false,
        message: "You can't delete the comment",
      });
    }

    const [updatedPost] = await Promise.all([
      Post.findByIdAndUpdate(
        postId,
        {
          $pull: { comments: commentId },
        },
        { new: true }
      ),
      await Comment.findByIdAndDelete(commentId),
    ]);

    return res.status(200).json({
      success: true,
      message: "Comment deleted",
      data: updatedPost,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      success: false,
      message: "Something went wrong while Deleting comment",
    });
  }
};

export const replyToComment = async (req, res) => {
  try {
    const userId = req.user.id;
    const { commentId, comment, replyToUser } = req.body;

    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found or User not Logged in",
      });
    }

    if (!commentId || !comment || !replyToUser) {
      return res.status(400).json({
        success: false,
        message: "Comment, replyToUser and CommentId required",
      });
    }

    const updateComment = await Comment.findByIdAndUpdate(
      commentId,
      {
        $push: {
          replies: { user: userId, comment: comment, to: replyToUser },
        },
      },
      { new: true }
    )
      .populate("replies.user", "profilePic name createdAt _id")
      .populate("replies.to", "profilePic name createdAt _id")
      .lean();

    return res.status(201).json({
      success: true,
      message: "Reply sent",
      data: updateComment,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      success: false,
      message: "Something went wrong while Replying to comment",
    });
  }
};

export const deleteReply = async (req, res) => {
  try {
    const userId = req.user.id;

    const { commentId, replyId } = req.body;

    if (!replyId || !commentId) {
      return res.status(400).json({
        success: false,
        message: "Bad request or fields required",
      });
    }

    const comment = await Comment.findById(commentId);
    if (!comment) {
      return res.status(404).json({
        success: false,
        message: "Comment Not Found or Comment deleted",
      });
    }

    const isOwnerOfReply = comment.replies.some(
      (reply) =>
        reply.user.toString() === userId.toString() &&
        reply._id.toString() === replyId.toString()
    );

    if (!isOwnerOfReply) {
      return res.status(403).json({
        success: false,
        message: "Unauthorized or you can't delete the reply comment",
      });
    }

    const updateComment = await Comment.findByIdAndUpdate(
      commentId,
      {
        $pull: {
          replies: { _id: replyId, user: userId },
        },
      },
      { new: true }
    )
      .populate("user", "name profilePic _id createdAt")
      .populate("replies.user", "name profilePic _id")
      .populate("replies.to", "name profilePic _id")
      .lean();

    return res.status(200).json({
      success: true,
      message: "Reply Deleted",
      data: updateComment,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      success: false,
      message: "Something went wrong while Deleting Reply comment",
    });
  }
};
