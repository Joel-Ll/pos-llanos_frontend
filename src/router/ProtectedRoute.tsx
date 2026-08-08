import { Navigate } from "react-router";

export const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
  const token = localStorage.getItem('AUTH_TOKEN');

  if (!token) {
    return <Navigate to="/auth/login" replace />;
  }

  return <>{children}</>;
};