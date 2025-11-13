// services/payrollService.ts
import axiosClient from "../utils/axiosClient";
import { ApiResponse, Payroll, PayrollCalculateModel } from "../types/payroll";

const payrollService = {
  getPayrolls: async (params: any): Promise<ApiResponse<Payroll[]>> => {
    const res = await axiosClient.get<ApiResponse<Payroll[]>>("/payrolls", { params });
    return res.data;
  },

  getPayrollById: async (id: number): Promise<ApiResponse<Payroll>> => {
    const res = await axiosClient.get<ApiResponse<Payroll>>(`/payrolls/${id}`);
    return res.data;
  },

  calculatePayroll: async (data: PayrollCalculateModel): Promise<ApiResponse<any>> => {
    const res = await axiosClient.post<ApiResponse<any>>("/payrolls/calculate", data);
    return res.data;
  },

  deletePayroll: async (id: number): Promise<ApiResponse<null>> => {
    const res = await axiosClient.delete<ApiResponse<null>>(`/payrolls/${id}`);
    return res.data;
  },
};

export default payrollService;