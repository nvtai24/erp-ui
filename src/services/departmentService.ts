// services/departmentService.ts
import axiosClient from "../utils/axiosClient";
import { Department, DepartmentApiResponse } from "../types/employee";

const departmentService = {
  getDepartments: async (): Promise<DepartmentApiResponse> => {
    const res = await axiosClient.get<DepartmentApiResponse>("/departments");
    return res.data;
  },
};

export default departmentService;