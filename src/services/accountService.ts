// services/accountService.ts
import axiosClient from "../utils/axiosClient";
import {
  ApiResponse,
  Account,
  RegisterRequest,
  LoginRequest,
  AssignRoleRequest,
  UpdateAccountRequest,
  ChangePasswordRequest,
} from "../types/account";

const accountService = {
  /** 🧾 Lấy danh sách toàn bộ tài khoản */
  getAccounts: async (): Promise<ApiResponse<Account[]>> => {
    const res = await axiosClient.get<ApiResponse<Account[]>>(
      "/Accounts/GetUsers"
    );
    return res.data;
  },

  /** 🧾 Lấy danh sách tài khoản kèm roles */
  getAccountsWithRoles: async (): Promise<ApiResponse<Account[]>> => {
    const res = await axiosClient.get<ApiResponse<Account[]>>(
      "/Accounts/GetUsersWithRoles"
    );
    return res.data;
  },

  /** 🧍‍♂️ Lấy thông tin tài khoản hiện tại */
  getCurrentUser: async (): Promise<ApiResponse<Account>> => {
    const res = await axiosClient.get<ApiResponse<Account>>(
      "/Accounts/CurrentUser",
      {
        withCredentials: true,
      }
    );
    return res.data;
  },

  /** 📝 Đăng ký tài khoản mới */
  register: async (data: RegisterRequest): Promise<ApiResponse<null>> => {
    const res = await axiosClient.post<ApiResponse<null>>(
      "/Accounts/Register",
      data
    );
    return res.data;
  },

  /** 🔐 Đăng nhập */
  login: async (data: LoginRequest): Promise<ApiResponse<Account>> => {
    const res = await axiosClient.post<ApiResponse<Account>>(
      "/Accounts/Login",
      data,
      {
        withCredentials: true,
      }
    );
    return res.data;
  },

  /** 🚪 Đăng xuất */
  logout: async (): Promise<ApiResponse<null>> => {
    const res = await axiosClient.post<ApiResponse<null>>(
      "/Accounts/Logout",
      {},
      {
        withCredentials: true,
      }
    );
    return res.data;
  },

  /** 👥 Gán role cho user */
  assignRole: async (data: AssignRoleRequest): Promise<ApiResponse<null>> => {
    const res = await axiosClient.post<ApiResponse<null>>(
      "/Accounts/assign-role",
      data
    );
    return res.data;
  },

  /** 🛠️ Cập nhật thông tin tài khoản (email, phoneNumber) */
  updateAccount: async (
    data: UpdateAccountRequest
  ): Promise<ApiResponse<null>> => {
    const res = await axiosClient.put<ApiResponse<null>>(
      "/Accounts/UpdateAccount",
      data
    );
    return res.data;
  },

  /** 🔑 Đổi mật khẩu */
  changePassword: async (
    data: ChangePasswordRequest
  ): Promise<ApiResponse<null>> => {
    const res = await axiosClient.post<ApiResponse<null>>(
      "/Accounts/ChangePassword",
      data
    );
    return res.data;
  },

  /** 🗑️ Xóa tài khoản */
  deleteAccount: async (username: string): Promise<ApiResponse<null>> => {
    const res = await axiosClient.delete<ApiResponse<null>>(
      `/Accounts/DeleteAccount/${username}`
    );
    return res.data;
  },
};

export default accountService;
