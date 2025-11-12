export type Contract = {
  contractId: number;
  contractType: string;
  startDate: string;
  endDate: string;
  baseSalary: number;
  position: string;
  status: string;
  employeeId: number;
  employeeName?: string;
};

export type ApiResponse<T> = {
  data: T | null;
  metaData: any | null;
  message: string;
  success: boolean;
  statusCode: number;
};
