import { Customer } from "./customer";

export interface OrderItem {
  detailId: number;
  salesOrderId?: number;
  productId?: number;
  quantity?: number;
  unitPrice?: number;
  product?: any;
}

export interface Order {
  salesOrderId: number;
  orderDate: Date;
  customerId: number;
  status: string;
  customer?: Customer;
  orderItems?: OrderItem[];
}