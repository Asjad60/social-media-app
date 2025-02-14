// src/pages/AuthSuccess.jsx
import { useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { useDispatch } from "react-redux";
import { setToken, setUser } from "../slices/userSlice";

const AuthSuccess = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();

  useEffect(() => {
    const user = searchParams.get("user");
    if (user) {
      const parsedUser = JSON.parse(decodeURIComponent(user));
      // Store Redux state
      localStorage.setItem("token", JSON.stringify(parsedUser.token));
      localStorage.setItem("user", JSON.stringify(parsedUser));
      dispatch(setToken(parsedUser.token));
      dispatch(setUser(parsedUser));
      // Redirect to dashboard
      navigate("/dashboard/profile");
    } else {
      navigate("/login");
    }
  }, [searchParams]);

  return <div>Loading...</div>;
};

export default AuthSuccess;
