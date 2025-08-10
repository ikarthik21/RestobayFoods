import { Navigate } from "react-router-dom";
import useAuthStore from "@/store/use-auth";

// eslint-disable-next-line react/prop-types
const PublicRoute = ({ children }) => {
  const isLoggedIn = useAuthStore((state) => state.isAuthenticated);

  if (isLoggedIn) {
    return <Navigate to="/" replace />; // redirect to home
  }

  return children;
};

export default PublicRoute;
