import axiosClient from "../utils/axiosClient";
import { ApiResponse, Contract } from "../types/contract";

const contractService = {
  getContracts: async (params: any): Promise<ApiResponse<Contract[]>> => {
    const res = await axiosClient.get<ApiResponse<Contract[]>>("/contracts", { params });
    return res.data;
  },

  createContract: async (data: Omit<Contract, "contractId" | "employeeName">): Promise<ApiResponse<Contract>> => {
    const res = await axiosClient.post<ApiResponse<Contract>>("/contracts", data);
    return res.data;
  },

  updateContract: async (id: number, data: Partial<Contract>): Promise<ApiResponse<Contract>> => {
    const res = await axiosClient.put<ApiResponse<Contract>>(`/contracts/${id}`, data);
    return res.data;
  },

  deleteContract: async (id: number): Promise<ApiResponse<null>> => {
    const res = await axiosClient.delete<ApiResponse<null>>(`/contracts/${id}`);
    return res.data;
  },
};

export default contractService;
