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

function CustomerOrdersContent() {
  const [tableData, setTableData] = useState<TableData>({ data: [], totalItems: 0 });
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [isLoading, setIsLoading] = useState(false);
  const { addToast } = useToast();

  const fetchOrders = useCallback(async () => {
    setIsLoading(true);
    try {
      const params: CustomerOrderRequestDTO = {
        pageIndex: currentPage,
        pageSize: pageSize,
      };

      const response = await reportStatisticService.getCustomerOrders(params);

      if (response.success) {
        setTableData({
          data: response.data || [],
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
  }, [currentPage, pageSize, addToast]);

  useEffect(() => {
    fetchOrders();
  }, [fetchOrders]);

  const handlePageChange = (newPage: number) => {
    setCurrentPage(newPage);
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

// Wrap với ToastProvider ở đây
export default function CustomerOrdersReport() {
  return (
    <ToastProvider>
      <CustomerOrdersContent />
    </ToastProvider>
  );
}