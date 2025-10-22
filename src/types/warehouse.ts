export type Warehouse = {
  warehouseId: number;
  warehouseName: string;
  location: string;
};

export type ApiResponse<T> = {
  data: T | null;
  metaData: any | null;
  message: string;
  success: boolean;
  statusCode: number;
};

export type WarehouseResponse = {
  data: Warehouse[];
  metaData: {
    totalItems: number;
    pageSize: number;
    currentPage: number;
    totalPages: number;
    hasPrev: boolean;
    hasNext: boolean;
  };
  message: string;
  success: boolean;
  statusCode: number;
};

export type SingleWarehouseResponse = {
  data: Warehouse;
  message: string;
  success: boolean;
  statusCode: number;
};

export type CreateWarehouseDTO = {
  warehouseName: string;
  location: string;
};

export type UpdateWarehouseDTO = {
  warehouseName: string;
  location: string;
};

export interface WarehouseParams {
  pageIndex?: number;
  pageSize?: number;
  keyword?: string;
  status?: string;
}

export interface WarehouseApiResponse {
  data: Warehouse[];
  metaData: {
    totalItems: number;
    pageSize: number;
    currentPage: number;
    totalPages: number;
    hasPrev: boolean;
    hasNext: boolean;
  };
  message: string;
  success: boolean;
  statusCode: number;
}
