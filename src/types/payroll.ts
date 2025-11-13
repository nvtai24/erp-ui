export type Payroll = {
  payrollId: number;
  employeeId: number;
  employeeName: string;
  month: number;
  year: number;
  basicSalary: number;
  deductions: number;
  netPay: number;
};

export type ApiResponse<T> = {
  data: T | null;
  metaData: any | null;
  message: string;
  success: boolean;
  statusCode: number;
};

export type PayrollCalculateModel = {
  employeeId: number;
  month: number;
  year: number;
};