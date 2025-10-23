import axiosClient from "../utils/axiosClient";
import { ApiResponse, Customer } from "../types/customer";

const customerService = {
  getCustomers: async (params: any): Promise<ApiResponse<Customer[]>> => {
    const res = await axiosClient.get<ApiResponse<Customer[]>>("/customers", { params });
    return res.data;
  },

  createCustomer: async (data: { name: string; contact: string; address: string }): Promise<ApiResponse<Customer>> => {
    const res = await axiosClient.post<ApiResponse<Customer>>("/customers", data);
    return res.data;
  },

  updateCustomer: async (id: number, data: { name: string; contact: string; address: string }): Promise<ApiResponse<Customer>> => {
    const res = await axiosClient.put<ApiResponse<Customer>>(`/customers/${id}`, data);
    return res.data;
  },

  deleteCustomer: async (id: number): Promise<ApiResponse<null>> => {
    const res = await axiosClient.delete<ApiResponse<null>>(`/customers/${id}`);
    return res.data;
  },
};

export default customerService;
