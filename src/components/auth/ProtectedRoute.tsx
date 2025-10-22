// components/auth/ProtectedRoute.tsx
import { Navigate, useLocation } from "react-router";
import { authService } from "../../services/authService";

interface ProtectedRouteProps {
  children: React.ReactNode;
  requiredRole?: string;
}

export default function ProtectedRoute({ children, requiredRole }: ProtectedRouteProps) {
  const location = useLocation();
  const isAuthenticated = authService.isAuthenticated();

  // Kiểm tra đăng nhập
  if (!isAuthenticated) {
    return <Navigate to={`/auth/login?redirect=${location.pathname}`} replace />;
  }

  // Kiểm tra role nếu có yêu cầu
  if (requiredRole && !authService.hasRole(requiredRole)) {
    return <Navigate to="/auth/denied" replace />;
  }

  return <>{children}</>;
}