import {
  BoxIconLine,
  GroupIcon,
} from "../../icons";
import { DashboardSummary } from "../../types/reportStatistic";

interface DashboardMetricsProps {
  data: DashboardSummary;
}

export default function DashboardMetrics({ data }: DashboardMetricsProps) {
  const metrics = [
    {
      id: 1,
      icon: <DollarSignIcon className="text-white size-6" />,
      label: "Total Sales Revenue",
      value: `$${data.totalSalesOrderValue.toLocaleString("en-US", {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
      })}`,
      subValue: `${data.totalSalesOrders} orders`,
      bgColor: "bg-gradient-to-br from-blue-500 to-blue-600",
      iconBg: "bg-blue-600/20",
    },
    {
      id: 2,
      icon: <ShoppingCartIcon className="text-white size-6" />,
      label: "Total Purchase Value",
      value: `$${data.totalPurchaseOrderValue.toLocaleString("en-US", {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
      })}`,
      subValue: `${data.totalPurchaseOrders} orders`,
      bgColor: "bg-gradient-to-br from-purple-500 to-purple-600",
      iconBg: "bg-purple-600/20",
    },
    {
      id: 3,
      icon: <GroupIcon className="text-white size-6" />,
      label: "Total Customers",
      value: data.totalCustomers.toLocaleString(),
      subValue: "Active clients",
      bgColor: "bg-gradient-to-br from-green-500 to-green-600",
      iconBg: "bg-green-600/20",
    },
    {
      id: 4,
      icon: <BoxIconLine className="text-white size-6" />,
      label: "Total Products",
      value: data.totalProducts.toLocaleString(),
      subValue: `${data.totalWarehouses} warehouses`,
      bgColor: "bg-gradient-to-br from-orange-500 to-orange-600",
      iconBg: "bg-orange-600/20",
    },
  ];

  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4 md:gap-6">
      {metrics.map((metric) => (
        <div
          key={metric.id}
          className={`rounded-2xl ${metric.bgColor} p-6 text-white shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105`}
        >
          <div className="flex items-start justify-between">
            <div className="flex-1">
              <p className="text-sm font-medium text-white/80 mb-1">
                {metric.label}
              </p>
              <h3 className="text-2xl font-bold mb-1">
                {metric.value}
              </h3>
              <p className="text-xs text-white/70">
                {metric.subValue}
              </p>
            </div>
            <div className={`flex items-center justify-center w-12 h-12 rounded-xl ${metric.iconBg}`}>
              {metric.icon}
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}

// Note: You may need to create these icon components if they don't exist
// Simple versions:
export const DollarSignIcon = ({ className }: { className?: string }) => (
  <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
  </svg>
);

export const ShoppingCartIcon = ({ className }: { className?: string }) => (
  <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
  </svg>
);