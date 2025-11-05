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
  ];

  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 md:gap-6">
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