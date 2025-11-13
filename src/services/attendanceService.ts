import axiosClient from "../utils/axiosClient";
import { ApiResponse, Attendance } from "../types/attendance";

const attendanceService = {
  getAttendances: async (params: any): Promise<ApiResponse<Attendance[]>> => {
    const res = await axiosClient.get<ApiResponse<Attendance[]>>("/attendances", { params });
    return res.data;
  },

  createAttendance: async (data: {
    employeeId: number;
    workDate: string;
    status: string;
    daysOff: number;
  }): Promise<ApiResponse<Attendance>> => {
    const res = await axiosClient.post<ApiResponse<Attendance>>("/attendances", data);
    return res.data;
  },

  updateAttendance: async (
    id: number,
    data: Partial<Attendance>
  ): Promise<ApiResponse<Attendance>> => {
    const res = await axiosClient.put<ApiResponse<Attendance>>(`/attendances/${id}`, data);
    return res.data;
  },

  deleteAttendance: async (id: number): Promise<ApiResponse<null>> => {
    const res = await axiosClient.delete<ApiResponse<null>>(`/attendances/${id}`);
    return res.data;
  },
};

export default attendanceService;
