import axiosClient from "../../utils/axiosClient";
import { ViewPurchaseOrderDto } from "../../types/purchaseOrder";
import { useEffect } from "react";

export default function PurchaseOrders() {
  useEffect(() => {
    axiosClient
      .get<ViewPurchaseOrderDto[]>("/purchaseorders")
      .then((response) => {
        console.log("Purchase Orders API response:", response.data);
      });
  }, []);

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-semibold text-gray-900 dark:text-white">
          Purchase Orders
        </h1>
      </div>
    </div>
  );
}
