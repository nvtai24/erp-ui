import type { Product } from "../types/product";
import axiosClient from "../utils/axiosClient";

const productService = {
    getAllProducts: async (): Promise<Product[]> => {
        const response = await axiosClient.get<Product[]>("/products");
        return response.data;
    },

    createProduct: async (product: Omit<Product, "productId">): Promise<Product> => {
        const response = await axiosClient.post<Product>("/products", product);
        console.log("Created product response:", response.data);
        return response.data;
    }

}

export default productService;
    