import axiosClient from "../utils/axiosClient";
import { ApiResponse, Warehouse } from "../types/warehouse";

const warehouseService = {
  getWarehouses: async (params: any): Promise<ApiResponse<Warehouse[]>> => {
    const res = await axiosClient.get<ApiResponse<Warehouse[]>>("/warehouses", { params });
    return res.data;
  },

  createWarehouse: async (data: { warehouseName: string; location: string }): Promise<ApiResponse<Warehouse>> => {
    const res = await axiosClient.post<ApiResponse<Warehouse>>("/warehouses", data);
    return res.data;
  },

  updateWarehouse: async (id: number, data: { warehouseName: string; location: string }): Promise<ApiResponse<Warehouse>> => {
    const res = await axiosClient.put<ApiResponse<Warehouse>>(`/warehouses/${id}`, data);
    return res.data;
  },

  deleteWarehouse: async (id: number): Promise<ApiResponse<null>> => {
    const res = await axiosClient.delete<ApiResponse<null>>(`/warehouses/${id}`);
    return res.data;
  },
};

export default warehouseService;