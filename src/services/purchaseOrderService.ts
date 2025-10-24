import axiosClient from "../utils/axiosClient";
import { Category } from "../types/purchaseOrder";
import { Product } from "../types/product";
import { Supplier } from "../types/supplier";
import { CreatePurchaseOrderDto } from "../types/purchaseOrder";

export const purchaseOrderService = {
  getCategories: async (): Promise<Category[]> => {
    const response = await axiosClient.get<Category[]>("/categories/v2");
    return response.data;
  },

  getSuppliers: async (): Promise<Supplier[]> => {
    const response = await axiosClient.get<Supplier[]>("/suppliers/v2");
    return response.data;
  },

  getProducts: async (): Promise<Product[]> => {
    const response = await axiosClient.get<Product[]>("/products");
    return response.data;
  },

  createPurchaseOrder: async (orderData: CreatePurchaseOrderDto): Promise<void> => {
    await axiosClient.post("/purchaseorders", orderData);
  }
};