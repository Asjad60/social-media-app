import { loginAPiEndpoints, profileAPiEndpoints } from "../apis";
import apiConnecter from "../apiConnecter";
import { setToken, setUser } from "../../slices/userSlice";

export const login = (data, navigate) => {
  return async (dispatch) => {
    try {
      const response = await apiConnecter.post(
        loginAPiEndpoints.LOGIN_API,
        data
      );
      console.log("login api response ==> ", response);

      if (!response.success) {
        throw new Error(response.message);
      }

      localStorage.setItem("token", JSON.stringify(response.token));
      localStorage.setItem("user", JSON.stringify(response.data));
      dispatch(setToken(response.token));
      dispatch(setUser(response.data));
      navigate("/");
    } catch (error) {
      console.log("login error ==> ", error);
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
    } catch (error) {
      console.log(error);
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
      console.log("logout response =>> ", response);
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
        profileAPiEndpoints.USER_DETAILS_API,
        token
      );

      if (!response.success) {
        throw new Error(response.message);
      }
      // console.log("response user =>> ", response);
      localStorage.setItem("user", JSON.stringify(response.data));
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
