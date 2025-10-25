// types/reportStatistic.ts
export interface WarehouseStatistic {
  warehouseId: number;
  warehouseName: string;
  totalQuantity: number;
  totalValue: number;
  productCount: number;
}

export interface ProductStockDetail {
  productId: number;
  productName: string;
  sku: string;
  categoryName: string;
  quantity: number;
  unitPrice: number;
  totalValue: number;
  warehouseId: number;
  warehouseName: string;
}

export interface StockHistory {
  transactionId: number;
  productId: number;
  productName: string;
  quantity: number;
  transactionType: 'IN' | 'OUT';
  transactionDate: string;
  warehouseId: number;
}

export interface CustomerOrder {
  orderId: number;
  orderNo: string;
  customerName: string;
  orderDate: string;
  totalAmount: number;
  status: 'Pending' | 'Confirmed' | 'Shipped' | 'Delivered' | 'Cancelled';
  itemCount: number;
}

export interface CustomerOrderDetail {
  orderId: number;
  orderNo: string;
  customerName: string;
  orderDate: string;
  totalAmount: number;
  status: string;
  items: {
    productName: string;
    quantity: number;
    unitPrice: number;
    lineTotal: number;
  }[];
}

export interface WarehouseStatisticRequestDTO {
  warehouseId?: number;
  pageIndex: number;
  pageSize: number;
}

export interface StockHistoryRequestDTO {
  startDate?: string;
  endDate?: string;
  transactionType?: string;
  pageIndex: number;
  pageSize: number;
}

export interface CustomerOrderRequestDTO {
  customerId?: number;
  status?: string;
  pageIndex: number;
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


