// pages/reports/WarehouseStatisticsReport.tsx
import { useState, useCallback, useEffect } from "react";
import PageMeta from "../../components/common/PageMeta";
import reportStatisticService from "../../services/reportStatisticService";
import {
  WarehouseStatistic,
  ProductStockDTO,
  WarehouseStatisticRequestDTO,
} from "../../types/reportStatistic";
import { useToast } from "../../components/ui/toast/ToastProvider";
import { ToastProvider } from "../../components/ui/toast/ToastProvider";

type TabType = "overview" | "products";

interface FilterState {
  warehouseId?: number;
  fromDate?: string;
  toDate?: string;
}

function WarehouseStatisticsContent() {
  const [activeTab, setActiveTab] = useState<TabType>("overview");
  const [warehouses, setWarehouses] = useState<WarehouseStatistic[]>([]);
  const [products, setProducts] = useState<ProductStockDTO[]>([]);
  const [filters, setFilters] = useState<FilterState>({});
  const [isLoadingWarehouses, setIsLoadingWarehouses] = useState(false);
  const [isLoadingProducts, setIsLoadingProducts] = useState(false);
  const { addToast } = useToast();

  // Fetch warehouse statistics
  const fetchWarehouses = useCallback(async () => {
    setIsLoadingWarehouses(true);
    try {
      const params: WarehouseStatisticRequestDTO = {
        fromDate: filters.fromDate,
        toDate: filters.toDate,
      };

      const response = await reportStatisticService.getWarehouseStatistics(params);
      setWarehouses(response.data);
    } catch (error: any) {
      console.error("Fetch warehouses error:", error);
      addToast({
        type: "error",
        message: error.response?.data?.message || "Failed to fetch warehouse statistics",
      });
    } finally {
      setIsLoadingWarehouses(false);
    }
  }, [filters.fromDate, filters.toDate, addToast]);

  // Fetch product stock details
  const fetchProducts = useCallback(async () => {
    setIsLoadingProducts(true);
    try {
      const params: WarehouseStatisticRequestDTO = {
        warehouseId: filters.warehouseId,
        fromDate: filters.fromDate,
        toDate: filters.toDate,
      };

      const response = await reportStatisticService.getProductStockDetail(params);
      setProducts(response.data);
    } catch (error: any) {
      console.error("Fetch products error:", error);
      addToast({
        type: "error",
        message: error.response?.data?.message || "Failed to fetch product stock details",
      });
    } finally {
      setIsLoadingProducts(false);
    }
  }, [filters.warehouseId, filters.fromDate, filters.toDate, addToast]);

  // Initial load
  useEffect(() => {
    fetchWarehouses();
  }, [fetchWarehouses]);

  // Load products when switching to products tab
  useEffect(() => {
    if (activeTab === "products") {
      fetchProducts();
    }
  }, [activeTab, fetchProducts]);

  const handleFilterChange = (key: keyof FilterState, value: any) => {
    setFilters((prev) => ({ ...prev, [key]: value }));
  };

  const handleClearFilters = () => {
    setFilters({});
  };

  const handleViewProducts = (warehouseId: number) => {
    setFilters((prev) => ({ ...prev, warehouseId }));
    setActiveTab("products");
  };

  // Calculate totals for product summary
  const productTotals = products.reduce(
  (acc, item) => ({
    totalImport: acc.totalImport + item.quantityImport,
    totalExport: acc.totalExport + item.quantityExport,
    totalStock: acc.totalStock + item.currentStock,
  }),
  {
    totalImport: 0,
    totalExport: 0,
    totalStock: 0,
  }
);

  const getStockStatus = (stock: number) => {
    if (stock === 0)
      return {
        label: "Out of Stock",
        className: "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400",
      };
    if (stock < 20)
      return {
        label: "Low Stock",
        className: "bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400",
      };
    return {
      label: "In Stock",
      className: "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400",
    };
  };

  return (
    <>
      <PageMeta
        title="Warehouse Statistics | Report"
        description="View warehouse inventory statistics and product details"
      />

      <div className="mx-auto max-w-7xl mt-6">
        {/* Header */}
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
            Warehouse Statistics & Inventory
          </h1>
          <p className="mt-1 text-sm text-gray-600 dark:text-gray-400">
            Comprehensive view of warehouse operations and product inventory
          </p>
        </div>

        {/* Date Range Filters */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-4 mb-6">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 items-end">
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
                onClick={() => {
                  fetchWarehouses();
                  if (activeTab === "products") fetchProducts();
                }}
                disabled={isLoadingWarehouses || isLoadingProducts}
                className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50"
              >
                Apply
              </button>
              <button
                onClick={handleClearFilters}
                className="px-4 py-2 bg-gray-200 dark:bg-gray-700 text-gray-900 dark:text-white rounded-md hover:bg-gray-300 dark:hover:bg-gray-600"
              >
                Clear
              </button>
            </div>
          </div>
        </div>

        {/* Tabs */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow">
          <div className="border-b border-gray-200 dark:border-gray-700">
            <nav className="flex -mb-px">
              <button
                onClick={() => setActiveTab("overview")}
                className={`px-6 py-4 border-b-2 font-medium text-sm transition-colors ${
                  activeTab === "overview"
                    ? "border-blue-600 text-blue-600 dark:border-blue-500 dark:text-blue-500"
                    : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300 dark:text-gray-400 dark:hover:text-gray-300"
                }`}
              >
                📊 Warehouse Overview
              </button>
              <button
                onClick={() => setActiveTab("products")}
                className={`px-6 py-4 border-b-2 font-medium text-sm transition-colors ${
                  activeTab === "products"
                    ? "border-blue-600 text-blue-600 dark:border-blue-500 dark:text-blue-500"
                    : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300 dark:text-gray-400 dark:hover:text-gray-300"
                }`}
              >
                📦 Product Details
              </button>
            </nav>
          </div>

          <div className="p-6">
            {/* OVERVIEW TAB */}
          {/* OVERVIEW TAB */}
{activeTab === "overview" && (
  <div>
    <div className="mb-4">
      <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
        Warehouse Overview
      </h2>
      <p className="text-sm text-gray-500 dark:text-gray-400">
        Click "View Products" to see detailed inventory for each warehouse
      </p>
    </div>

    <div className="overflow-x-auto">
      <table className="w-full text-sm">
        <thead>
          <tr className="border-b-2 border-gray-200 dark:border-gray-700">
            <th className="px-4 py-3 text-left font-semibold text-gray-700 dark:text-gray-300">
              Warehouse
            </th>
            <th className="px-4 py-3 text-left font-semibold text-gray-700 dark:text-gray-300">
              Location
            </th>
            <th className="px-4 py-3 text-right font-semibold text-gray-700 dark:text-gray-300">
              Total Import
            </th>
            <th className="px-4 py-3 text-right font-semibold text-gray-700 dark:text-gray-300">
              Total Export
            </th>
            <th className="px-4 py-3 text-right font-semibold text-gray-700 dark:text-gray-300">
              Current Stock
            </th>
            <th className="px-4 py-3 text-center font-semibold text-gray-700 dark:text-gray-300">
              Action
            </th>
          </tr>
        </thead>
        <tbody>
          {isLoadingWarehouses ? (
            <tr>
              <td colSpan={6} className="px-4 py-8 text-center text-gray-500">
                Loading...
              </td>
            </tr>
          ) : warehouses.length === 0 ? (
            <tr>
              <td colSpan={6} className="px-4 py-8 text-center text-gray-500">
                No data available
              </td>
            </tr>
          ) : (
            warehouses.map((warehouse) => (
              <tr
                key={warehouse.warehouseId}
                className="border-b border-gray-100 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700/50"
              >
                <td className="px-4 py-4 font-medium text-gray-900 dark:text-gray-100">
                  {warehouse.warehouseName}
                </td>
                <td className="px-4 py-4 text-gray-600 dark:text-gray-400">
                  {warehouse.location}
                </td>
                <td className="px-4 py-4 text-right text-green-600 dark:text-green-400 font-medium">
                  {warehouse.totalImport.toLocaleString()}
                </td>
                <td className="px-4 py-4 text-right text-blue-600 dark:text-blue-400 font-medium">
                  {warehouse.totalExport.toLocaleString()}
                </td>
                <td className="px-4 py-4 text-right text-gray-900 dark:text-gray-100 font-bold">
                  {warehouse.currentStock.toLocaleString()}
                </td>
                <td className="px-4 py-4 text-center">
                  <button
                    onClick={() => handleViewProducts(warehouse.warehouseId)}
                    className="px-3 py-1.5 bg-blue-600 text-white text-sm rounded hover:bg-blue-700 transition-colors"
                  >
                    View Products
                  </button>
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  </div>
)}

{/* PRODUCTS TAB */}
{activeTab === "products" && (
  <div>
    {/* Filter by Warehouse */}
    <div className="mb-6 flex items-center justify-between">
      <div className="flex items-center gap-4">
        <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
          Product Inventory
        </h2>
        <select
          value={filters.warehouseId || ""}
          onChange={(e) =>
            handleFilterChange(
              "warehouseId",
              e.target.value ? Number(e.target.value) : undefined
            )
          }
          className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          <option value="">All Warehouses</option>
          {warehouses.map((w) => (
            <option key={w.warehouseId} value={w.warehouseId}>
              {w.warehouseName}
            </option>
          ))}
        </select>
      </div>
      {filters.warehouseId && (
        <button
          onClick={() => handleFilterChange("warehouseId", undefined)}
          className="px-4 py-2 text-sm text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-200"
        >
          Clear Filter
        </button>
      )}
    </div>

   <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mb-6">
  <div className="bg-gradient-to-br from-green-50 to-green-100 dark:from-green-900/20 dark:to-green-800/20 rounded-lg p-4 border border-green-200 dark:border-green-800">
    <div className="text-sm text-green-700 dark:text-green-400 font-medium">
      Total Import
    </div>
    <div className="text-2xl font-bold text-green-900 dark:text-green-300 mt-1">
      {productTotals.totalImport.toLocaleString()}
    </div>
  </div>
  <div className="bg-gradient-to-br from-blue-50 to-blue-100 dark:from-blue-900/20 dark:to-blue-800/20 rounded-lg p-4 border border-blue-200 dark:border-blue-800">
    <div className="text-sm text-blue-700 dark:text-blue-400 font-medium">
      Total Export
    </div>
    <div className="text-2xl font-bold text-blue-900 dark:text-blue-300 mt-1">
      {productTotals.totalExport.toLocaleString()}
    </div>
  </div>
  <div className="bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-800 dark:to-gray-700 rounded-lg p-4 border border-gray-200 dark:border-gray-600">
    <div className="text-sm text-gray-700 dark:text-gray-300 font-medium">
      Current Stock
    </div>
    <div className="text-2xl font-bold text-gray-900 dark:text-gray-100 mt-1">
      {productTotals.totalStock.toLocaleString()}
    </div>
  </div>
</div>
   <div className="overflow-x-auto">
  <table className="w-full text-sm">
    <thead>
      <tr className="border-b-2 border-gray-200 dark:border-gray-700">
        <th className="px-4 py-3 text-left font-semibold text-gray-700 dark:text-gray-300">
          Product ID
        </th>
        <th className="px-4 py-3 text-left font-semibold text-gray-700 dark:text-gray-300">
          Product
        </th>
        <th className="px-4 py-3 text-left font-semibold text-gray-700 dark:text-gray-300">
          Warehouse
        </th>
        <th className="px-4 py-3 text-right font-semibold text-gray-700 dark:text-gray-300">
          Import
        </th>
        <th className="px-4 py-3 text-right font-semibold text-gray-700 dark:text-gray-300">
          Export
        </th>
        <th className="px-4 py-3 text-right font-semibold text-gray-700 dark:text-gray-300">
          Stock
        </th>
        <th className="px-4 py-3 text-center font-semibold text-gray-700 dark:text-gray-300">
          Status
        </th>
      </tr>
    </thead>
    <tbody>
      {isLoadingProducts ? (
        <tr>
          <td colSpan={7} className="px-4 py-8 text-center text-gray-500">
            Loading...
          </td>
        </tr>
      ) : products.length === 0 ? (
        <tr>
          <td colSpan={7} className="px-4 py-8 text-center text-gray-500">
            No products found
          </td>
        </tr>
      ) : (
        products.map((product, index) => {
          const status = getStockStatus(product.currentStock);
          return (
            <tr
              key={`${product.productId}-${product.warehouseId}-${index}`}
              className="border-b border-gray-100 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700/50"
            >
              <td className="px-4 py-4 text-sm text-gray-600 dark:text-gray-400">
                #{product.productId}
              </td>
              <td className="px-4 py-4 font-medium text-gray-900 dark:text-gray-100">
                {product.productName}
              </td>
              <td className="px-4 py-4 text-gray-600 dark:text-gray-400">
                {product.warehouseName}
              </td>
              <td className="px-4 py-4 text-right text-green-600 dark:text-green-400">
                {product.quantityImport.toLocaleString()}
              </td>
              <td className="px-4 py-4 text-right text-blue-600 dark:text-blue-400">
                {product.quantityExport.toLocaleString()}
              </td>
              <td className="px-4 py-4 text-right font-bold text-gray-900 dark:text-gray-100">
                {product.currentStock.toLocaleString()}
              </td>
              <td className="px-4 py-4 text-center">
                <span
                  className={`inline-block px-3 py-1 rounded-full text-xs font-medium ${status.className}`}
                >
                  {status.label}
                </span>
              </td>
            </tr>
          );
        })
      )}
    </tbody>
  </table>
</div>
  </div>
)}
          </div>
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