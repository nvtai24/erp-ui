export type Role = {
  id?: string;
  name: string;
};

export type AssignRoleRequest = {
  username: string;
  roles: string[];
};

export type UpdateRoleRequest = {
  oldName: string;
  newName: string;
};

export type ApiResponse<T> = {
  data: T | null;
  metaData: any | null;
  message: string;
  success: boolean;
  statusCode: number;
};
