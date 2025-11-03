// components/reports/CustomerOrdersList.tsx
import { CustomerOrder } from "../../types/reportStatistic";
import { Link } from "react-router-dom";

interface CustomerOrdersTableProps {
  data: CustomerOrder[];
  totalItems: number;
  currentPage: number;
  pageSize: number;
  isLoading: boolean;
  onPageChange: (page: number) => void;
}

export default function CustomerOrdersTable({
  data,
  totalItems,
  currentPage,
  pageSize,
  isLoading,
  onPageChange,
}: CustomerOrdersTableProps) {
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

  const totalPages = Math.ceil(totalItems / pageSize);

  const formatDate = (dateString: string) => {
    try {
      const date = new Date(dateString);
      return date.toLocaleDateString("en-US", {
        year: "numeric",
        month: "short",
        day: "numeric",
      });
    } catch {
      return dateString;
    }
  };

  return (
    <div className="p-6">
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-gray-200 dark:border-gray-700">
              <th className="px-4 py-3 text-left font-semibold text-gray-900 dark:text-white">
                Order ID
              </th>
              <th className="px-4 py-3 text-left font-semibold text-gray-900 dark:text-white">
                Customer
              </th>
              <th className="px-4 py-3 text-left font-semibold text-gray-900 dark:text-white">
                Date
              </th>
              <th className="px-4 py-3 text-right font-semibold text-gray-900 dark:text-white">
                Total Amount
              </th>
              <th className="px-4 py-3 text-left font-semibold text-gray-900 dark:text-white">
                Status
              </th>
              <th className="px-4 py-3 text-center font-semibold text-gray-900 dark:text-white">
                Action
              </th>
            </tr>
          </thead>
          <tbody>
            {isLoading ? (
              <tr>
                <td colSpan={6} className="px-4 py-8 text-center text-gray-500">
                  Loading...
                </td>
              </tr>
            ) : data.length === 0 ? (
              <tr>
                <td colSpan={6} className="px-4 py-8 text-center text-gray-500">
                  No orders found
                </td>
              </tr>
            ) : (
              data.map((order) => (
                <tr
                  key={order.salesOrderId}
                  className="border-b border-gray-100 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700/50"
                >
                  <td className="px-4 py-4 font-medium text-gray-900 dark:text-gray-100">
                    #{order.salesOrderId}
                  </td>
                  <td className="px-4 py-4 text-gray-900 dark:text-gray-100">
                    {order.customerName}
                  </td>
                  <td className="px-4 py-4 text-gray-900 dark:text-gray-100">
                    {formatDate(order.orderDate)}
                  </td>
                  <td className="px-4 py-4 text-right font-medium text-gray-900 dark:text-gray-100">
                    ${order.totalAmount.toLocaleString("en-US", {
                      minimumFractionDigits: 2,
                      maximumFractionDigits: 2,
                    })}
                  </td>
                  <td className="px-4 py-4">
                    <span
                      className={`inline-block px-2 py-1 rounded text-xs font-medium ${getStatusBadgeColor(
                        order.status
                      )}`}
                    >
                      {order.status}
                    </span>
                  </td>
                  <td className="px-4 py-4 text-center">
                    <Link
                      to={`/reports/orders/${order.salesOrderId}`}
                      className="text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300 font-medium"
                    >
                      View
                    </Link>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {totalPages > 1 && (
        <div className="mt-6 flex justify-center gap-2">
          {/* Previous Button */}
          <button
            onClick={() => onPageChange(currentPage - 1)}
            disabled={currentPage === 1}
            className="px-3 py-2 rounded disabled:opacity-50 disabled:cursor-not-allowed bg-gray-100 text-gray-900 hover:bg-gray-200 dark:bg-gray-700 dark:text-white dark:hover:bg-gray-600"
          >
            ← Previous
          </button>

          {/* Page Numbers */}
          {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
            <button
              key={page}
              onClick={() => onPageChange(page)}
              className={`px-3 py-2 rounded ${
                page === currentPage
                  ? "bg-blue-600 text-white font-semibold"
                  : "bg-gray-100 text-gray-900 hover:bg-gray-200 dark:bg-gray-700 dark:text-white dark:hover:bg-gray-600"
              }`}
            >
              {page}
            </button>
          ))}

          {/* Next Button */}
          <button
            onClick={() => onPageChange(currentPage + 1)}
            disabled={currentPage === totalPages}
            className="px-3 py-2 rounded disabled:opacity-50 disabled:cursor-not-allowed bg-gray-100 text-gray-900 hover:bg-gray-200 dark:bg-gray-700 dark:text-white dark:hover:bg-gray-600"
          >
            Next →
          </button>
        </div>
      )}
    </div>
  );
}