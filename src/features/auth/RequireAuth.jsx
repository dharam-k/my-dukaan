// RequireAuth.js
import { Navigate } from "react-router-dom";
import { useAuth } from "./AuthContext";

export default function RequireAuth({ children, allowedUserTypes = [] }) {
  const { user, loading } = useAuth();

  if (loading) {
    // or a loading spinner component
    return <div>Loading...</div>;
  }

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  if (allowedUserTypes.length && !allowedUserTypes.includes(user.userType)) {
    return <Navigate to="/login" replace />;
  }

  return children;
}