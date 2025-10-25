import axiosClient from "../utils/axiosClient";
import { ApiResponse, Role, AssignRoleRequest, UpdateRoleRequest } from "../types/role";

const roleService = {
  /** 🧩 Lấy danh sách tất cả roles */
  getRoles: async (): Promise<ApiResponse<Role[]>> => {
    const res = await axiosClient.get<ApiResponse<Role[]>>("/role");
    return res.data;
  },

  /** ➕ Thêm role mới */
  addRole: async (roleName: string): Promise<ApiResponse<Role>> => {
    const res = await axiosClient.post<ApiResponse<Role>>("/role/add", JSON.stringify(roleName), {
      headers: { "Content-Type": "application/json" },
    });
    return res.data;
  },

  /** ✏️ Cập nhật tên role */
  updateRole: async (data: UpdateRoleRequest): Promise<ApiResponse<Role>> => {
    const res = await axiosClient.put<ApiResponse<Role>>("/role/update", data);
    return res.data;
  },

  /** 🗑️ Xóa role theo tên */
  deleteRole: async (roleName: string): Promise<ApiResponse<null>> => {
    const res = await axiosClient.delete<ApiResponse<null>>(`/role/${roleName}`);
    return res.data;
  },

  /** 👥 Gán role cho user */
  assignRole: async (data: AssignRoleRequest): Promise<ApiResponse<null>> => {
    const res = await axiosClient.post<ApiResponse<null>>("/role/assign", data);
    return res.data;
  },
};

export default roleService;
