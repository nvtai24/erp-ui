// components/reports/ProductStockDetailTable.tsx
import { ProductStockDetail } from "../../types/reportStatistic";

interface ProductStockDetailTableProps {
  data: ProductStockDetail[];
  totalItems: number;
  currentPage: number;
  pageSize: number;
  isLoading: boolean;
  onPageChange: (page: number) => void;
  onPageSizeChange: (size: number) => void;
  onRefresh: () => void;
}

export default function ProductStockDetailTable({
  data,
  totalItems,
  currentPage,
  pageSize,
  isLoading,
  onPageChange,
  onPageSizeChange,
  onRefresh,
}: ProductStockDetailTableProps) {
  const totalPages = Math.ceil(totalItems / pageSize);

  return (
    <div className="p-6">
      <div className="mb-4 flex justify-between items-center">
        <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
          Product Stock Details
        </h2>
        <button
          onClick={onRefresh}
          disabled={isLoading}
          className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50"
        >
          {isLoading ? "Loading..." : "Refresh"}
        </button>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-gray-200 dark:border-gray-700">
              <th className="px-4 py-3 text-left font-semibold text-gray-900 dark:text-white">
                Product Name
              </th>
              <th className="px-4 py-3 text-left font-semibold text-gray-900 dark:text-white">
                SKU
              </th>
              <th className="px-4 py-3 text-left font-semibold text-gray-900 dark:text-white">
                Category
              </th>
              <th className="px-4 py-3 text-right font-semibold text-gray-900 dark:text-white">
                Quantity
              </th>
              <th className="px-4 py-3 text-right font-semibold text-gray-900 dark:text-white">
                Unit Price
              </th>
              <th className="px-4 py-3 text-right font-semibold text-gray-900 dark:text-white">
                Total Value
              </th>
              <th className="px-4 py-3 text-left font-semibold text-gray-900 dark:text-white">
                Warehouse
              </th>
            </tr>
          </thead>
          <tbody>
            {data.length === 0 ? (
              <tr>
                <td colSpan={7} className="px-4 py-8 text-center text-gray-500">
                  {isLoading ? "Loading..." : "No data available"}
                </td>
              </tr>
            ) : (
              data.map((item) => (
                <tr
                  key={`${item.productId}-${item.warehouseId}`}
                  className="border-b border-gray-100 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700"
                >
                  <td className="px-4 py-4 text-gray-900 dark:text-gray-100">
                    {item.productName}
                  </td>
                  <td className="px-4 py-4 text-gray-600 dark:text-gray-300 font-mono text-xs">
                    {item.sku}
                  </td>
                  <td className="px-4 py-4 text-gray-900 dark:text-gray-100">
                    {item.categoryName}
                  </td>
                  <td className="px-4 py-4 text-right text-gray-900 dark:text-gray-100">
                    {item.quantity.toLocaleString()}
                  </td>
                  <td className="px-4 py-4 text-right text-gray-900 dark:text-gray-100">
                    ${item.unitPrice.toLocaleString("en-US", {
                      minimumFractionDigits: 2,
                      maximumFractionDigits: 2,
                    })}
                  </td>
                  <td className="px-4 py-4 text-right font-medium text-gray-900 dark:text-gray-100">
                    ${item.totalValue.toLocaleString("en-US", {
                      minimumFractionDigits: 2,
                      maximumFractionDigits: 2,
                    })}
                  </td>
                  <td className="px-4 py-4 text-gray-900 dark:text-gray-100">
                    {item.warehouseName}
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {totalPages > 1 && (
        <div className="mt-4 flex justify-center gap-2">
          {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
            <button
              key={page}
              onClick={() => onPageChange(page)}
              className={`px-3 py-2 rounded ${
                page === currentPage
                  ? "bg-blue-600 text-white"
                  : "bg-gray-100 text-gray-900 hover:bg-gray-200 dark:bg-gray-700 dark:text-white dark:hover:bg-gray-600"
              }`}
            >
              {page}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}