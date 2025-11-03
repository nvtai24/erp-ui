// components/reports/WarehouseStatisticsTable.tsx
import { WarehouseStatistic } from "../../types/reportStatistic";

interface WarehouseStatisticsTableProps {
  data: WarehouseStatistic[];
  totalItems: number;
  currentPage: number;
  pageSize: number;
  isLoading: boolean;
  onPageChange: (page: number) => void;
  onPageSizeChange: (size: number) => void;
  onRefresh: () => void;
}

export default function WarehouseStatisticsTable({
  data,
  totalItems,
  currentPage,
  pageSize,
  isLoading,
  onPageChange,
  onPageSizeChange,
  onRefresh,
}: WarehouseStatisticsTableProps) {
  const totalPages = Math.ceil(totalItems / pageSize);

  return (
    <div className="p-6">
      <div className="mb-4 flex justify-between items-center">
        <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
          Warehouse Overview
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
                Warehouse Name
              </th>
              <th className="px-4 py-3 text-left font-semibold text-gray-900 dark:text-white">
                Location
              </th>
              <th className="px-4 py-3 text-right font-semibold text-gray-900 dark:text-white">
                Total Import
              </th>
              <th className="px-4 py-3 text-right font-semibold text-gray-900 dark:text-white">
                Total Export
              </th>
              <th className="px-4 py-3 text-right font-semibold text-gray-900 dark:text-white">
                Damaged Items
              </th>
              <th className="px-4 py-3 text-right font-semibold text-gray-900 dark:text-white">
                Current Stock
              </th>
            </tr>
          </thead>
          <tbody>
            {data.length === 0 ? (
              <tr>
                <td colSpan={6} className="px-4 py-8 text-center text-gray-500">
                  {isLoading ? "Loading..." : "No data available"}
                </td>
              </tr>
            ) : (
              data.map((warehouse) => (
                <tr
                  key={warehouse.warehouseId}
                  className="border-b border-gray-100 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700"
                >
                  <td className="px-4 py-4 text-gray-900 dark:text-gray-100">
                    {warehouse.warehouseName}
                  </td>
                  <td className="px-4 py-4 text-gray-900 dark:text-gray-100">
                    {warehouse.location}
                  </td>
                  <td className="px-4 py-4 text-right text-green-600 dark:text-green-400">
                    {warehouse.totalImport.toLocaleString()}
                  </td>
                  <td className="px-4 py-4 text-right text-blue-600 dark:text-blue-400">
                    {warehouse.totalExport.toLocaleString()}
                  </td>
                  <td className="px-4 py-4 text-right text-red-600 dark:text-red-400">
                    {warehouse.damagedItems.toLocaleString()}
                  </td>
                  <td className="px-4 py-4 text-right font-medium text-gray-900 dark:text-gray-100">
                    {warehouse.currentStock.toLocaleString()}
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {totalPages > 1 && (
        <div className="mt-4 flex justify-between items-center">
          <div className="flex items-center gap-2">
            <span className="text-sm text-gray-600 dark:text-gray-400">
              Rows per page:
            </span>
            <select
              value={pageSize}
              onChange={(e) => onPageSizeChange(Number(e.target.value))}
              className="px-3 py-1 border border-gray-300 dark:border-gray-600 rounded bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
            >
              <option value={5}>5</option>
              <option value={10}>10</option>
              <option value={20}>20</option>
              <option value={50}>50</option>
            </select>
          </div>

          <div className="flex gap-2">
            <button
              onClick={() => onPageChange(currentPage - 1)}
              disabled={currentPage === 1}
              className="px-3 py-2 rounded bg-gray-100 text-gray-900 hover:bg-gray-200 dark:bg-gray-700 dark:text-white dark:hover:bg-gray-600 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Previous
            </button>
            
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

            <button
              onClick={() => onPageChange(currentPage + 1)}
              disabled={currentPage === totalPages}
              className="px-3 py-2 rounded bg-gray-100 text-gray-900 hover:bg-gray-200 dark:bg-gray-700 dark:text-white dark:hover:bg-gray-600 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Next
            </button>
          </div>

          <span className="text-sm text-gray-600 dark:text-gray-400">
            Page {currentPage} of {totalPages}
          </span>
        </div>
      )}
    </div>
  );
}