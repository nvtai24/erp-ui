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
}

export interface AuthError {
  message: string;
  errors?: Record<string, string[]>;
}

export const authService = {
  // Lưu tạm user trong frontend
  currentUser: null as LoginResponse | null,

  /**
   * Đăng nhập
   */
  login: async (credentials: LoginRequest): Promise<LoginResponse> => {
    try {
      const response = await axiosClient.post<LoginResponse>(
        "/Accounts/Login",
        credentials,
        { withCredentials: true } // gửi cookie kèm
      );

      // ✅ Lưu user vào currentUser
      authService.currentUser = response.data;

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
      await axiosClient.post("/Accounts/Logout", null, { withCredentials: true });
    } catch (error) {
      console.error("Logout error:", error);
    } finally {
      // Xóa user khi logout
      authService.currentUser = null;
    }
  },

  /**
   * Lấy thông tin user từ server
   */
  getCurrentUserFromServer: async (): Promise<LoginResponse | null> => {
    try {
      const response = await axiosClient.get<LoginResponse>("/Accounts/CurrentUser", {
        withCredentials: true,
      });

      // Đồng bộ currentUser
      authService.currentUser = response.data;

      return response.data;
    } catch {
      authService.currentUser = null;
      return null;
    }
  },

  /**
   * Lấy user đã lưu frontend
   */
  getCurrentUser: (): LoginResponse | null => {
    return authService.currentUser;
  },

  /**
   * Kiểm tra đã đăng nhập
   */
  isAuthenticated: async (): Promise<boolean> => {
    if (authService.currentUser) return true; // đã có trong frontend
    const user = await authService.getCurrentUserFromServer();
    return !!user;
  },

  /**
   * Kiểm tra role
   */
  hasRole: async (role: string): Promise<boolean> => {
    if (!authService.currentUser) {
      const user = await authService.getCurrentUserFromServer();
      return user?.roles?.includes(role) ?? false;
    }
    return authService.currentUser.roles.includes(role);
  },
};
