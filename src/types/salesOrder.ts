import { Customer } from "./customer";
import { Product } from "./product";

export interface OrderItem {
  detailId: number;
  salesOrderId?: number;
  productId?: number;
  quantity?: number;
  unitPrice?: number;
  product?: Product;
}

export interface Order {
  salesOrderId: number;
  orderDate: Date;
  customerId: number;
  status: string;
  customer?: Customer;
  orderItems?: OrderItem[];
}

export interface OrderDetail {
  productId: number;
  quantity: number;
  unitPrice: number;
}

export interface CreateOrderDto {
  customerId: number;
  name: string;
  contact: string;
  address: string;
  orderDetails: OrderDetail[];
}

export interface ViewOrderDto {
  orderId: number;
  orderDate: string;
  customerId: number;
  customerName: string;
  contact: string;
  staffId: number | null;
  staffName: string;
  orderDetails: ViewOrderDetailDto[];
}

export interface ViewOrderDetailDto {
  detailId: number;
  productId: number;
  productName: string;
  quantity: number;
  unitPrice: number;
}
