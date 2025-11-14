import axiosClient from "../utils/axiosClient";
import {
  SaleStaff,
  CreateSaleStaffDTO,
  UpdateSaleStaffDTO,
  SaleStaffApiResponse,
} from "../types/saleStaff";

const saleStaffService = {
  // Get all sale staff
  getAllSaleStaff: async (): Promise<SaleStaffApiResponse<SaleStaff[]>> => {
    const res = await axiosClient.get<SaleStaffApiResponse<SaleStaff[]>>(
      "/sales/sale-staff"
    );
    return res.data;
  },

  // Get sale staff by ID
  getSaleStaffById: async (
    staffId: number
  ): Promise<SaleStaffApiResponse<SaleStaff>> => {
    const res = await axiosClient.get<SaleStaffApiResponse<SaleStaff>>(
      `/sales/sale-staff/${staffId}`
    );
    return res.data;
  },

  // Get sale staff by store ID
  getSaleStaffByStore: async (
    storeId: number
  ): Promise<SaleStaffApiResponse<SaleStaff[]>> => {
    const res = await axiosClient.get<SaleStaffApiResponse<SaleStaff[]>>(
      `/sales/sale-staff/store/${storeId}`
    );
    return res.data;
  },

  // Create new sale staff (assign employee to store)
  createSaleStaff: async (
    dto: CreateSaleStaffDTO
  ): Promise<SaleStaffApiResponse<SaleStaff>> => {
    const res = await axiosClient.post<SaleStaffApiResponse<SaleStaff>>(
      "/sales/sale-staff",
      dto
    );
    return res.data;
  },

  // Update sale staff (transfer to another store)
  updateSaleStaff: async (
    staffId: number,
    dto: UpdateSaleStaffDTO
  ): Promise<SaleStaffApiResponse<SaleStaff>> => {
    const res = await axiosClient.put<SaleStaffApiResponse<SaleStaff>>(
      `/sales/sale-staff/${staffId}`,
      dto
    );
    return res.data;
  },

  // Delete sale staff
  deleteSaleStaff: async (
    staffId: number
  ): Promise<SaleStaffApiResponse<boolean>> => {
    const res = await axiosClient.delete<SaleStaffApiResponse<boolean>>(
      `/sales/sale-staff/${staffId}`
    );
    return res.data;
  },
};

export default saleStaffService;

