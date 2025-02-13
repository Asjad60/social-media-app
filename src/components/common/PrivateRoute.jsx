import { useSelector } from "react-redux";
import { Navigate } from "react-router-dom";

const PrivateRoute = ({ children }) => {
  const { token } = useSelector((state) => state.user);

  if (token === null) return <Navigate to={"/login"} />;

  return children;
};

export default PrivateRoute;
