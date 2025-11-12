export type Payroll = {
  payrollId: number;
  employeeName: string;
  month: number;
  year: number;
  basicSalary: number;
  bonus: number;
  deductions: number;
  netPay: number;
};

export type ApiResponse<T> = {
  data: T | null;
  metaData?: {
    totalItems?: number;
  };
  message: string;
  success: boolean;
  statusCode?: number;
};
