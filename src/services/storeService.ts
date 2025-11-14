import axiosClient from "../utils/axiosClient";
import { Store, StoreApiResponse } from "../types/store";

const storeService = {
  // Get all stores
  getAllStores: async (): Promise<StoreApiResponse<Store[]>> => {
    const res = await axiosClient.get<StoreApiResponse<Store[]>>("/stores");
    return res.data;
  },

  // Get store by ID
  getStoreById: async (storeId: number): Promise<StoreApiResponse<Store>> => {
    const res = await axiosClient.get<StoreApiResponse<Store>>(
      `/stores/${storeId}`
    );
    return res.data;
  },

  // Create store
  createStore: async (data: {
    storeName: string;
    location: string;
  }): Promise<StoreApiResponse<Store>> => {
    const res = await axiosClient.post<StoreApiResponse<Store>>("/stores", data);
    return res.data;
  },

  // Update store
  updateStore: async (
    storeId: number,
    data: { storeName: string; location: string }
  ): Promise<StoreApiResponse<Store>> => {
    const res = await axiosClient.put<StoreApiResponse<Store>>(
      `/stores/${storeId}`,
      data
    );
    return res.data;
  },

  // Delete store
  deleteStore: async (storeId: number): Promise<StoreApiResponse<null>> => {
    const res = await axiosClient.delete<StoreApiResponse<null>>(
      `/stores/${storeId}`
    );
    return res.data;
  },
};

export default storeService;

