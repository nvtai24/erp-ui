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


export interface CreateOrderItemDto {
  productId: number;
  quantity: number;
  unitPrice: number;
}

export interface CreateOrderDto {
  customerId: number;
  name: string;
  contact: string;
  address: string;
  orderDetails: CreateOrderItemDto[];
}