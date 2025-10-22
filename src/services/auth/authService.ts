// services/auth/authService.ts
import axiosClient from "../../utils/axiosClient"; // import axiosClient đã tạo

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
  /**
   * Đăng nhập
   */
  login: async (credentials: LoginRequest): Promise<LoginResponse> => {
    try {
      const response = await axiosClient.post<LoginResponse>(
        '/Accounts/Login', // axiosClient đã có baseURL là "/api"
        credentials,
        { withCredentials: true } // nếu backend cần gửi cookie
      );

      // Lưu thông tin user vào localStorage
      if (response.data) {
        localStorage.setItem('user', JSON.stringify({
          username: response.data.username,
          roles: response.data.roles,
        }));
      }

      return response.data;
    } catch (error: any) {
      if (error.response?.data) {
        throw error.response.data as AuthError;
      }
      throw { message: 'Network error. Please try again.' } as AuthError;
    }
  },

  /**
   * Đăng xuất
   */
  logout: async (): Promise<void> => {
    try {
      await axiosClient.post('/Accounts/Logout', null, { withCredentials: true });
      localStorage.removeItem('user');
    } catch (error) {
      localStorage.removeItem('user');
      throw error;
    }
  },

  /**
   * Lấy thông tin user hiện tại
   */
  getCurrentUser: () => {
    const userStr = localStorage.getItem('user');
    if (userStr) {
      try {
        return JSON.parse(userStr) as { username: string; roles: string[] };
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
    return !!localStorage.getItem('user');
  },

  /**
   * Kiểm tra role
   */
  hasRole: (role: string): boolean => {
    const user = authService.getCurrentUser();
    return user?.roles?.includes(role) ?? false;
  },
};
