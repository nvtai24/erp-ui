export type Customer = {
  customerId: number;
  name: string;
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