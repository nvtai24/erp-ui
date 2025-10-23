import axiosClient from "../utils/axiosClient";

// Mock data - to be replaced with API calls
export const mockCustomers = [
  { id: 1, name: "John Doe", phone: "0123456789", address: "123 Street A" },
  { id: 2, name: "Jane Smith", phone: "0987654321", address: "456 Street B" },
  { id: 3, name: "Bob Johnson", phone: "0123498765", address: "789 Street C" },
];

export const mockProducts = [
  { id: 1, name: "Product A", price: 100000 },
  { id: 2, name: "Product B", price: 200000 },
  { id: 3, name: "Product C", price: 300000 },
];

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

const orderService = {
  createOrder: (data: CreateOrderDto) => {
    return axiosClient.post("/api/Orders", data);
  },
};

export default orderService;