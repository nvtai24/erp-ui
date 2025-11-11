import { useState, useEffect } from "react";
import Chart from "react-apexcharts";
import { ApexOptions } from "apexcharts";
import reportStatisticService from "../../services/reportStatisticService";
import { WarehouseStatistic } from "../../types/reportStatistic";

export default function DashboardCharts() {
  const [warehouseData, setWarehouseData] = useState<WarehouseStatistic[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchChartsData = async () => {
      try {
        setIsLoading(true);

        const warehouseRes =
          await reportStatisticService.getWarehouseStatistics({});
        if (warehouseRes.success) {
          setWarehouseData(warehouseRes.data || []);
        }
      } catch (error) {
        console.error("Fetch charts data error:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchChartsData();
  }, []);

  // Warehouse Stock Overview Chart
  const stockOverviewOptions: ApexOptions = {
    colors: ["#3B82F6", "#10B981", "#F59E0B"],
    chart: {
      fontFamily: "Outfit, sans-serif",
      type: "bar",
      height: 350,
      toolbar: { show: false },
      stacked: false,
    },
    plotOptions: {
      bar: {
        horizontal: false,
        columnWidth: "60%",
        borderRadius: 8,
        borderRadiusApplication: "end",
      },
    },
    dataLabels: {
      enabled: false,
    },
    stroke: {
      show: true,
      width: 2,
      colors: ["transparent"],
    },
    xaxis: {
      categories: warehouseData.map((w) => w.warehouseName),
      axisBorder: { show: false },
      axisTicks: { show: false },
      labels: {
        style: {
          colors: "#6B7280",
          fontSize: "12px",
        },
      },
    },
    yaxis: {
      title: {
        text: "Quantity",
        style: {
          color: "#6B7280",
          fontSize: "12px",
        },
      },
      labels: {
        style: {
          colors: "#6B7280",
        },
      },
    },
    fill: { opacity: 1 },
    tooltip: {
      y: {
        formatter: (val: number) => `${val.toLocaleString()} units`,
      },
      theme: "light",
    },
    legend: {
      position: "top",
      horizontalAlign: "right",
      markers: {
        size: 12,
        strokeWidth: 0,
      },
    },
    grid: {
      borderColor: "#E5E7EB",
      strokeDashArray: 4,
    },
  };

  const stockOverviewSeries = [
    {
      name: "Total Import",
      data: warehouseData.map((w) => w.totalImport),
    },
    {
      name: "Total Export",
      data: warehouseData.map((w) => w.totalExport),
    },
    {
      name: "Damaged Items",
      data: warehouseData.map((w) => w.damagedItems),
    },
  ];

  // Current Stock Levels Chart
  const currentStockOptions: ApexOptions = {
    colors: ["#8B5CF6"],
    chart: {
      fontFamily: "Outfit, sans-serif",
      type: "bar",
      height: 350,
      toolbar: { show: false },
    },
    plotOptions: {
      bar: {
        horizontal: true,
        borderRadius: 8,
        dataLabels: {
          position: "top",
        },
      },
    },
    dataLabels: {
      enabled: true,
      formatter: (val: number) => val.toLocaleString(),
      offsetX: 30,
      style: {
        fontSize: "12px",
        colors: ["#6B7280"],
      },
    },
    xaxis: {
      categories: warehouseData.map((w) => w.warehouseName),
      labels: {
        style: {
          colors: "#6B7280",
        },
      },
    },
    yaxis: {
      labels: {
        style: {
          colors: "#6B7280",
          fontSize: "12px",
        },
      },
    },
    fill: {
      opacity: 1,
      type: "gradient",
      gradient: {
        shade: "light",
        type: "horizontal",
        shadeIntensity: 0.5,
        opacityFrom: 0.85,
        opacityTo: 0.95,
      },
    },
    tooltip: {
      x: { show: true },
      y: {
        formatter: (val: number) => `${val.toLocaleString()} units in stock`,
      },
      theme: "light",
    },
    grid: {
      borderColor: "#E5E7EB",
      strokeDashArray: 4,
    },
  };

  const currentStockSeries = [
    {
      name: "Current Stock",
      data: warehouseData.map((w) => w.currentStock),
    },
  ];

  if (isLoading) {
    return (
      <div className="rounded-2xl border border-gray-200 bg-white p-6 dark:border-gray-800 dark:bg-white/[0.03] text-center py-12">
        <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
        <p className="mt-4 text-gray-600 dark:text-gray-400">
          Loading warehouse data...
        </p>
      </div>
    );
  }

  if (warehouseData.length === 0) {
    return (
      <div className="rounded-2xl border border-gray-200 bg-white p-6 dark:border-gray-800 dark:bg-white/[0.03] text-center py-12">
        <p className="text-gray-500 dark:text-gray-400">
          No warehouse data available
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Warehouse Operations Chart */}
      <div className="rounded-2xl border border-gray-200 bg-white p-6 dark:border-gray-800 dark:bg-white/[0.03] shadow-sm">
        <div className="mb-6">
          <h3 className="text-lg font-semibold text-gray-800 dark:text-white/90">
            Warehouse Operations Overview
          </h3>
          <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
            Import, Export, and Damaged items across all warehouses
          </p>
        </div>
        <div className="max-w-full overflow-x-auto custom-scrollbar">
          <div className="min-w-[650px] xl:min-w-full">
            <Chart
              options={stockOverviewOptions}
              series={stockOverviewSeries}
              type="bar"
              height={350}
            />
          </div>
        </div>
      </div>

      {/* Current Stock Levels Chart */}
      <div className="rounded-2xl border border-gray-200 bg-white p-6 dark:border-gray-800 dark:bg-white/[0.03] shadow-sm">
        <div className="mb-6">
          <h3 className="text-lg font-semibold text-gray-800 dark:text-white/90">
            Current Stock Levels by Warehouse
          </h3>
          <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
            Available inventory across all warehouse locations
          </p>
        </div>
        <div className="max-w-full overflow-x-auto custom-scrollbar">
          <div className="min-w-[650px] xl:min-w-full">
            <Chart
              options={currentStockOptions}
              series={currentStockSeries}
              type="bar"
              height={350}
            />
          </div>
        </div>
      </div>

      {/* Warehouse Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="rounded-xl border border-gray-200 bg-gradient-to-br from-blue-50 to-blue-100 dark:from-blue-900/20 dark:to-blue-800/20 p-5 dark:border-gray-800">
          <div className="flex items-center gap-3 mb-2">
            <div className="w-10 h-10 rounded-lg bg-blue-500 flex items-center justify-center">
              <svg
                className="w-5 h-5 text-white"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M7 16V4m0 0L3 8m4-4l4 4m6 0v12m0 0l4-4m-4 4l-4-4"
                />
              </svg>
            </div>
            <p className="text-sm font-medium text-gray-600 dark:text-gray-400">
              Total Import
            </p>
          </div>
          <p className="text-2xl font-bold text-gray-800 dark:text-white">
            {warehouseData
              .reduce((sum, w) => sum + w.totalImport, 0)
              .toLocaleString()}
          </p>
          <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
            units received
          </p>
        </div>

        <div className="rounded-xl border border-gray-200 bg-gradient-to-br from-green-50 to-green-100 dark:from-green-900/20 dark:to-green-800/20 p-5 dark:border-gray-800">
          <div className="flex items-center gap-3 mb-2">
            <div className="w-10 h-10 rounded-lg bg-green-500 flex items-center justify-center">
              <svg
                className="w-5 h-5 text-white"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9 5l7 7-7 7"
                />
              </svg>
            </div>
            <p className="text-sm font-medium text-gray-600 dark:text-gray-400">
              Total Export
            </p>
          </div>
          <p className="text-2xl font-bold text-gray-800 dark:text-white">
            {warehouseData
              .reduce((sum, w) => sum + w.totalExport, 0)
              .toLocaleString()}
          </p>
          <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
            units shipped
          </p>
        </div>

        <div className="rounded-xl border border-gray-200 bg-gradient-to-br from-purple-50 to-purple-100 dark:from-purple-900/20 dark:to-purple-800/20 p-5 dark:border-gray-800">
          <div className="flex items-center gap-3 mb-2">
            <div className="w-10 h-10 rounded-lg bg-purple-500 flex items-center justify-center">
              <svg
                className="w-5 h-5 text-white"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4"
                />
              </svg>
            </div>
            <p className="text-sm font-medium text-gray-600 dark:text-gray-400">
              Current Stock
            </p>
          </div>
          <p className="text-2xl font-bold text-gray-800 dark:text-white">
            {warehouseData
              .reduce((sum, w) => sum + w.currentStock, 0)
              .toLocaleString()}
          </p>
          <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
            units available
          </p>
        </div>
      </div>
    </div>
  );
}
