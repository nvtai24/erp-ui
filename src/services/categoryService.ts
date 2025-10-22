import axiosClient from "../utils/axiosClient";
import { ApiResponse, Category } from "../types/category";

const categoryService = {
  getCategories: async (params: any): Promise<ApiResponse<Category[]>> => {
    const res = await axiosClient.get<ApiResponse<Category[]>>("/categories", { params });
    return res.data;
  },

  createCategory: async (data: { categoryName: string; description: string }): Promise<ApiResponse<Category>> => {
    const res = await axiosClient.post<ApiResponse<Category>>("/categories", data);
    return res.data;
  },

  updateCategory: async (id: number, data: { categoryName: string; description: string }): Promise<ApiResponse<Category>> => {
    const res = await axiosClient.put<ApiResponse<Category>>(`/categories/${id}`, data);
    return res.data;
  },

  deleteCategory: async (id: number): Promise<ApiResponse<null>> => {
    const res = await axiosClient.delete<ApiResponse<null>>(`/categories/${id}`);
    return res.data;
  },
};

export default categoryService;
