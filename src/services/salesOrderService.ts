import { CreateOrderDto } from "../types/salesOrder";
import axiosClient from "../utils/axiosClient";

const orderService = {
  createOrder: (data: CreateOrderDto) => {
    return axiosClient.post("/SalesOrders", data);
  },

  getOrders: () => {
    return axiosClient.get("/SalesOrders");
  },
};

export default orderService;
