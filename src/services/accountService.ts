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

interface GetAccountsParams {
  Keyword?: string;
  PageIndex?: number;
  PageSize?: number;
}

const accountService = {
  getAccounts: async (): Promise<ApiResponse<Account[]>> => {
    const res = await axiosClient.get<ApiResponse<Account[]>>(
      "/Accounts/GetUsers"
    );
    return res.data;
  },

getAccountsWithRoles: async (
    params?: GetAccountsParams
  ): Promise<ApiResponse<Account[]>> => {
    const res = await axiosClient.get<ApiResponse<Account[]>>(
      "/Accounts/GetUsersWithRoles",
      { params }
    );
    return res.data;
  },

  getCurrentUser: async (): Promise<ApiResponse<Account>> => {
    const res = await axiosClient.get<ApiResponse<Account>>(
      "/Accounts/CurrentUser",
      {
        withCredentials: true,
      }
    );
    return res.data;
  },

  register: async (data: RegisterRequest): Promise<ApiResponse<null>> => {
    const res = await axiosClient.post<ApiResponse<null>>(
      "/Accounts/Register",
      data
    );
    return res.data;
  },

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

  assignRole: async (data: AssignRoleRequest): Promise<ApiResponse<null>> => {
    const res = await axiosClient.post<ApiResponse<null>>(
      "/Role/assign",
      data
    );
    return res.data;
  },

  updateAccount: async (
    data: UpdateAccountRequest
  ): Promise<ApiResponse<null>> => {
    const res = await axiosClient.put<ApiResponse<null>>(
      "/Accounts/UpdateAccount",
      data
    );
    return res.data;
  },

  changePassword: async (
    data: ChangePasswordRequest
  ): Promise<ApiResponse<null>> => {
    const res = await axiosClient.post<ApiResponse<null>>(
      "/Accounts/ChangePassword",
      data
    );
    return res.data;
  },

  deleteAccount: async (username: string): Promise<ApiResponse<null>> => {
    const res = await axiosClient.delete<ApiResponse<null>>(
      `/Accounts/DeleteAccount/${username}`
    );
    return res.data;
  },
};

export default accountService;
