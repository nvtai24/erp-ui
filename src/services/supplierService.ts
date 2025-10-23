import { ApiResponse, Supplier } from './../types/supplier';
import axiosClient from "../utils/axiosClient";

const supplierService = {
  getSuppliers: async (params: any): Promise<ApiResponse<Supplier[]>> => {
    const res = await axiosClient.get<ApiResponse<Supplier[]>>("/suppliers", { params });
    return res.data;
  },

  createSupplier: async (data: { supplierName: string; contact: string; address: string}): Promise<ApiResponse<Supplier>> => {
    const res = await axiosClient.post<ApiResponse<Supplier>>("/suppliers", data);
    return res.data;
  },

  updateSupplier: async (id: number, data: { supplierName: string; contact: string; address: string }): Promise<ApiResponse<Supplier>> => {
    const res = await axiosClient.put<ApiResponse<Supplier>>(`/suppliers/${id}`, data);
    return res.data;
  },

  deleteSupplier: async (id: number): Promise<ApiResponse<null>> => {
    const res = await axiosClient.delete<ApiResponse<null>>(`/suppliers/${id}`);
    return res.data;
  },
};

export default supplierService;
