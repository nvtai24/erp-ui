import { CreateOrderDto } from "../types/order";
import axiosClient from "../utils/axiosClient";



const orderService = {
  createOrder: (data: CreateOrderDto) => {
    return axiosClient.post("/Orders", data);
  },

  getOrders: () => {
    return axiosClient.get("/Orders");
  },
};

export default orderService;