import { postApiEndpoints } from "../apis";
import apiConnecter from "../apiConnecter";
import toast from "react-hot-toast";

export const getAllPosts = async () => {
  try {
    const response = await apiConnecter.get(postApiEndpoints.GET_ALL_POSTS);
    // console.log("res getallposts ==> ", response);
    return response;
  } catch (error) {
    return error.response;
  }
};

export const createPost = async (data, token) => {
  const toastId = toast.loading("Loading...");
  try {
    const result = await apiConnecter.post(
      postApiEndpoints.CREATE_POST,
      data,
      token,
      true
    );

    if (!result.success) {
      throw new Error(result.message);
    }

    toast.success("Post created");
  } catch (error) {
    console.log("Create Post Error => ", error);
  } finally {
    toast.dismiss(toastId);
  }
};
