import { loginAPiEndpoints, userAPiEndpoints } from "../apis";
import apiConnecter from "../apiConnecter";
import { setToken, setUser } from "../../slices/userSlice";
import toast from "react-hot-toast";

export const login = (data, navigate) => {
  return async (dispatch) => {
    const toastId = toast.loading("Loading...");
    try {
      const response = await apiConnecter.post(
        loginAPiEndpoints.LOGIN_API,
        data
      );
      // console.log("login api response ==> ", response);

      if (!response.success) {
        throw new Error(response.message);
      }

      localStorage.setItem("token", JSON.stringify(response.token));
      localStorage.setItem("user", JSON.stringify(response.data));
      dispatch(setToken(response.token));
      dispatch(setUser(response.data));
      toast.success("Logged in");
      navigate("/");
    } catch (error) {
      console.log("login error ==> ", error);
      toast.error(error.message);
    } finally {
      toast.dismiss(toastId);
    }
  };
};

export const register = (data, setIsLogin) => {
  return async () => {
    try {
      const response = await apiConnecter.post(
        loginAPiEndpoints.SIGNUP_API,
        data
      );

      if (!response.success) {
        throw new Error(response.message);
      }

      setIsLogin(true);
      toast.success("Account Created");
    } catch (error) {
      console.log(error);
      toast.error("Something wrong");
    }
  };
};

export const logout = (token) => {
  return async (dispatch) => {
    try {
      const response = await apiConnecter.get(
        loginAPiEndpoints.LOGOUT_API,
        token
      );
      if (!response.success) {
        throw new Error(response.message);
      }

      localStorage.removeItem("token");
      localStorage.removeItem("user");
      dispatch(setToken(null));
      dispatch(setUser(null));
      toast.success("Logged out");
      // console.log("logout response =>> ", response);
    } catch (error) {
      console.log(error);
      // return error;
    }
  };
};

export const getUserDetails = (token, navigate) => {
  return async (dispatch) => {
    try {
      const response = await apiConnecter.get(
        userAPiEndpoints.USER_DETAILS_API,
        token
      );

      if (!response.success) {
        throw new Error(response.message);
      }
      // console.log("response user =>> ", response);
      // localStorage.setItem("user", JSON.stringify(response.data));
      dispatch(setUser(response.data));
    } catch (error) {
      // console.log(error);
      localStorage.removeItem("token");
      localStorage.removeItem("user");
      dispatch(setToken(null));
      dispatch(setUser(null));
      navigate("/login");
    }
  };
};
