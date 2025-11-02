import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axiosClient from "../../utils/axiosClient";
import { ViewPurchaseOrderDto } from "../../types/purchaseOrder";

export default function PurchaseOrderDetails() {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  const [order, setOrder] = useState<ViewPurchaseOrderDto | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const handleBack = () => {
    navigate("/purchase-orders");
  };

  useEffect(() => {
    const fetchOrderDetail = async () => {
      try {
        setLoading(true);
        const response = await axiosClient.get<ViewPurchaseOrderDto>(
          `/PurchaseOrders/${id}`,
          { withCredentials: true }
        );
        console.log(response.data);
        setOrder(response.data);
        setError(null);
      } catch (err) {
        console.error("Error fetching purchase order details:", err);
        setError("Failed to load purchase order details");
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      fetchOrderDetail();
    }
  }, [id]);

  if (loading) {
    return (
      <div className="fixed inset-0 flex items-center justify-center bg-white bg-opacity-75 dark:bg-gray-900 dark:bg-opacity-75 z-50">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center text-red-500 p-4">
        <p>{error}</p>
      </div>
    );
  }

  if (!order) {
    return (
      <div className="text-center text-gray-500 p-4">
        <p>Purchase order not found</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Back button */}
      <div>
        <button
          onClick={handleBack}
          className="flex items-center px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 dark:bg-gray-800 dark:border-gray-700 dark:text-gray-300 dark:hover:bg-gray-700"
        >
          <svg
            className="w-5 h-5 mr-2"
            viewBox="0 0 20 20"
            fill="none"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M10 19l-7-7m0 0l7-7m-7 7h18"
            />
          </svg>
          Back
        </button>
      </div>

      {/* Order Header */}
      <div className="bg-white dark:bg-white/[0.03] rounded-lg p-6 shadow-sm">
        <h2 className="text-2xl font-semibold text-gray-800 dark:text-white mb-4">
          Purchase Order #{order.purchaseOrderId}
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <p className="text-gray-600 dark:text-gray-400">
              <span className="font-medium">Supplier: </span>
              {order.supplierName}
            </p>
            <p className="text-gray-600 dark:text-gray-400">
              <span className="font-medium">Contact: </span>
              {order.contact}
            </p>
          </div>
          <div>
            <p className="text-gray-600 dark:text-gray-400">
              <span className="font-medium">Order Date: </span>
              {new Date(order.orderDate).toLocaleDateString()}
            </p>
            <p className="text-gray-600 dark:text-gray-400">
              <span className="font-medium">Total Amount: </span>
              {order.purchaseOrderDetails
                .reduce(
                  (total, item) => total + item.quantity * item.unitPrice,
                  0
                )
                .toLocaleString()}
              đ
            </p>
          </div>
        </div>
      </div>

      {/* Order Items */}
      <div className="bg-white dark:bg-white/[0.03] rounded-lg p-6 shadow-sm">
        <h3 className="text-xl font-semibold text-gray-800 dark:text-white mb-4">
          Order Items
        </h3>
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
            <thead>
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  Product
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  Unit Price
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  Quantity
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  Total
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
              {order.purchaseOrderDetails.map((item, index) => (
                <tr key={index}>
                  <td className="px-6 py-4 whitespace-nowrap text-gray-600 dark:text-gray-400">
                    {item.productName}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-gray-600 dark:text-gray-400">
                    {item.unitPrice.toLocaleString()}đ
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-gray-600 dark:text-gray-400">
                    {item.quantity}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-gray-600 dark:text-gray-400">
                    {(item.quantity * item.unitPrice).toLocaleString()}đ
                  </td>
                </tr>
              ))}
            </tbody>
            <tfoot>
              <tr>
                <td
                  colSpan={3}
                  className="px-6 py-4 text-right font-medium text-gray-700 dark:text-gray-300"
                >
                  Total:
                </td>
                <td className="px-6 py-4 whitespace-nowrap font-medium text-gray-700 dark:text-gray-300">
                  {order.purchaseOrderDetails
                    .reduce(
                      (total, item) => total + item.quantity * item.unitPrice,
                      0
                    )
                    .toLocaleString()}
                  đ
                </td>
              </tr>
            </tfoot>
          </table>
        </div>
      </div>
    </div>
  );
}
