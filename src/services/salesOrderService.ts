import { CreateOrderDto } from "../types/salesOrder";
import axiosClient from "../utils/axiosClient";



const orderService = {
  createOrder: (data: CreateOrderDto) => {
    return axiosClient.post("/SalesOrders", data);
  },

  getOrders: () => {
    return axiosClient.get("/Orders");
  },
};

export default orderService;