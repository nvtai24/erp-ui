export type Supplier = {
  supplierId: number;
  supplierName: string;
  contact: string;
  address: string;
};

export type ApiResponse<T> = {
  data: T | null;
  metaData: any | null;
  message: string;
  success: boolean;
  statusCode: number;
};