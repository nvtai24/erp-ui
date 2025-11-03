import { useState, useEffect } from "react";
import PageMeta from "../../components/common/PageMeta";
import reportStatisticService from "../../services/reportStatisticService";
import { DashboardSummary } from "../../types/reportStatistic";
import DashboardMetrics from "../../components/dashboard/DashboardMetrics";
import DashboardCharts from "../../components/dashboard/DashboardCharts";
import RecentOrders from "../../components/ecommerce/RecentOrders";
import DemographicCard from "../../components/ecommerce/DemographicCard";

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
            <div className="col-span-12 lg:col-span-4">
              {/* Quick Stats Card */}
              <div className="rounded-2xl border border-gray-200 bg-white p-6 dark:border-gray-800 dark:bg-white/[0.03] mb-6">
                <h3 className="mb-4 text-lg font-semibold text-gray-800 dark:text-white/90">
                  Quick Stats
                </h3>
                <div className="space-y-4">
                  <div className="flex items-center justify-between pb-3 border-b border-gray-100 dark:border-gray-700">
                    <span className="text-sm text-gray-600 dark:text-gray-400">
                      Total Warehouses
                    </span>
                    <span className="text-lg font-semibold text-gray-800 dark:text-white">
                      {dashboardData.totalWarehouses}
                    </span>
                  </div>
                  <div className="flex items-center justify-between pb-3 border-b border-gray-100 dark:border-gray-700">
                    <span className="text-sm text-gray-600 dark:text-gray-400">
                      Pending Orders
                    </span>
                    <span className="text-lg font-semibold text-yellow-600 dark:text-yellow-400">
                      {dashboardData.pendingOrders}
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-600 dark:text-gray-400">
                      Avg Inventory Value
                    </span>
                    <span className="text-lg font-semibold text-blue-600 dark:text-blue-400">
                      ${(dashboardData.totalInventoryValue / dashboardData.totalProducts).toLocaleString("en-US", {
                        maximumFractionDigits: 0,
                      })}
                    </span>
                  </div>
                </div>
              </div>

              {/* Demographic Card */}
              <DemographicCard />
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