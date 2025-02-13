import apiConnecter from "../apiConnecter";
import { likeApiEndpoints } from "../apis";

export const like = async (postId, token) => {
  let result = "";
  try {
    result = await apiConnecter.post(
      likeApiEndpoints.LIKE_API,
      { postId },
      token
    );

    if (!result.success) {
      throw new Error(result.message);
    }

    console.log("likes => ", result);
  } catch (error) {
    console.log("Error While Liking ==> ", error);
  }
  return result;
};

export const unlike = async (postId, token) => {
  let result = "";

  try {
    result = await apiConnecter.post(
      likeApiEndpoints.UNLIKE_API,
      { postId },
      token
    );

    if (!result.success) {
      throw new Error(result.message);
    }

    console.log("likes => ", result);
  } catch (error) {
    console.log("Error While UnLiking ==> ", error);
  }
  return result;
};
