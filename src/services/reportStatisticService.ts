import axiosClient from "../utils/axiosClient";
import {
  WarehouseStatistic,
  ProductStockDetail,
  StockHistory,
  CustomerOrder,
  CustomerOrderDetail,
  WarehouseStatisticRequestDTO,
  StockHistoryRequestDTO,
  CustomerOrderRequestDTO,
  ReportApiResponse,
  DashboardSummary,
} from "../types/reportStatistic";

const reportStatisticService = {
  getWarehouseStatistics: async (
    params: WarehouseStatisticRequestDTO
  ): Promise<ReportApiResponse<WarehouseStatistic[]>> => {
    const res = await axiosClient.get<ReportApiResponse<WarehouseStatistic[]>>(
      "/warehouse-report/statistics",
      { params }
    );
    return res.data;
  },

  getProductStockDetail: async (
    params: WarehouseStatisticRequestDTO
  ): Promise<ReportApiResponse<ProductStockDetail[]>> => {
    const res = await axiosClient.get<ReportApiResponse<ProductStockDetail[]>>(
      "/warehouse-report/product-stock-detail",
      { params }
    );
    return res.data;
  },

  getStockHistory: async (
    params: StockHistoryRequestDTO
  ): Promise<ReportApiResponse<StockHistory[]>> => {
    const res = await axiosClient.get<ReportApiResponse<StockHistory[]>>(
      "/warehouse-report/stock-history",
      { params }
    );
    return res.data;
  },

  getCustomerOrders: async (
    params: CustomerOrderRequestDTO
  ): Promise<ReportApiResponse<CustomerOrder[]>> => {
    const res = await axiosClient.get<ReportApiResponse<CustomerOrder[]>>(
      "/warehouse-report/customer-orders",
      { params }
    );
    return res.data;
  },

  getCustomerOrderDetail: async (
    orderId: number
  ): Promise<ReportApiResponse<CustomerOrderDetail>> => {
    const res = await axiosClient.get<ReportApiResponse<CustomerOrderDetail>>(
      `/warehouse-report/customer-orders/${orderId}`
    );
    return res.data;
  },

  getDashboardSummary: async (): Promise<ReportApiResponse<DashboardSummary>> => {
    const res = await axiosClient.get<ReportApiResponse<DashboardSummary>>(
      "/warehouse-report/dashboard-summary"
    );
    return res.data;
  },
};

export default reportStatisticService;