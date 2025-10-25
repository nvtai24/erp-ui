// pages/reports/ProductStockDetailReport.tsx
import { useState, useCallback, useEffect } from "react";
import PageMeta from "../../components/common/PageMeta";
import reportStatisticService from "../../services/reportStatisticService";
import { ProductStockDetail, WarehouseStatisticRequestDTO } from "../../types/reportStatistic";
import { useToast } from "../../components/ui/toast/ToastProvider";
import { ToastProvider } from "../../components/ui/toast/ToastProvider";
import ProductStockDetailTable from "../../components/reports/ProductStockDetailList";

interface TableData {
  data: ProductStockDetail[];
  totalItems: number;
}

function ProductStockDetailContent() {
  const [tableData, setTableData] = useState<TableData>({ data: [], totalItems: 0 });
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [isLoading, setIsLoading] = useState(false);
  const { addToast } = useToast();

  const fetchProductStockDetail = useCallback(async () => {
    setIsLoading(true);
    try {
      const params: WarehouseStatisticRequestDTO = {
        pageIndex: currentPage,
        pageSize: pageSize,
      };

      const response = await reportStatisticService.getProductStockDetail(params);

      if (response.success) {
        setTableData({
          data: response.data || [],
          totalItems: response.metaData?.totalItems || 0,
        });
      } else {
        addToast({
          type: "error",
          message: response.message || "Failed to fetch product stock details",
        });
      }
    } catch (error: any) {
      console.error("Fetch product stock detail error:", error);
      addToast({
        type: "error",
        message: error.response?.data?.message || "Failed to fetch product stock details",
      });
    } finally {
      setIsLoading(false);
    }
  }, [currentPage, pageSize, addToast]);

  useEffect(() => {
    fetchProductStockDetail();
  }, [fetchProductStockDetail]);

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
        title="Product Stock Details | Report"
        description="View detailed product stock information"
      />

      <div className="mx-auto max-w-7xl mt-6">
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
            Product Stock Details
          </h1>
          <p className="mt-1 text-sm text-gray-600 dark:text-gray-400">
            Detailed inventory breakdown by product and warehouse
          </p>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-lg shadow">
          <ProductStockDetailTable
            data={tableData.data}
            totalItems={tableData.totalItems}
            currentPage={currentPage}
            pageSize={pageSize}
            isLoading={isLoading}
            onPageChange={handlePageChange}
            onPageSizeChange={handlePageSizeChange}
            onRefresh={fetchProductStockDetail}
          />
        </div>
      </div>
    </>
  );
}

// Wrap với ToastProvider
export default function ProductStockDetailReport() {
  return (
    <ToastProvider>
      <ProductStockDetailContent />
    </ToastProvider>
  );
}