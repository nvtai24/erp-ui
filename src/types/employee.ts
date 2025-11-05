export interface Employee {
  employeeId: number;
  fullName: string;
  gender: string;
  dateOfBirth: string;
  email: string;  
  phone: string;  
  position: string;
  departmentId: number;
  departmentName: string;
  hireDate: string;
  salary: number;
}

export interface EmployeeDetail {
  employeeId: number;
  fullName: string;
  gender: string;
  dateOfBirth: string;
  email: string; 
  phone: string;  
  position: string;
  departmentId: number;
  departmentName?: string;
  hireDate: string;
  salary: number;
  age: number;
  yearsOfService: number;
}

export interface CreateEmployeeDTO {
  fullName: string;
  gender: string;
  dateOfBirth: string;
  email: string; 
  phone: string;  
  position: string;
  departmentId: number;
  hireDate: string;
  salary: number;
}

export interface UpdateEmployeeDTO {
  employeeId: number;
  fullName: string;
  gender: string;
  dateOfBirth: string;
  email: string;  
  phone: string;  
  position: string;
  departmentId: number;
  hireDate: string;
  salary: number;
}

export interface EmployeeListRequestDTO {
  searchTerm?: string;
  departmentId?: number;
  position?: string;
  pageNumber: number;
  pageSize: number;
}

export interface EmployeeReport {
  employeeId: number;
  fullName: string;
  position: string;
  departmentName: string;
  hireDate: string;
  salary: number;
  yearsOfService: number;
}
export interface Department {
  departmentId: number;
  departmentName: string;
  description: string;
}

export interface DepartmentApiResponse {
  success: boolean;
  message: string;
  data: Department[];
}
export interface EmployeeApiResponse<T> {
  success: boolean;
  message: string;
  data: T;
  metaData?: {
    totalItems: number;
    pageIndex: number;
    pageSize: number;
    totalPages: number;
    hasNext: boolean;
    hasPrevious: boolean;
  };
}