import { Navigate } from "react-router-dom";
import useAuthStore from "@/store/use-auth";

// eslint-disable-next-line react/prop-types
const PrivateRoute = ({ children }) => {
  const isLoggedIn = useAuthStore((state) => state.isAuthenticated);

  if (!isLoggedIn) {
    return <Navigate to="/login" replace />;
  }

  return children;
};

export default PrivateRoute;
