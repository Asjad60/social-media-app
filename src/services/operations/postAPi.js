import { postApiEndpoints } from "../apis";
import apiConnecter from "../apiConnecter";

export const getAllPosts = async () => {
  try {
    const response = await apiConnecter.get(postApiEndpoints.GET_ALL_POSTS);
    // console.log("res getallposts ==> ", response);
    return response;
  } catch (error) {
    return error.response;
  }
};

export const getUserPosts = async (token) => {
  try {
    const res = await apiConnecter.get(postApiEndpoints.GET_USER_POSTS, token);
    if (!res.success) {
      throw new Error(res.message);
    }
    return res;
  } catch (error) {
    console.log("getUserPostError => ", error);
  }
};
