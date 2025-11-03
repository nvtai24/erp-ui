// services/auth/authService.ts
import axiosClient from "../utils/axiosClient";

export interface LoginRequest {
  username: string;
  password: string;
  rememberMe?: boolean;
}

export interface LoginResponse {
  message: string;
  username: string;
  roles: string[];
  permissions: string[];
}

export interface AuthError {
  message: string;
  errors?: Record<string, string[]>;
}

interface UserInfo {
  username: string;
  roles: string[];
  permissions: string[];
}

export const authService = {
  /**
   * Đăng nhập
   */
  login: async (credentials: LoginRequest): Promise<LoginResponse> => {
    try {
      const response = await axiosClient.post<LoginResponse>(
        "/Accounts/Login",
        credentials,
        { withCredentials: true }
      );
      if (response.data) {
        localStorage.setItem(
          "user",
          JSON.stringify({
            username: response.data.username,
            roles: response.data.roles,
            permissions: response.data.permissions || [],
          })
        );
      }

      return response.data;
    } catch (error: any) {
      if (error.response?.data) {
        throw error.response.data as AuthError;
      }
      throw { message: "Network error. Please try again." } as AuthError;
    }
  },

  /**
   * Đăng xuất
   */
  logout: async (): Promise<void> => {
    try {
      await axiosClient.post("/Accounts/Logout", null, {
        withCredentials: true,
      });
      localStorage.removeItem("user");
    } catch (error) {
      localStorage.removeItem("user");
      throw error;
    }
  },

  /**
   * Lấy thông tin user hiện tại
   */
  getCurrentUser: (): UserInfo | null => {
    const userStr = localStorage.getItem("user");
    if (userStr) {
      try {
        return JSON.parse(userStr) as UserInfo;
      } catch {
        return null;
      }
    }
    return null;
  },

  /**
   * Kiểm tra đã đăng nhập
   */
  isAuthenticated: (): boolean => {
    return !!localStorage.getItem("user");
  },

  /**
   * Kiểm tra role
   */
  hasRole: (role: string): boolean => {
    const user = authService.getCurrentUser();
    return user?.roles?.includes(role) ?? false;
  },

  /**
   * Kiểm tra có permission cụ thể
   */
  hasPermission: (permission: string): boolean => {
    const user = authService.getCurrentUser();
    return user?.permissions?.includes(permission) ?? false;
  },

  /**
   * Kiểm tra có ít nhất 1 trong các permissions
   */
  hasAnyPermission: (permissions: string[]): boolean => {
    const user = authService.getCurrentUser();
    if (!user?.permissions) return false;
    return permissions.some((permission) =>
      user.permissions.includes(permission)
    );
  },

  /**
   * Kiểm tra có tất cả các permissions
   */
  hasAllPermissions: (permissions: string[]): boolean => {
    const user = authService.getCurrentUser();
    if (!user?.permissions) return false;
    return permissions.every((permission) =>
      user.permissions.includes(permission)
    );
  },

  /**
   * Lấy danh sách permissions của user hiện tại
   */
  getPermissions: (): string[] => {
    const user = authService.getCurrentUser();
    return user?.permissions ?? [];
  },
};
