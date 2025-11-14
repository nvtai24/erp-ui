// Types for Sale Staff Management
export interface SaleStaff {
  staffId: number;
  employeeId: number;
  employeeName: string;
  email: string;
  phoneNumber: string;
  position: string;
  storeId: number;
  storeName: string;
  storeLocation: string;
}

export interface CreateSaleStaffDTO {
  employeeId: number;
  storeId: number;
}

export interface UpdateSaleStaffDTO {
  storeId: number;
}

export interface SaleStaffApiResponse<T> {
  success: boolean;
  message: string;
  data: T;
  statusCode: number;
}

