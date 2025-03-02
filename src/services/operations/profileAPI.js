import toast from "react-hot-toast";
import apiConnecter from "../apiConnecter";
import { profileAPiEndpoints } from "../apis";
import { setUser } from "../../slices/userSlice";

export const updateProfileDetails = async (data, token, dispatch) => {
  let result = "";
  const toastId = toast.loading("Loading...");
  try {
    result = await apiConnecter.post(
      profileAPiEndpoints.UPDATE_PROFILE,
      data,
      token,
      true
    );
    localStorage.setItem("user", JSON.stringify(result.data));
    dispatch(setUser(result.data));
    toast.success("Profile Updated");
  } catch (error) {
    console.log(error.message);
  } finally {
    toast.dismiss(toastId);
  }

  return result;
};

export const getUserPosts = async (token) => {
  try {
    const res = await apiConnecter.get(
      profileAPiEndpoints.GET_USER_POSTS,
      token
    );
    if (!res.success) {
      throw new Error(res.message);
    }
    return res;
  } catch (error) {
    console.log("getUserPostError => ", error);
  }
};

export const getUserProfile = async (token, id) => {
  try {
    const res = await apiConnecter.get(
      `${profileAPiEndpoints.GET_USER_PROFILE}/${id}`,
      token
    );
    if (!res.success) {
      throw new Error(res.message);
    }
    return res;
  } catch (error) {
    console.log("getUserPostError => ", error);
  }
};
