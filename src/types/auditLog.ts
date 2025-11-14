// Audit Log Types and Interfaces

export interface AuditLogSearchParams {
  pageIndex?: number;
  pageSize?: number;
  userId?: string;
  action?: string;
  endpoint?: string;
  logStatus?: 'SUCCESS' | 'FAILED' | '';
  fromDate?: string; // ISO format: "2025-11-01"
  toDate?: string; // ISO format: "2025-11-30"
  keyword?: string;
}

export interface AuditLogDto {
  id: string;
  createdAt: string;
  userId: string | null;
  userName: string | null;
  action: string;
  endpoint: string;
  status: 'SUCCESS' | 'FAILED';
  old: string | null;
  new: string | null;
}

export interface PagedResponse<T> {
  items: T[];
  pageIndex: number;
  pageSize: number;
  totalPages: number;
  totalCount: number;
  hasPreviousPage: boolean;
  hasNextPage: boolean;
}

export interface ApiResponse<T> {
  data: T;
  message: string;
  success: boolean;
  statusCode: number;
}
