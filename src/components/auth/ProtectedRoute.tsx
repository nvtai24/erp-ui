import { Navigate, useLocation } from "react-router";
import { authService } from "../../services/authService";

interface ProtectedRouteProps {
  children: React.ReactNode;
  requiredPermission?: string;
  requiredPermissions?: string[];
  requireAll?: boolean; // true: cần tất cả permissions, false: cần ít nhất 1
  requiredRole?: string; // Keep for backward compatibility
}

export default function ProtectedRoute({ 
  children, 
  requiredPermission,
  requiredPermissions,
  requireAll = false,
  requiredRole 
}: ProtectedRouteProps) {
  const location = useLocation();

  // Kiểm tra đã đăng nhập
  if (!authService.isAuthenticated()) {
    return <Navigate to={`/signin?redirect=${location.pathname}`} replace />;
  }

  // Kiểm tra quyền
  let hasAccess = true;

  if (requiredPermission) {
    // Kiểm tra 1 permission cụ thể
    hasAccess = authService.hasPermission(requiredPermission);
  } else if (requiredPermissions && requiredPermissions.length > 0) {
    // Kiểm tra nhiều permissions
    hasAccess = requireAll
      ? authService.hasAllPermissions(requiredPermissions)
      : authService.hasAnyPermission(requiredPermissions);
  } else if (requiredRole) {
    // Fallback: kiểm tra role (backward compatibility)
    hasAccess = authService.hasRole(requiredRole);
  }

  if (!hasAccess) {
    return <Navigate to="/forbidden" replace />;
  }

  return <>{children}</>;
}