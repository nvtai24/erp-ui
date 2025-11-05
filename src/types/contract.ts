export interface Contract {
  contractId: number;
  employeeId: number;
  employeeName?: string;
  contractType: string;
  position: string;
  baseSalary: number;
  startDate: string;
  endDate?: string;
  status: string;
}

export interface ContractSave {
  contractId?: number;
  employeeId: number;
  contractType: string;
  position: string;
  baseSalary: number;
  startDate: string;
  endDate?: string;
}

export interface ContractSearch {
  keyword?: string;
  pageNumber?: number;
  pageSize?: number;
}
