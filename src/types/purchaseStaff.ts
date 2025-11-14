// Types for Purchase Staff Management
export interface PurchaseStaff {
  staffId: number;
  employeeId: number;
  employeeName: string;
  email: string;
  phoneNumber: string;
  position: string;
  warehouseId: number;
  warehouseName: string;
  warehouseLocation: string;
}

export interface CreatePurchaseStaffDTO {
  employeeId: number;
  warehouseId: number;
}

export interface UpdatePurchaseStaffDTO {
  warehouseId: number;
}

export interface PurchaseStaffApiResponse<T> {
  success: boolean;
  message: string;
  data: T;
  statusCode: number;
}

