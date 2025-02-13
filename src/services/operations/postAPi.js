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
