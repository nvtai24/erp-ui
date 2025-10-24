// types/account.ts
export type Account = {
  id?: string;
  userName: string;
  email?: string;
  phoneNumber?: string;
  roles?: string[];
};

export type RegisterRequest = {
  userName: string;
  password: string;
  email?: string;
  phoneNumber?: string;
};

export type LoginRequest = {
  userName: string;
  password: string;
};

export type AssignRoleRequest = {
  userName: string; 
  roles: string[];
};

export type UpdateAccountRequest = {
  userName: string;
  email?: string;
  phoneNumber?: string;
};

export type ChangePasswordRequest = {
  userName: string;
  oldPassword: string;
  newPassword: string;
};

export type ApiResponse<T> = {
  data: T | null;
  metaData?: any | null;
  message: string;
  success?: boolean;
  statusCode?: number;
};

interface GetAccountsParams {
  Keyword?: string;
  PageIndex?: number;
  PageSize?: number;
}
