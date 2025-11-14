import axiosClient from "../utils/axiosClient";
import {
  PurchaseStaff,
  CreatePurchaseStaffDTO,
  UpdatePurchaseStaffDTO,
  PurchaseStaffApiResponse,
} from "../types/purchaseStaff";

const purchaseStaffService = {
  // Get all purchase staff
  getAllPurchaseStaff: async (): Promise<
    PurchaseStaffApiResponse<PurchaseStaff[]>
  > => {
    const res = await axiosClient.get<PurchaseStaffApiResponse<PurchaseStaff[]>>(
      "/procurement/purchase-staff"
    );
    return res.data;
  },

  // Get purchase staff by ID
  getPurchaseStaffById: async (
    staffId: number
  ): Promise<PurchaseStaffApiResponse<PurchaseStaff>> => {
    const res = await axiosClient.get<PurchaseStaffApiResponse<PurchaseStaff>>(
      `/procurement/purchase-staff/${staffId}`
    );
    return res.data;
  },

  // Get purchase staff by warehouse ID
  getPurchaseStaffByWarehouse: async (
    warehouseId: number
  ): Promise<PurchaseStaffApiResponse<PurchaseStaff[]>> => {
    const res = await axiosClient.get<PurchaseStaffApiResponse<PurchaseStaff[]>>(
      `/procurement/purchase-staff/warehouse/${warehouseId}`
    );
    return res.data;
  },

  // Create new purchase staff (assign employee to warehouse)
  createPurchaseStaff: async (
    dto: CreatePurchaseStaffDTO
  ): Promise<PurchaseStaffApiResponse<PurchaseStaff>> => {
    const res = await axiosClient.post<PurchaseStaffApiResponse<PurchaseStaff>>(
      "/procurement/purchase-staff",
      dto
    );
    return res.data;
  },

  // Update purchase staff (transfer to another warehouse)
  updatePurchaseStaff: async (
    staffId: number,
    dto: UpdatePurchaseStaffDTO
  ): Promise<PurchaseStaffApiResponse<PurchaseStaff>> => {
    const res = await axiosClient.put<PurchaseStaffApiResponse<PurchaseStaff>>(
      `/procurement/purchase-staff/${staffId}`,
      dto
    );
    return res.data;
  },

  // Delete purchase staff
  deletePurchaseStaff: async (
    staffId: number
  ): Promise<PurchaseStaffApiResponse<boolean>> => {
    const res = await axiosClient.delete<PurchaseStaffApiResponse<boolean>>(
      `/procurement/purchase-staff/${staffId}`
    );
    return res.data;
  },
};

export default purchaseStaffService;

