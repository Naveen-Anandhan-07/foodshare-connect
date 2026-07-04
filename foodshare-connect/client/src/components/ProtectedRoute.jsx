import { Navigate } from "react-router-dom";

// Guards a route so only a logged-in user with the correct role can access it.
const ProtectedRoute = ({ children, allowedRole }) => {
  const token = localStorage.getItem("token");
  const role = localStorage.getItem("role");

  if (!token || role !== allowedRole) {
    return <Navigate to={`/${allowedRole}/login`} replace />;
  }

  return children;
};

export default ProtectedRoute;
