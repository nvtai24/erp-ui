import { useState, useEffect } from "react";
import Chart from "react-apexcharts";
import { ApexOptions } from "apexcharts";
import reportStatisticService from "../../services/reportStatisticService";
import { WarehouseStatistic, ProductStockDTO } from "../../types/reportStatistic";

export default function DashboardCharts() {
  const [warehouseData, setWarehouseData] = useState<WarehouseStatistic[]>([]);
  const [productData, setProductData] = useState<ProductStockDTO[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchChartsData = async () => {
      try {
        setIsLoading(true);
        
        // Fetch warehouse statistics
        const warehouseRes = await reportStatisticService.getWarehouseStatistics({});
        if (warehouseRes.success) {
          setWarehouseData(warehouseRes.data || []);
        }

        // Fetch product stock details
        const productRes = await reportStatisticService.getProductStockDetail({});
        if (productRes.success) {
          setProductData(productRes.data || []);
        }
      } catch (error) {
        console.error("Fetch charts data error:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchChartsData();
  }, []);

  // Warehouse Stock Chart Options
  const warehouseChartOptions: ApexOptions = {
    colors: ["#465FFF", "#9CB9FF", "#D0D5DD"],
    chart: {
      fontFamily: "Outfit, sans-serif",
      type: "bar",
      height: 300,
      toolbar: { show: false },
    },
    plotOptions: {
      bar: {
        horizontal: false,
        columnWidth: "55%",
        borderRadius: 5,
      },
    },
    dataLabels: { enabled: false },
    stroke: { show: true, width: 2, colors: ["transparent"] },
    xaxis: {
      categories: warehouseData.map((w) => w.warehouseName),
      axisBorder: { show: false },
      axisTicks: { show: false },
    },
    yaxis: { title: { text: "Units" } },
    fill: { opacity: 1 },
    tooltip: { y: { formatter: (val: number) => `${val} units` } },
    legend: { position: "top", horizontalAlign: "left" },
  };

  const warehouseChartSeries = [
    {
      name: "Import",
      data: warehouseData.map((w) => w.totalImport),
    },
    {
      name: "Export",
      data: warehouseData.map((w) => w.totalExport),
    },
    {
      name: "Damaged",
      data: warehouseData.map((w) => w.damagedItems),
    },
  ];

  // Product Stock Distribution Chart
  const topProducts = productData.slice(0, 5);
  const stockChartOptions: ApexOptions = {
    colors: ["#465FFF"],
    chart: {
      fontFamily: "Outfit, sans-serif",
      type: "bar",
      height: 300,
      toolbar: { show: false },
    },
    plotOptions: {
      bar: {
        horizontal: true,
        columnWidth: "55%",
        borderRadius: 5,
      },
    },
    dataLabels: { enabled: false },
    xaxis: {
      categories: topProducts.map((p) => p.productName.substring(0, 15)),
    },
    fill: { opacity: 1 },
    tooltip: { x: { show: true }, y: { formatter: (val: number) => `${val} units` } },
  };

  const stockChartSeries = [
    {
      name: "Current Stock",
      data: topProducts.map((p) => p.currentStock),
    },
  ];

  if (isLoading) {
    return (
      <div className="rounded-2xl border border-gray-200 bg-white p-6 dark:border-gray-800 dark:bg-white/[0.03] text-center py-12">
        <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
        <p className="mt-4 text-gray-600 dark:text-gray-400">Loading charts...</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Warehouse Statistics Chart */}
      {warehouseData.length > 0 && (
        <div className="rounded-2xl border border-gray-200 bg-white p-6 dark:border-gray-800 dark:bg-white/[0.03]">
          <div className="mb-6">
            <h3 className="text-lg font-semibold text-gray-800 dark:text-white/90">
              Warehouse Statistics
            </h3>
            <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
              Import, Export, and Damaged items by warehouse
            </p>
          </div>
          <div className="max-w-full overflow-x-auto custom-scrollbar">
            <div className="min-w-[650px] xl:min-w-full">
              <Chart
                options={warehouseChartOptions}
                series={warehouseChartSeries}
                type="bar"
                height={300}
              />
            </div>
          </div>
        </div>
      )}

      {/* Product Stock Distribution Chart */}
      {topProducts.length > 0 && (
        <div className="rounded-2xl border border-gray-200 bg-white p-6 dark:border-gray-800 dark:bg-white/[0.03]">
          <div className="mb-6">
            <h3 className="text-lg font-semibold text-gray-800 dark:text-white/90">
              Top 5 Products - Stock Level
            </h3>
            <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
              Current stock quantity for top products
            </p>
          </div>
          <div className="max-w-full overflow-x-auto custom-scrollbar">
            <div className="min-w-[650px] xl:min-w-full">
              <Chart
                options={stockChartOptions}
                series={stockChartSeries}
                type="bar"
                height={300}
              />
            </div>
          </div>
        </div>
      )}

      {/* Stock Summary Cards */}
      <div className="grid grid-cols-2 gap-4 md:grid-cols-3">
        <div className="rounded-lg border border-gray-200 bg-white p-4 dark:border-gray-800 dark:bg-white/[0.03]">
          <p className="text-xs text-gray-500 dark:text-gray-400">Total Warehouses</p>
          <p className="mt-2 text-2xl font-bold text-gray-800 dark:text-white">
            {warehouseData.length}
          </p>
        </div>
        <div className="rounded-lg border border-gray-200 bg-white p-4 dark:border-gray-800 dark:bg-white/[0.03]">
          <p className="text-xs text-gray-500 dark:text-gray-400">Total Stock Items</p>
          <p className="mt-2 text-2xl font-bold text-gray-800 dark:text-white">
            {productData.reduce((sum, p) => sum + p.currentStock, 0).toLocaleString()}
          </p>
        </div>
        <div className="rounded-lg border border-gray-200 bg-white p-4 dark:border-gray-800 dark:bg-white/[0.03]">
          <p className="text-xs text-gray-500 dark:text-gray-400">Total Products</p>
          <p className="mt-2 text-2xl font-bold text-gray-800 dark:text-white">
            {productData.length}
          </p>
        </div>
      </div>
    </div>
  );
}