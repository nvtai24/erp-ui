export type Role = {
  id?: string;
  name: string;
};

export type Permission = {
  name: string;
  description: string;
};

export type AssignRoleRequest = {
  username: string;
  roles: string[];
};

export type UpdateRoleRequest = {
  oldName: string;
  newName: string;
};

export type AssignPermissionsRequest = {
  roleName: string;
  permissions: string[];
};

export type ApiResponse<T> = {
  data: T | null;
  metaData: any | null;
  message: string;
  success: boolean;
  statusCode: number;
};