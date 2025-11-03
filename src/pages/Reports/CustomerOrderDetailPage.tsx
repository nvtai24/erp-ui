// pages/reports/CustomerOrderDetailPage.tsx
import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import PageMeta from "../../components/common/PageMeta";
import reportStatisticService from "../../services/reportStatisticService";
import { CustomerOrderDetail } from "../../types/reportStatistic";

export default function CustomerOrderDetailPage() {
  const { orderId } = useParams<{ orderId: string }>();
  const navigate = useNavigate();
  const [order, setOrder] = useState<CustomerOrderDetail | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchOrderDetail = async () => {
      if (!orderId) return;

      setIsLoading(true);
      setError(null);
      try {
        const response = await reportStatisticService.getCustomerOrderDetail(
          Number(orderId)
        );

        if (response.success && response.data) {
          setOrder(response.data);
        } else {
          setError(response.message || "Failed to fetch order details");
        }
      } catch (error: any) {
        console.error("Fetch order detail error:", error);
        setError(error.response?.data?.message || "Failed to fetch order details");
      } finally {
        setIsLoading(false);
      }
    };

    fetchOrderDetail();
  }, [orderId]);

  const formatDate = (dateString: string) => {
    try {
      return new Date(dateString).toLocaleDateString();
    } catch {
      return dateString;
    }
  };

  if (isLoading) {
    return (
      <div className="mx-auto max-w-4xl mt-6 text-center">
        <p className="text-gray-500 dark:text-gray-400">Loading order details...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="mx-auto max-w-4xl mt-6">
        <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-4 mb-4">
          <p className="text-red-800 dark:text-red-300">{error}</p>
        </div>
        <button
          onClick={() => navigate("/reports/orders")}
          className="text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300 font-medium"
        >
          ← Back to Orders
        </button>
      </div>
    );
  }

  if (!order) {
    return (
      <div className="mx-auto max-w-4xl mt-6">
        <p className="text-gray-500 dark:text-gray-400">Order not found</p>
        <button
          onClick={() => navigate("/reports/orders")}
          className="mt-4 text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300 font-medium"
        >
          ← Back to Orders
        </button>
      </div>
    );
  }

  const getStatusBadgeColor = (status: string) => {
    const colors: Record<string, string> = {
      Pending: "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300",
      Confirmed: "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300",
      Shipped: "bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-300",
      Delivered: "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300",
      Cancelled: "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300",
    };
    return colors[status] || "bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-300";
  };

  const subtotal = order.orderDetails?.reduce(
    (sum, item) => sum + item.totalPrice,
    0
  ) || 0;
  const tax = subtotal * 0.1;

  return (
    <>
      <PageMeta
        title={`Order #${order.salesOrderId} | Report`}
        description="Order details"
      />

      <div className="mx-auto max-w-4xl mt-6">
        <button
          onClick={() => navigate("/reports/orders")}
          className="mb-4 text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300 font-medium"
        >
          ← Back to Orders
        </button>

        <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6 pb-6 border-b border-gray-200 dark:border-gray-700">
            <div>
              <p className="text-sm text-gray-600 dark:text-gray-400">Order ID</p>
              <p className="text-lg font-semibold text-gray-900 dark:text-white">
                #{order.salesOrderId}
              </p>
            </div>
            <div>
              <p className="text-sm text-gray-600 dark:text-gray-400">Customer</p>
              <p className="text-lg font-semibold text-gray-900 dark:text-white">
                {order.customerName}
              </p>
            </div>
            <div>
              <p className="text-sm text-gray-600 dark:text-gray-400">Order Date</p>
              <p className="text-lg font-semibold text-gray-900 dark:text-white">
                {formatDate(order.orderDate)}
              </p>
            </div>
            <div>
              <p className="text-sm text-gray-600 dark:text-gray-400">Status</p>
              <span
                className={`inline-block px-3 py-1 rounded text-sm font-medium ${getStatusBadgeColor(
                  order.status
                )}`}
              >
                {order.status}
              </span>
            </div>
          </div>

          <div className="mb-6">
            <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-4">
              Order Items
            </h2>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-gray-200 dark:border-gray-700">
                    <th className="px-4 py-3 text-left font-semibold text-gray-900 dark:text-white">
                      Product
                    </th>
                    <th className="px-4 py-3 text-center font-semibold text-gray-900 dark:text-white">
                      Quantity
                    </th>
                    <th className="px-4 py-3 text-right font-semibold text-gray-900 dark:text-white">
                      Unit Price
                    </th>
                    <th className="px-4 py-3 text-right font-semibold text-gray-900 dark:text-white">
                      Line Total
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {order.orderDetails && order.orderDetails.length > 0 ? (
                    order.orderDetails.map((item, index) => (
                      <tr
                        key={index}
                        className="border-b border-gray-100 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700"
                      >
                        <td className="px-4 py-4 text-gray-900 dark:text-gray-100">
                          {item.productName}
                        </td>
                        <td className="px-4 py-4 text-center text-gray-900 dark:text-gray-100">
                          {item.quantity}
                        </td>
                        <td className="px-4 py-4 text-right text-gray-900 dark:text-gray-100">
                          ${item.unitPrice.toLocaleString("en-US", {
                            minimumFractionDigits: 2,
                            maximumFractionDigits: 2,
                          })}
                        </td>
                        <td className="px-4 py-4 text-right font-medium text-gray-900 dark:text-gray-100">
                          ${item.totalPrice.toLocaleString("en-US", {
                            minimumFractionDigits: 2,
                            maximumFractionDigits: 2,
                          })}
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan={4} className="px-4 py-8 text-center text-gray-500">
                        No items in this order
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>

          <div className="flex justify-end">
            <div className="w-full md:w-80">
              <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4">
                <div className="flex justify-between mb-2">
                  <p className="text-gray-600 dark:text-gray-400">Subtotal:</p>
                  <p className="text-gray-900 dark:text-white">
                    ${subtotal.toLocaleString("en-US", {
                      minimumFractionDigits: 2,
                      maximumFractionDigits: 2,
                    })}
                  </p>
                </div>
                <div className="flex justify-between mb-2">
                  <p className="text-gray-600 dark:text-gray-400">Tax (10%):</p>
                  <p className="text-gray-900 dark:text-white">
                    ${tax.toLocaleString("en-US", {
                      minimumFractionDigits: 2,
                      maximumFractionDigits: 2,
                    })}
                  </p>
                </div>
                <div className="border-t border-gray-200 dark:border-gray-600 pt-2 mt-2">
                  <div className="flex justify-between">
                    <p className="font-bold text-gray-900 dark:text-white">Total:</p>
                    <p className="font-bold text-lg text-blue-600 dark:text-blue-400">
                      ${order.totalAmount.toLocaleString("en-US", {
                        minimumFractionDigits: 2,
                        maximumFractionDigits: 2,
                      })}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}