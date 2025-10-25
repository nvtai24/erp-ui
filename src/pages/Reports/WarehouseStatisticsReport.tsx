// pages/reports/WarehouseStatisticsReport.tsx
import { useState, useCallback } from "react";
import PageMeta from "../../components/common/PageMeta";
import reportStatisticService from "../../services/reportStatisticService";
import { WarehouseStatistic, WarehouseStatisticRequestDTO } from "../../types/reportStatistic";
import { useToast } from "../../components/ui/toast/ToastProvider";
import WarehouseStatisticsTable from "../../components/reports/WarehouseStatisticsList";
import { ToastProvider } from "../../components/ui/toast/ToastProvider";

interface TableData {
  data: WarehouseStatistic[];
  totalItems: number;
}

function WarehouseStatisticsContent() {
  const [tableData, setTableData] = useState<TableData>({ data: [], totalItems: 0 });
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [isLoading, setIsLoading] = useState(false);
  const { addToast } = useToast();

  const fetchStatistics = useCallback(async () => {
    setIsLoading(true);
    try {
      const params: WarehouseStatisticRequestDTO = {
        pageIndex: currentPage,
        pageSize: pageSize,
      };

      const response = await reportStatisticService.getWarehouseStatistics(params);

      if (response.success) {
        setTableData({
          data: response.data || [],
          totalItems: response.metaData?.totalItems || 0,
        });
      } else {
        addToast({
          type: "error",
          message: response.message || "Failed to fetch warehouse statistics",
        });
      }
    } catch (error: any) {
      console.error("Fetch statistics error:", error);
      addToast({
        type: "error",
        message: error.response?.data?.message || "Failed to fetch warehouse statistics",
      });
    } finally {
      setIsLoading(false);
    }
  }, [currentPage, pageSize, addToast]);

  const handlePageChange = (newPage: number) => {
    setCurrentPage(newPage);
  };

  const handlePageSizeChange = (newSize: number) => {
    setPageSize(newSize);
    setCurrentPage(1);
  };

  return (
    <>
      <PageMeta
        title="Warehouse Statistics | Report"
        description="View warehouse inventory statistics"
      />

      <div className="mx-auto max-w-7xl mt-6">
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
            Warehouse Statistics
          </h1>
          <p className="mt-1 text-sm text-gray-600 dark:text-gray-400">
            Overview of inventory levels and values across all warehouses
          </p>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-lg shadow">
          <WarehouseStatisticsTable
            data={tableData.data}
            totalItems={tableData.totalItems}
            currentPage={currentPage}
            pageSize={pageSize}
            isLoading={isLoading}
            onPageChange={handlePageChange}
            onPageSizeChange={handlePageSizeChange}
            onRefresh={fetchStatistics}
          />
        </div>
      </div>
    </>
  );
}

export default function WarehouseStatisticsReport() {
  return (
    <ToastProvider>
      <WarehouseStatisticsContent />
    </ToastProvider>
  );
}