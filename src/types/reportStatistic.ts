// types/reportStatistic.ts

export interface WarehouseStatistic {
  warehouseId: number;
  warehouseName: string;
  location: string;
  totalImport: number;
  totalExport: number;
  damagedItems: number;
  currentStock: number;
  fromDate: string;
  toDate: string;
}

export interface ProductStockDTO {
  productId: number;
  productName: string;
  warehouseId: number;
  warehouseName: string;
  quantityImport: number;
  quantityExport: number;
  currentStock: number;
  damagedQuantity: number;
  totalValue: number;
}

export interface StockHistory {
  transactionId: number;
  productId: number;
  productName: string;
  quantity: number;
  transactionType: 'IMPORT' | 'EXPORT';
  transactionDate: string;
  warehouseId: number;
  warehouseName: string;
  reference: string;
}

export interface CustomerOrderDetailItem {
  detailId: number;
  productId: number;
  productName: string;
  quantity: number;
  unitPrice: number;
  totalPrice: number;
}

// List view - không cần orderDetails
export interface CustomerOrder {
  salesOrderId: number;
  orderDate: string;
  customerId: number;
  customerName: string;
  status: string;
  totalAmount: number;
}

// Detail view - có orderDetails
export interface CustomerOrderDetail {
  salesOrderId: number;
  orderDate: string;
  customerId: number;
  customerName: string;
  status: string;
  totalAmount: number;
  orderDetails: CustomerOrderDetailItem[];
}

export interface WarehouseStatisticRequestDTO {
  warehouseId?: number;
  productId?: number;
  fromDate?: string;
  toDate?: string;
}

export interface StockHistoryRequestDTO {
  warehouseId?: number;
  productId?: number;
  fromDate?: string;
  toDate?: string;
  transactionType?: string;
  pageNumber: number;
  pageSize: number;
}

export interface CustomerOrderRequestDTO {
  customerId?: number;
  status?: string;
  fromDate?: string;
  toDate?: string;
  pageNumber: number;
  pageSize: number;
}

export interface ReportApiResponse<T> {
  success: boolean;
  message: string;
  data: T;
  metaData?: {
    totalItems: number;
    pageIndex: number;
    pageSize: number;
    totalPages: number;
    hasNext: boolean;
    hasPrevious: boolean;
  };
}

export interface DashboardSummary {
  totalWarehouses: number;
  totalProducts: number;
  totalInventoryValue: number;
  totalCustomers: number;
  totalOrders: number;
  pendingOrders: number;
}