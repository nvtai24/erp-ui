import { useCallback } from "react";
import PageMeta from "../../components/common/PageMeta";
import reportStatisticService from "../../services/reportStatisticService";
import { StockHistoryRequestDTO } from "../../types/reportStatistic";
import { useToast } from "../../components/ui/toast/ToastProvider";
import StockHistoryTable from "../../components/reports/StockHistoryList";
import { ToastProvider } from "../../components/ui/toast/ToastProvider";
import { useState } from "react";

function StockHistoryContent() {
  const [filters, setFilters] = useState({
    fromDate: "",
    toDate: "",
    transactionType: "",
  });
  const [filterNameInput, setFilterNameInput] = useState("");
  const [filterStatusInput, setFilterStatusInput] = useState("");
  const [refreshKey, setRefreshKey] = useState(0);
  const { addToast } = useToast();

  // ✅ Giống Customer - fetchStockHistory nhận page và pageSize
  const fetchStockHistory = useCallback(
    async (page: number, pageSize: number) => {
      try {
        const params: StockHistoryRequestDTO = {
          fromDate: filters.fromDate || undefined,
          toDate: filters.toDate || undefined,
          transactionType: filters.transactionType || undefined,
          pageNumber: page,
          pageSize: pageSize,
        };

        const response = await reportStatisticService.getStockHistory(params);

        if (!response.success) {
          addToast({
            type: "error",
            message: response.message || "Failed to fetch stock history",
          });
          return { data: [], totalItems: 0 };
        }

        return {
          data: response.data || [],
          totalItems: response.metaData?.totalItems || 0,
        };
      } catch (error: any) {
        console.error("Fetch stock history error:", error);
        addToast({
          type: "error",
          message:
            error.response?.data?.message || "Failed to fetch stock history",
        });
        return { data: [], totalItems: 0 };
      }
    },
    [filters, addToast]
  );

  const handleFilterChange = (field: string, value: string) => {
    setFilters((prev) => ({ ...prev, [field]: value }));
  };

  return (
    <>
      <PageMeta
        title="Stock History | Report"
        description="View stock transaction history"
      />

      <div className="mx-auto max-w-7xl mt-6">
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
            Stock History
          </h1>
          <p className="mt-1 text-sm text-gray-600 dark:text-gray-400">
            Track all inventory transactions
          </p>
        </div>

        {/* Filter Section */}
        <div className="mb-4 p-4 bg-white dark:bg-gray-800 rounded-lg shadow">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 items-end">
            {/* From Date */}
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                From Date
              </label>
              <input
                type="date"
                value={filters.fromDate}
                onChange={(e) => handleFilterChange("fromDate", e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md 
                   bg-white dark:bg-gray-700 text-gray-900 dark:text-white 
                   focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            {/* To Date */}
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                To Date
              </label>
              <input
                type="date"
                value={filters.toDate}
                onChange={(e) => handleFilterChange("toDate", e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md 
                   bg-white dark:bg-gray-700 text-gray-900 dark:text-white 
                   focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            {/* Transaction Type */}
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Transaction Type
              </label>
              <select
                value={filters.transactionType}
                onChange={(e) =>
                  handleFilterChange("transactionType", e.target.value)
                }
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md 
                   bg-white dark:bg-gray-700 text-gray-900 dark:text-white 
                   focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="">All Transactions</option>
                <option value="IMPORT">Import</option>
                <option value="EXPORT">Export</option>
                <option value="DAMAGED">Damaged</option>
              </select>
            </div>

            {/* Actions */}
            <div className="flex space-x-2">
              <button
                onClick={() => setRefreshKey((prev) => prev + 1)}
                className="flex-1 bg-blue-600 text-white px-4 py-2 rounded-md 
                   hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                Filter
              </button>

              <button
                onClick={() => {
                  setFilters({ fromDate: "", toDate: "", transactionType: "" });
                  setRefreshKey((prev) => prev + 1);
                }}
                className="flex-1 bg-gray-300 dark:bg-gray-600 text-gray-800 dark:text-gray-200 
                   px-4 py-2 rounded-md hover:bg-gray-400 dark:hover:bg-gray-500"
              >
                Clear
              </button>
            </div>
          </div>
        </div>

        <StockHistoryTable
          key={refreshKey}
          fetchStockHistory={fetchStockHistory}
          itemsPerPage={10}
        />
      </div>
    </>
  );
}

export default function StockHistoryReport() {
  return (
    <ToastProvider>
      <StockHistoryContent />
    </ToastProvider>
  );
}
