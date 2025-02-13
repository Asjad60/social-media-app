import { useSelector } from "react-redux";
import { Navigate } from "react-router-dom";

const OpenRoute = ({ children }) => {
  const { token } = useSelector((state) => state.user);
  // console.log(token);
  if (token === null) return children;

  return <Navigate to={"/"} />;
};

export default OpenRoute;
