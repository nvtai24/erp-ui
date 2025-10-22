import type { Category } from "../types/category";
import axiosClient from "../utils/axiosClient";

type CategoryResponse = {
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

const categoryService = {
  getCategories: async (): Promise<Category[]> => {
    const response = await axiosClient.get<CategoryResponse>("/categories");
    console.log("Fetched categories:", response.data.data);
    return response.data.data;
  },

  // Nếu cần paging, bạn có thể thêm:
  getCategoriesPaging: async (page: number, pageSize: number): Promise<CategoryResponse> => {
    const response = await axiosClient.get<CategoryResponse>("/categories", {
      params: { page, pageSize },
    });
    console.log("Fetched categories with paging:", response.data);
    return response.data;
  }
};

export default categoryService;
