import {
  ArrowDownIcon,
  ArrowUpIcon,
  BoxIconLine,
  GroupIcon,
} from "../../icons";
import Badge from "../ui/badge/Badge";
import { DashboardSummary } from "../../types/reportStatistic";

interface DashboardMetricsProps {
  data: DashboardSummary;
}

export default function DashboardMetrics({ data }: DashboardMetricsProps) {
  const metrics = [
    {
      id: 1,
      icon: <GroupIcon className="text-gray-800 size-6 dark:text-white/90" />,
      label: "Total Customers",
      value: data.totalCustomers.toLocaleString(),
      isPositive: true,
      bgColor: "bg-blue-100 dark:bg-blue-900/30",
    },
    {
      id: 2,
      icon: <BoxIconLine className="text-gray-800 size-6 dark:text-white/90" />,
      label: "Total Orders",
      value: data.totalOrders.toLocaleString(),
      isPositive: false,
      bgColor: "bg-red-100 dark:bg-red-900/30",
    },
    {
      id: 3,
      icon: (
        <BoxIconLine className="text-gray-800 size-6 dark:text-white/90" />
      ),
      label: "Total Products",
      value: data.totalProducts.toLocaleString(),
      isPositive: true,
      bgColor: "bg-green-100 dark:bg-green-900/30",
    },
    {
      id: 4,
      icon: (
        <svg className="text-gray-800 size-6 dark:text-white/90" fill="currentColor" viewBox="0 0 24 24">
          <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8zm3.5-9c.83 0 1.5-.67 1.5-1.5S16.33 8 15.5 8 14 8.67 14 9.5s.67 1.5 1.5 1.5zm-7 0c.83 0 1.5-.67 1.5-1.5S9.33 8 8.5 8 7 8.67 7 9.5 7.67 11 8.5 11zm3.5 6.5c2.33 0 4.31-1.46 5.11-3.5H6.89c.8 2.04 2.78 3.5 5.11 3.5z" />
        </svg>
      ),
      label: "Inventory Value",
      value: `${(data.totalInventoryValue / 1000).toFixed(1)}K`,
      isPositive: true,
      bgColor: "bg-purple-100 dark:bg-purple-900/30",
    },
  ];

  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4 md:gap-6">
      {metrics.map((metric) => (
        <div
          key={metric.id}
          className="rounded-2xl border border-gray-200 bg-white p-5 dark:border-gray-800 dark:bg-white/[0.03] md:p-6 hover:shadow-lg transition-shadow"
        >
          <div className={`flex items-center justify-center w-12 h-12 rounded-xl ${metric.bgColor}`}>
            {metric.icon}
          </div>

          <div className="flex items-end justify-between mt-5">
            <div>
              <span className="text-sm text-gray-500 dark:text-gray-400">
                {metric.label}
              </span>
              <h4 className="mt-2 font-bold text-gray-800 text-title-sm dark:text-white/90">
                {metric.value}
              </h4>
            </div>
           
          </div>
        </div>
      ))}
    </div>
  );
}