import { useState, useEffect } from "react";
import PageMeta from "../../components/common/PageMeta";
import reportStatisticService from "../../services/reportStatisticService";
import { DashboardSummary } from "../../types/reportStatistic";
import DashboardMetrics from "../../components/dashboard/DashboardMetrics";
import DashboardCharts from "../../components/dashboard/DashboardCharts";
import RecentOrders from "../../components/ecommerce/RecentOrders";

export default function Home() {
  const [dashboardData, setDashboardData] = useState<DashboardSummary | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        setIsLoading(true);
        setError(null);

        const response = await reportStatisticService.getDashboardSummary();

        if (response.success && response.data) {
          setDashboardData(response.data);
        } else {
          setError(response.message || "Failed to fetch dashboard data");
        }
      } catch (err: any) {
        console.error("Fetch dashboard error:", err);
        setError(err.response?.data?.message || "Failed to load dashboard");
      } finally {
        setIsLoading(false);
      }
    };

    fetchDashboardData();
  }, []);

  return (
    <>
      <PageMeta
        title="Dashboard | ERP System"
        description="Overview of your business metrics and analytics"
      />

      <div className="px-4 py-6 md:px-6 md:py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
            Dashboard
          </h1>
          <p className="mt-2 text-gray-600 dark:text-gray-400">
            Welcome back! Here's what's happening with your business today.
          </p>
        </div>

        {/* Loading State */}
        {isLoading && (
          <div className="flex items-center justify-center py-12">
            <div className="text-center">
              <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
              <p className="mt-4 text-gray-600 dark:text-gray-400">Loading dashboard...</p>
            </div>
          </div>
        )}

        {/* Error State */}
        {error && !isLoading && (
          <div className="mb-6 rounded-lg bg-red-50 border border-red-200 p-4 dark:bg-red-900/20 dark:border-red-800">
            <p className="text-red-700 dark:text-red-400">{error}</p>
            <button
              onClick={() => window.location.reload()}
              className="mt-3 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700"
            >
              Retry
            </button>
          </div>
        )}

        {/* Content */}
        {!isLoading && dashboardData && (
          <div className="grid grid-cols-12 gap-4 md:gap-6">
            {/* Metrics Cards - Full Width */}
            <div className="col-span-12">
              <DashboardMetrics data={dashboardData} />
            </div>

            {/* Main Content - Charts */}
            <div className="col-span-12 lg:col-span-8">
              <DashboardCharts />
            </div>

            {/* Right Sidebar - Quick Stats */}
            <div className="col-span-12 lg:col-span-4 space-y-6">
              {/* Key Performance Indicators */}
              <div className="rounded-2xl border border-gray-200 bg-white p-6 dark:border-gray-800 dark:bg-white/[0.03]">
                <h3 className="mb-4 text-lg font-semibold text-gray-800 dark:text-white/90">
                  Performance Metrics
                </h3>
                <div className="space-y-4">
                  {/* Pending Orders */}
                  <div className="flex items-center justify-between pb-3 border-b border-gray-100 dark:border-gray-700">
                    <div>
                      <span className="text-sm text-gray-600 dark:text-gray-400">
                        Pending Orders
                      </span>
                      <p className="text-xs text-gray-500 dark:text-gray-500 mt-1">
                        Awaiting processing
                      </p>
                    </div>
                    <span className="text-lg font-semibold text-yellow-600 dark:text-yellow-400">
                      {dashboardData.pendingOrders}
                    </span>
                  </div>

                  {/* Total Warehouses */}
                  <div className="flex items-center justify-between pb-3 border-b border-gray-100 dark:border-gray-700">
                    <div>
                      <span className="text-sm text-gray-600 dark:text-gray-400">
                        Active Warehouses
                      </span>
                      <p className="text-xs text-gray-500 dark:text-gray-500 mt-1">
                        Storage locations
                      </p>
                    </div>
                    <span className="text-lg font-semibold text-blue-600 dark:text-blue-400">
                      {dashboardData.totalWarehouses}
                    </span>
                  </div>

                  {/* Average Inventory Value */}
                  <div className="flex items-center justify-between">
                    <div>
                      <span className="text-sm text-gray-600 dark:text-gray-400">
                        Avg. Product Value
                      </span>
                      <p className="text-xs text-gray-500 dark:text-gray-500 mt-1">
                        Per unit cost
                      </p>
                    </div>
                    <span className="text-lg font-semibold text-green-600 dark:text-green-400">
                      ${dashboardData.totalProducts > 0 
                        ? (dashboardData.totalInventoryValue / dashboardData.totalProducts).toLocaleString("en-US", {
                          maximumFractionDigits: 0,
                        })
                        : 0}
                    </span>
                  </div>
                </div>
              </div>

              {/* Order Status Summary */}
              <div className="rounded-2xl border border-gray-200 bg-white p-6 dark:border-gray-800 dark:bg-white/[0.03]">
                <h3 className="mb-4 text-lg font-semibold text-gray-800 dark:text-white/90">
                  Order Summary
                </h3>
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-600 dark:text-gray-400">
                      Total Orders
                    </span>
                    <span className="inline-block px-3 py-1 rounded-full bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-400 text-sm font-medium">
                      {dashboardData.totalOrders}
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-600 dark:text-gray-400">
                      Total Customers
                    </span>
                    <span className="inline-block px-3 py-1 rounded-full bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400 text-sm font-medium">
                      {dashboardData.totalCustomers}
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-600 dark:text-gray-400">
                      Total Products
                    </span>
                    <span className="inline-block px-3 py-1 rounded-full bg-purple-100 dark:bg-purple-900/30 text-purple-700 dark:text-purple-400 text-sm font-medium">
                      {dashboardData.totalProducts}
                    </span>
                  </div>
                </div>
              </div>

              {/* Quick Actions */}
              <div className="rounded-2xl border border-gray-200 bg-white p-6 dark:border-gray-800 dark:bg-white/[0.03]">
                <h3 className="mb-4 text-lg font-semibold text-gray-800 dark:text-white/90">
                  Quick Access
                </h3>
                <div className="space-y-2">
                  <a
                    href="/orders"
                    className="block w-full text-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm font-medium"
                  >
                    View All Orders
                  </a>
                  <a
                    href="/customers"
                    className="block w-full text-center px-4 py-2 bg-gray-100 dark:bg-gray-700 text-gray-900 dark:text-white rounded-lg hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors text-sm font-medium"
                  >
                    Manage Customers
                  </a>
                </div>
              </div>
            </div>

            {/* Full Width - Recent Orders */}
            <div className="col-span-12">
              <RecentOrders />
            </div>
          </div>
        )}
      </div>
    </>
  );
}