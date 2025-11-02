import axiosClient from "../utils/axiosClient";
import { 
  ApiResponse, 
  Role, 
  AssignRoleRequest, 
  UpdateRoleRequest,
  Permission,
  AssignPermissionsRequest
} from "../types/role";

const roleService = {
  getRoles: async (): Promise<ApiResponse<Role[]>> => {
    const res = await axiosClient.get<ApiResponse<Role[]>>("/role");
    return res.data;
  },

  addRole: async (roleName: string): Promise<ApiResponse<Role>> => {
    const res = await axiosClient.post<ApiResponse<Role>>("/role/add", JSON.stringify(roleName), {
      headers: { "Content-Type": "application/json" },
    });
    return res.data;
  },

  updateRole: async (data: UpdateRoleRequest): Promise<ApiResponse<Role>> => {
    const res = await axiosClient.put<ApiResponse<Role>>("/role/update", data);
    return res.data;
  },

  deleteRole: async (roleName: string): Promise<ApiResponse<null>> => {
    const res = await axiosClient.delete<ApiResponse<null>>(`/role/${roleName}`);
    return res.data;
  },

  assignRole: async (data: AssignRoleRequest): Promise<ApiResponse<null>> => {
    const res = await axiosClient.post<ApiResponse<null>>("/role/assign", data);
    return res.data;
  },

  // New methods for permissions
  getAllPermissions: async (): Promise<ApiResponse<Permission[]>> => {
    const res = await axiosClient.get<ApiResponse<Permission[]>>("/role/permissions");
    return res.data;
  },

  getPermissionsByRole: async (roleName: string): Promise<ApiResponse<Permission[]>> => {
    const res = await axiosClient.get<ApiResponse<Permission[]>>(`/role/${roleName}/permissions`);
    return res.data;
  },

  assignPermissions: async (data: AssignPermissionsRequest): Promise<ApiResponse<null>> => {
    const res = await axiosClient.post<ApiResponse<null>>("/role/assign-permissions", data);
    return res.data;
  },
};

export default roleService;