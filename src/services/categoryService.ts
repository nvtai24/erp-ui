import { CategoryResponse, CreateCategoryDTO, UpdateCategoryDTO, SingleCategoryResponse } from './../types/category';
import type { Category } from "../types/category";
import axiosClient from "../utils/axiosClient";

interface CategoryParams {
  Keyword?: string;
  Status?: string;
  PageIndex?: number;
  PageSize?: number;
}

const categoryService = {
  getCategories: async (params?: CategoryParams): Promise<CategoryResponse> => {
    const response = await axiosClient.get<CategoryResponse>("/categories", { params });
    console.log("Fetched categories:", response.data);
    return response.data;
  },

  createCategory: async (data: CreateCategoryDTO): Promise<Category> => {
    const response = await axiosClient.post<SingleCategoryResponse>("/categories", data);
    return response.data.data;
  },

  updateCategory: async (categoryId: number, data: UpdateCategoryDTO): Promise<Category> => {
    const response = await axiosClient.put<SingleCategoryResponse>(`/categories/${categoryId}`, data);
    return response.data.data;
  },

  deleteCategory: async (categoryId: number): Promise<void> => {
    await axiosClient.delete(`/categories/${categoryId}`);
  },
};


export default categoryService;
