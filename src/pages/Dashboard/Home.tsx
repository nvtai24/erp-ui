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
            Dashboard Overview
          </h1>
          <p className="mt-2 text-gray-600 dark:text-gray-400">
            Monitor your business performance and key metrics in real-time
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
            <div className="flex items-center gap-3">
              <svg className="w-5 h-5 text-red-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <p className="text-red-700 dark:text-red-400">{error}</p>
            </div>
            <button
              onClick={() => window.location.reload()}
              className="mt-3 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors text-sm font-medium"
            >
              Retry
            </button>
          </div>
        )}

        {/* Content */}
        {!isLoading && dashboardData && (
          <div className="space-y-6">
            {/* Key Metrics - Full Width */}
            <DashboardMetrics data={dashboardData} />

            {/* Business Insights Section */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* Sales Insight */}
              <div className="rounded-2xl border border-gray-200 bg-white p-6 dark:border-gray-800 dark:bg-white/[0.03] shadow-sm">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-12 h-12 rounded-xl bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center">
                    <svg className="w-6 h-6 text-blue-600 dark:text-blue-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
                    </svg>
                  </div>
                  <h3 className="text-lg font-semibold text-gray-800 dark:text-white/90">
                    Sales Performance
                  </h3>
                </div>
                <div className="space-y-3">
                  <div>
                    <div className="flex justify-between items-center mb-1">
                      <span className="text-sm text-gray-600 dark:text-gray-400">Total Orders</span>
                      <span className="text-sm font-semibold text-gray-800 dark:text-white">
                        {dashboardData.totalSalesOrders}
                      </span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2 dark:bg-gray-700">
                      <div 
                        className="bg-blue-600 h-2 rounded-full transition-all duration-500" 
                        style={{ width: "75%" }}
                      />
                    </div>
                  </div>
                  <div>
                    <div className="flex justify-between items-center mb-1">
                      <span className="text-sm text-gray-600 dark:text-gray-400">Avg. Order Value</span>
                      <span className="text-sm font-semibold text-gray-800 dark:text-white">
                        ${dashboardData.totalSalesOrders > 0 
                          ? (dashboardData.totalSalesOrderValue / dashboardData.totalSalesOrders).toLocaleString("en-US", {
                            minimumFractionDigits: 2,
                            maximumFractionDigits: 2,
                          })
                          : "0.00"}
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Purchase Insight */}
              <div className="rounded-2xl border border-gray-200 bg-white p-6 dark:border-gray-800 dark:bg-white/[0.03] shadow-sm">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-12 h-12 rounded-xl bg-purple-100 dark:bg-purple-900/30 flex items-center justify-center">
                    <svg className="w-6 h-6 text-purple-600 dark:text-purple-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
                    </svg>
                  </div>
                  <h3 className="text-lg font-semibold text-gray-800 dark:text-white/90">
                    Purchase Orders
                  </h3>
                </div>
                <div className="space-y-3">
                  <div>
                    <div className="flex justify-between items-center mb-1">
                      <span className="text-sm text-gray-600 dark:text-gray-400">Total Orders</span>
                      <span className="text-sm font-semibold text-gray-800 dark:text-white">
                        {dashboardData.totalPurchaseOrders}
                      </span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2 dark:bg-gray-700">
                      <div 
                        className="bg-purple-600 h-2 rounded-full transition-all duration-500" 
                        style={{ width: "60%" }}
                      />
                    </div>
                  </div>
                  <div>
                    <div className="flex justify-between items-center mb-1">
                      <span className="text-sm text-gray-600 dark:text-gray-400">Avg. Purchase Value</span>
                      <span className="text-sm font-semibold text-gray-800 dark:text-white">
                        ${dashboardData.totalPurchaseOrders > 0 
                          ? (dashboardData.totalPurchaseOrderValue / dashboardData.totalPurchaseOrders).toLocaleString("en-US", {
                            minimumFractionDigits: 2,
                            maximumFractionDigits: 2,
                          })
                          : "0.00"}
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Inventory Insight */}
              <div className="rounded-2xl border border-gray-200 bg-white p-6 dark:border-gray-800 dark:bg-white/[0.03] shadow-sm">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-12 h-12 rounded-xl bg-green-100 dark:bg-green-900/30 flex items-center justify-center">
                    <svg className="w-6 h-6 text-green-600 dark:text-green-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
                    </svg>
                  </div>
                  <h3 className="text-lg font-semibold text-gray-800 dark:text-white/90">
                    Inventory Status
                  </h3>
                </div>
                <div className="space-y-3">
                  <div className="flex items-center justify-between p-3 rounded-lg bg-gray-50 dark:bg-gray-800/50">
                    <span className="text-sm text-gray-600 dark:text-gray-400">Products</span>
                    <span className="text-lg font-bold text-gray-800 dark:text-white">
                      {dashboardData.totalProducts}
                    </span>
                  </div>
                  <div className="flex items-center justify-between p-3 rounded-lg bg-gray-50 dark:bg-gray-800/50">
                    <span className="text-sm text-gray-600 dark:text-gray-400">Warehouses</span>
                    <span className="text-lg font-bold text-gray-800 dark:text-white">
                      {dashboardData.totalWarehouses}
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* Charts Section */}
            <div className="grid grid-cols-1 gap-6">
              <DashboardCharts />
            </div>

            {/* Recent Orders Section */}
            <RecentOrders />

            {/* Quick Actions */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <a
                href="/orders/create"
                className="flex items-center gap-3 p-4 rounded-xl border border-gray-200 bg-white dark:border-gray-800 dark:bg-white/[0.03] hover:shadow-md transition-all group"
              >
                <div className="w-12 h-12 rounded-lg bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center group-hover:scale-110 transition-transform">
                  <svg className="w-6 h-6 text-blue-600 dark:text-blue-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                  </svg>
                </div>
                <div>
                  <p className="text-sm font-semibold text-gray-800 dark:text-white">New Order</p>
                  <p className="text-xs text-gray-500 dark:text-gray-400">Create sales order</p>
                </div>
              </a>

              <a
                href="/purchase-orders/create"
                className="flex items-center gap-3 p-4 rounded-xl border border-gray-200 bg-white dark:border-gray-800 dark:bg-white/[0.03] hover:shadow-md transition-all group"
              >
                <div className="w-12 h-12 rounded-lg bg-purple-100 dark:bg-purple-900/30 flex items-center justify-center group-hover:scale-110 transition-transform">
                  <svg className="w-6 h-6 text-purple-600 dark:text-purple-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
                  </svg>
                </div>
                <div>
                  <p className="text-sm font-semibold text-gray-800 dark:text-white">New Purchase</p>
                  <p className="text-xs text-gray-500 dark:text-gray-400">Create PO</p>
                </div>
              </a>

              <a
                href="/customers"
                className="flex items-center gap-3 p-4 rounded-xl border border-gray-200 bg-white dark:border-gray-800 dark:bg-white/[0.03] hover:shadow-md transition-all group"
              >
                <div className="w-12 h-12 rounded-lg bg-green-100 dark:bg-green-900/30 flex items-center justify-center group-hover:scale-110 transition-transform">
                  <svg className="w-6 h-6 text-green-600 dark:text-green-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                  </svg>
                </div>
                <div>
                  <p className="text-sm font-semibold text-gray-800 dark:text-white">Customers</p>
                  <p className="text-xs text-gray-500 dark:text-gray-400">View all clients</p>
                </div>
              </a>

              <a
                href="/reports"
                className="flex items-center gap-3 p-4 rounded-xl border border-gray-200 bg-white dark:border-gray-800 dark:bg-white/[0.03] hover:shadow-md transition-all group"
              >
                <div className="w-12 h-12 rounded-lg bg-orange-100 dark:bg-orange-900/30 flex items-center justify-center group-hover:scale-110 transition-transform">
                  <svg className="w-6 h-6 text-orange-600 dark:text-orange-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                  </svg>
                </div>
                <div>
                  <p className="text-sm font-semibold text-gray-800 dark:text-white">Reports</p>
                  <p className="text-xs text-gray-500 dark:text-gray-400">View analytics</p>
                </div>
              </a>
            </div>
          </div>
        )}
      </div>
    </>
  );
}