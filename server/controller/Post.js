import { Post } from "../models/PostsModel.js";
import { User } from "../models/UserModel.js";
import { uploadFileToCloud } from "../utils/UploadFileToCloud.js";

export const createPost = async (req, res) => {
  try {
    const userId = req.user.id;
    const { content, tags: tags_ } = req.body; //tags should be stringified(JSON.stringify(tags))
    const media = req.files || [];

    let tags;
    if (tags_) {
      tags = JSON.parse(tags_);
    }

    if (media.length === 0) {
      return res.status(400).json({
        success: false,
        message: "media is required.",
      });
    }

    let uploadedMedia = [];
    if (media.length > 0) {
      try {
        uploadedMedia = await Promise.all(
          media.map((file) =>
            uploadFileToCloud(file, process.env.CLOUDI_FOLDER)
          )
        );
      } catch (error) {
        console.error("Error uploading media:", error);
        return res.status(500).json({
          success: false,
          message: "Error uploading media",
        });
      }
    }

    const postMedia = await Post.create({
      user: userId,
      tags,
      content: content || "",
      media: uploadedMedia.map((item) => item.secure_url),
    });

    await User.findByIdAndUpdate(
      userId,
      { $push: { posts: postMedia._id } },
      { new: true }
    );

    return res.status(200).json({
      success: true,
      message: "Media Posted",
      media: postMedia,
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      success: false,
      message: "Something went wrong while posting media",
    });
  }
};

export const getUserPosts = async (req, res) => {
  try {
    const userId = req.user.id;
    const posts = await Post.find({ user: userId })
      .populate({
        path: "likes comments",
        populate: {
          path: "userId",
        },
      })
      .exec();

    if (!posts || posts.length === 0) {
      return res.status(404).json({
        success: false,
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

export const getAllPosts = async (req, res) => {
  try {
    const allPosts = await Post.find({})
      .populate({
        path: "user",
        select: "-password",
      })
      .populate([
        {
          path: "likes",
          populate: {
            path: "userId",
            select: "-password",
          },
        },
        {
          path: "comments",
          populate: {
            path: "userId",
            select: "-password",
          },
        },
      ])
      .exec();

    if (!allPosts || allPosts.length === 0) {
      return res.status(404).json({
        success: false,
        message: "Nothing Posted",
      });
    }

    return res.status(200).json({
      success: true,
      message: "All Posts found",
      data: allPosts,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      success: false,
      message: "something went wrong while getting all posts",
    });
  }
};
