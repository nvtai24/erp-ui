// Types for Store Management
export interface Store {
  storeId: number;
  storeName: string;
  location: string;
}

export interface StoreApiResponse<T> {
  success: boolean;
  message: string;
  data: T;
  statusCode: number;
}

