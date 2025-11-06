import axiosClient from "../utils/axiosClient";
import {
  Employee,
  EmployeeDetail,
  CreateEmployeeDTO,
  UpdateEmployeeDTO,
  EmployeeListRequestDTO,
  EmployeeReport,
  EmployeeApiResponse,
} from "../types/employee";

const employeeService = {
  getEmployees: async (
    params: EmployeeListRequestDTO
  ): Promise<EmployeeApiResponse<Employee[]>> => {
    const res = await axiosClient.get<EmployeeApiResponse<Employee[]>>(
      "/employees",
      { params }
    );
    return res.data;
  },

  getEmployeeById: async (
    employeeId: number
  ): Promise<EmployeeApiResponse<EmployeeDetail>> => {
    const res = await axiosClient.get<EmployeeApiResponse<EmployeeDetail>>(
      `/employees/${employeeId}`
    );
    return res.data;
  },

  createEmployee: async (
    dto: CreateEmployeeDTO
  ): Promise<EmployeeApiResponse<number>> => {
    const res = await axiosClient.post<EmployeeApiResponse<number>>(
      "/employees",
      dto
    );
    return res.data;
  },

  updateEmployee: async (
    employeeId: number,
    dto: UpdateEmployeeDTO
  ): Promise<EmployeeApiResponse<boolean>> => {
    const res = await axiosClient.put<EmployeeApiResponse<boolean>>(
      `/employees/${employeeId}`,
      dto
    );
    return res.data;
  },

  deleteEmployee: async (
    employeeId: number
  ): Promise<EmployeeApiResponse<boolean>> => {
    const res = await axiosClient.delete<EmployeeApiResponse<boolean>>(
      `/employees/${employeeId}`
    );
    return res.data;
  },

  getEmployeeReport: async (
    fromDate?: string,
    toDate?: string
  ): Promise<EmployeeApiResponse<EmployeeReport[]>> => {
    const res = await axiosClient.get<EmployeeApiResponse<EmployeeReport[]>>(
      "/employees/report/salary-position",
      { params: { fromDate, toDate } }
    );
    return res.data;
  },
};

export default employeeService;