// pages/reports/CustomerOrdersReport.tsx
import { useState, useCallback, useEffect } from "react";
import PageMeta from "../../components/common/PageMeta";
import reportStatisticService from "../../services/reportStatisticService";
import { CustomerOrder, CustomerOrderRequestDTO } from "../../types/reportStatistic";
import { useToast } from "../../components/ui/toast/ToastProvider";
import CustomerOrdersTable from "../../components/reports/CustomerOrdersList";
import { ToastProvider } from "../../components/ui/toast/ToastProvider";

interface TableData {
  data: CustomerOrder[];
  totalItems: number;
}

interface FilterState {
  status?: string;
  fromDate?: string;
  toDate?: string;
}

function CustomerOrdersContent() {
  const [tableData, setTableData] = useState<TableData>({ data: [], totalItems: 0 });
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [isLoading, setIsLoading] = useState(false);
  const [filters, setFilters] = useState<FilterState>({});
  const { addToast } = useToast();

  const fetchOrders = useCallback(async () => {
    setIsLoading(true);
    try {
      const params: CustomerOrderRequestDTO = {
        pageNumber: currentPage,
        pageSize: pageSize,
        status: filters.status || undefined,
        fromDate: filters.fromDate || undefined,
        toDate: filters.toDate || undefined,
      };

      const response = await reportStatisticService.getCustomerOrders(params);

      if (response.success && response.data) {
        setTableData({
          data: Array.isArray(response.data) ? response.data : [],
          totalItems: response.metaData?.totalItems || 0,
        });
      } else {
        addToast({
          type: "error",
          message: response.message || "Failed to fetch orders",
        });
      }
    } catch (error: any) {
      console.error("Fetch orders error:", error);
      addToast({
        type: "error",
        message: error.response?.data?.message || "Failed to fetch orders",
      });
    } finally {
      setIsLoading(false);
    }
  }, [currentPage, pageSize, filters, addToast]);

  useEffect(() => {
    fetchOrders();
  }, [fetchOrders]);

  const handlePageChange = (newPage: number) => {
    setCurrentPage(newPage);
  };

  const handleFilterChange = (key: keyof FilterState, value: string) => {
    setFilters((prev) => ({
      ...prev,
      [key]: value || undefined,
    }));
    setCurrentPage(1); // Reset to first page when filter changes
  };

  const handleClearFilters = () => {
    setFilters({});
    setCurrentPage(1);
  };

  return (
    <>
      <PageMeta
        title="Customer Orders | Report"
        description="View customer order reports"
      />

      <div className="mx-auto max-w-7xl mt-6">
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
            Customer Orders
          </h1>
          <p className="mt-1 text-sm text-gray-600 dark:text-gray-400">
            Overview of all customer orders and their status
          </p>
        </div>

        {/* Filters */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-4 mb-6">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 items-end">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Status
              </label>
              <select
                value={filters.status || ""}
                onChange={(e) => handleFilterChange("status", e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
              >
                <option value="">All Status</option>
                <option value="Pending">Pending</option>
                <option value="Confirmed">Confirmed</option>
                <option value="Shipped">Shipped</option>
                <option value="Delivered">Delivered</option>
                <option value="Cancelled">Cancelled</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                From Date
              </label>
              <input
                type="date"
                value={filters.fromDate || ""}
                onChange={(e) => handleFilterChange("fromDate", e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                To Date
              </label>
              <input
                type="date"
                value={filters.toDate || ""}
                onChange={(e) => handleFilterChange("toDate", e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
              />
            </div>
            <div className="flex gap-2">
              <button
                onClick={handleClearFilters}
                className="flex-1 px-4 py-2 bg-gray-200 dark:bg-gray-700 text-gray-900 dark:text-white rounded-md hover:bg-gray-300 dark:hover:bg-gray-600"
              >
                Clear
              </button>
            </div>
          </div>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-lg shadow">
          <CustomerOrdersTable
            data={tableData.data}
            totalItems={tableData.totalItems}
            currentPage={currentPage}
            pageSize={pageSize}
            isLoading={isLoading}
            onPageChange={handlePageChange}
          />
        </div>
      </div>
    </>
  );
}

export default function CustomerOrdersReport() {
  return (
    <ToastProvider>
      <CustomerOrdersContent />
    </ToastProvider>
  );
}