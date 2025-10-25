import { useState, useCallback } from "react";
import PageMeta from "../../components/common/PageMeta";
import reportStatisticService from "../../services/reportStatisticService";
import { StockHistory, StockHistoryRequestDTO } from "../../types/reportStatistic";
import { useToast } from "../../components/ui/toast/ToastProvider";
import StockHistoryTable from "../../components/reports/StockHistoryList";
import { ToastProvider } from "../../components/ui/toast/ToastProvider";

interface TableData {
  data: StockHistory[];
  totalItems: number;
}

function StockHistoryContent() {
  const [tableData, setTableData] = useState<TableData>({ data: [], totalItems: 0 });
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [isLoading, setIsLoading] = useState(false);
  const [filters, setFilters] = useState({
    startDate: "",
    endDate: "",
    transactionType: "",
  });
  const { addToast } = useToast();

  const fetchStockHistory = useCallback(async () => {
    setIsLoading(true);
    try {
      const params: StockHistoryRequestDTO = {
        startDate: filters.startDate || undefined,
        endDate: filters.endDate || undefined,
        transactionType: filters.transactionType || undefined,
        pageIndex: currentPage,
        pageSize: pageSize,
      };

      const response = await reportStatisticService.getStockHistory(params);

      if (response.success) {
        setTableData({
          data: response.data || [],
          totalItems: response.metaData?.totalItems || 0,
        });
      } else {
        addToast({
          type: "error",
          message: response.message || "Failed to fetch stock history",
        });
      }
    } catch (error: any) {
      console.error("Fetch stock history error:", error);
      addToast({
        type: "error",
        message: error.response?.data?.message || "Failed to fetch stock history",
      });
    } finally {
      setIsLoading(false);
    }
  }, [currentPage, pageSize, filters, addToast]);

  const handleFilterChange = (field: string, value: string) => {
    setFilters((prev) => ({ ...prev, [field]: value }));
    setCurrentPage(1);
  };

  const handlePageChange = (newPage: number) => {
    setCurrentPage(newPage);
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

        <div className="mb-4 p-4 bg-white dark:bg-gray-800 rounded-lg shadow space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <input
              type="date"
              value={filters.startDate}
              onChange={(e) => handleFilterChange("startDate", e.target.value)}
              className="px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
              placeholder="Start Date"
            />
            <input
              type="date"
              value={filters.endDate}
              onChange={(e) => handleFilterChange("endDate", e.target.value)}
              className="px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
              placeholder="End Date"
            />
            <select
              value={filters.transactionType}
              onChange={(e) => handleFilterChange("transactionType", e.target.value)}
              className="px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
            >
              <option value="">All Transactions</option>
              <option value="IN">In</option>
              <option value="OUT">Out</option>
            </select>
            <button
              onClick={fetchStockHistory}
              disabled={isLoading}
              className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50"
            >
              {isLoading ? "Loading..." : "Search"}
            </button>
          </div>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-lg shadow">
          <StockHistoryTable data={tableData.data} isLoading={isLoading} />
        </div>
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