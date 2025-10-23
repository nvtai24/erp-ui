// components/auth/ProtectedRoute.tsx
import { useEffect, useState } from "react";
import { Navigate, useLocation } from "react-router";
import { authService } from "../../services/authService";

interface ProtectedRouteProps {
  children: React.ReactNode;
  requiredRole?: string;
}

export default function ProtectedRoute({ children, requiredRole }: ProtectedRouteProps) {
  const location = useLocation();
  const [loading, setLoading] = useState(true); // đang kiểm tra
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [hasRole, setHasRole] = useState(false);

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const authenticated = await authService.isAuthenticated();
        setIsAuthenticated(authenticated);

        if (authenticated && requiredRole) {
          const roleOk = await authService.hasRole(requiredRole);
          setHasRole(roleOk);
        } else if (authenticated) {
          setHasRole(true); // đã login, không cần role
        }
      } catch (error) {
        setIsAuthenticated(false);
        setHasRole(false);
      } finally {
        setLoading(false);
      }
    };

    checkAuth();
  }, [requiredRole]);

  if (loading) return <div>Loading...</div>;

  if (!isAuthenticated) {
    // Chưa login → redirect signin
    return <Navigate to={`/signin?redirect=${location.pathname}`} replace />;
  }

  if (!hasRole) {
    // Đăng nhập nhưng không có quyền → redirect forbidden
    return <Navigate to="/forbidden" replace />;
  }

  return <>{children}</>;
}
