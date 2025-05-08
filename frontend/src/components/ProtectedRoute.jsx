import { Navigate } from "react-router-dom";

const ProtectedRoute = ({ children, allowedRoles }) => {
  const token = localStorage.getItem("token");
  const role = localStorage.getItem("role");

  if (!token) {
    return <Navigate to="/" />; // redirige vers login si pas connecté
  }

  if (allowedRoles && !allowedRoles.includes(role)) {
    return <Navigate to="/" />; // redirige si le rôle ne correspond pas
  }

  return children;
};

export default ProtectedRoute;
