export type Category = {
  categoryId: number;
  categoryName: string;
  description: string;
};

export type ApiResponse<T> = {
  data: T | null;
  metaData: any | null;
  message: string;
  success: boolean;
  statusCode: number;
};

export type CategoryResponse = {
  data: Category[];
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

export type SingleCategoryResponse = {
  data: Category;
  message: string;
  success: boolean;
  statusCode: number;
};

export type CreateCategoryDTO = {
  categoryName: string;
  description: string;
};

export type UpdateCategoryDTO = {
  categoryName: string;
  description: string;
};

export interface CategoryParams {
  pageIndex?: number;
  pageSize?: number;
  keyword?: string;
  status?: string;
}

export interface CategoryApiResponse {
  data: Category[];
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
