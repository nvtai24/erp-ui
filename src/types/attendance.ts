export type Attendance = {
  attendanceId: number;
  employeeId: number;
  employeeName: string;
  workDate: string;
  status: "Present" | "Absent" | "Late" | "Leave";
  daysOff: number;
};

export type ApiResponse<T> = {
  data: T | null;
  metaData: any | null;
  message: string;
  success: boolean;
  statusCode: number;
};

