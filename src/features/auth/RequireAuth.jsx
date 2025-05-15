import { Navigate } from "react-router-dom";

export default function RequireAuth({ children, allowedUserTypes = [] }) {
  const user = JSON.parse(localStorage.getItem("loggedInUser"));

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  // If userType is not allowed, block access
  if (allowedUserTypes.length > 0 && !allowedUserTypes.includes(user.userType)) {
    return <Navigate to="/login" replace />;
  }

  return children;
}
