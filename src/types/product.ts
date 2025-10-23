import { Category } from "./category";

export interface sampleProduct {
  id: string;
  name: string;
  description?: string;
  price: number;
  originalPrice?: number;
  category: string;
  brand?: string;
  sku: string;
  stock: number;
  status: 'active' | 'inactive' | 'out_of_stock';
  imageUrl?: string;
  tags?: string[];
  createdAt: string;
  updatedAt: string;
}

export interface ProductFilters {
  search?: string;
  category?: string;
  status?: sampleProduct['status'];
  minPrice?: number;
  maxPrice?: number;
}

export interface ProductListResponse {
  products: sampleProduct[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

// tProduct version
export interface Product {
  productId: number;
  productName: string;
  categoryId: number;
  unit: string;
  unitPrice : number;
  category: Category;
}