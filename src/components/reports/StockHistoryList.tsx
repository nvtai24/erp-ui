import { StockHistory } from "../../types/reportStatistic";

interface StockHistoryTableProps {
  data: StockHistory[];
  isLoading: boolean;
}

export default function StockHistoryTable({
  data,
  isLoading,
}: StockHistoryTableProps) {
  const getTransactionBadgeColor = (type: string) => {
    return type === "IN"
      ? "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300"
      : "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300";
  };

  return (
    <div className="p-6">
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-gray-200 dark:border-gray-700">
              <th className="px-4 py-3 text-left font-semibold text-gray-900 dark:text-white">
                Product Name
              </th>
              <th className="px-4 py-3 text-right font-semibold text-gray-900 dark:text-white">
                Quantity
              </th>
              <th className="px-4 py-3 text-left font-semibold text-gray-900 dark:text-white">
                Type
              </th>
              <th className="px-4 py-3 text-left font-semibold text-gray-900 dark:text-white">
                Date
              </th>
              <th className="px-4 py-3 text-left font-semibold text-gray-900 dark:text-white">
                Warehouse
              </th>
            </tr>
          </thead>
          <tbody>
            {data.length === 0 ? (
              <tr>
                <td colSpan={5} className="px-4 py-8 text-center text-gray-500">
                  {isLoading ? "Loading..." : "No data available"}
                </td>
              </tr>
            ) : (
              data.map((item) => (
                <tr
                  key={item.transactionId}
                  className="border-b border-gray-100 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700"
                >
                  <td className="px-4 py-4 text-gray-900 dark:text-gray-100">
                    {item.productName}
                  </td>
                  <td className="px-4 py-4 text-right font-medium text-gray-900 dark:text-gray-100">
                    {item.quantity.toLocaleString()}
                  </td>
                  <td className="px-4 py-4">
                    <span
                      className={`px-2 py-1 rounded text-xs font-medium ${getTransactionBadgeColor(
                        item.transactionType
                      )}`}
                    >
                      {item.transactionType}
                    </span>
                  </td>
                  <td className="px-4 py-4 text-gray-900 dark:text-gray-100">
                    {new Date(item.transactionDate).toLocaleDateString()}
                  </td>
                  <td className="px-4 py-4 text-gray-900 dark:text-gray-100">
                    Warehouse {item.warehouseId}
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}