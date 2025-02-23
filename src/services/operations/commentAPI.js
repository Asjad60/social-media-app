import toast from "react-hot-toast";
import { commentApiEndpoints } from "../apis";
import apiConnecter from "../apiConnecter";

export const getCommentsOfaPost = async (
  postId,
  token,
  page = 1,
  limit = 10
) => {
  let result;
  try {
    result = await apiConnecter.get(
      `${commentApiEndpoints.GET_COMMENTS_OF_POST_API}/${postId}?page=${page}&limit=${limit}`,
      token
    );
    // console.log("result from comments : ", result);
    // toast.success();
  } catch (error) {
    console.log(error);
  }
  return result;
};

export const createComment = async (postId, comment, token) => {
  let result;
  const toastId = toast.loading("Loading...");
  try {
    result = await apiConnecter.post(
      commentApiEndpoints.CREATE_COMMENT_API,
      { postId, comment },
      token
    );
    toast.success("Commented");
  } catch (error) {
    console.log(error);
  } finally {
    toast.dismiss(toastId);
  }
  return result;
};

export const replyToComment = async (
  commentId,
  comment,
  replyToUser,
  token
) => {
  let result;
  const toastId = toast.loading("Loading...");
  try {
    result = await apiConnecter.post(
      commentApiEndpoints.REPLY_TO_COMMENT_API,
      { commentId, comment, replyToUser },
      token
    );
    toast.success("Commented");
  } catch (error) {
    console.log(error);
  } finally {
    toast.dismiss(toastId);
  }
  return result;
};

export const deleteComment = async (postId, commentId, token) => {
  let result;
  const toastId = toast.loading("Loading...");
  try {
    result = await apiConnecter.delete(
      commentApiEndpoints.DELETE_COMMENT_API,
      { postId, commentId },
      token
    );
    toast.success("Deleted");
  } catch (error) {
    console.log(error);
  } finally {
    toast.dismiss(toastId);
  }
  return result;
};

export const deleteReplyComment = async (replyId, commentId, token) => {
  let result;
  const toastId = toast.loading("Loading...");
  try {
    result = await apiConnecter.delete(
      commentApiEndpoints.DELETE_REPLY_COMMENT_API,
      { replyId, commentId },
      token
    );
    toast.success("Deleted");
  } catch (error) {
    console.log(error);
  } finally {
    toast.dismiss(toastId);
  }
  return result;
};
