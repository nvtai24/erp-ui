import { useState, useEffect } from "react";
import { Dropdown } from "../ui/dropdown/Dropdown";
import { DropdownItem } from "../ui/dropdown/DropdownItem";
import { MoreDotIcon } from "../../icons";
import CountryMap from "./CountryMap";
import reportStatisticService from "../../services/reportStatisticService";
import { CustomerOrder } from "../../types/reportStatistic";

interface CountryData {
  country: string;
  count: number;
  percentage: number;
  flag: string;
}

export default function DemographicCard() {
  const [isOpen, setIsOpen] = useState(false);
  const [countryData, setCountryData] = useState<CountryData[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  function toggleDropdown() {
    setIsOpen(!isOpen);
  }

  function closeDropdown() {
    setIsOpen(false);
  }

  useEffect(() => {
    const fetchCustomerData = async () => {
      try {
        setIsLoading(true);
        const response = await reportStatisticService.getCustomerOrders({
          pageNumber: 1,
          pageSize: 100,
        });

        if (response.success && response.data) {
          const orders = response.data as CustomerOrder[];
          
          // Group by customer name to get unique customers per country
          // Note: This is a simple grouping - you may need to adjust based on your data structure
          const countryMap = new Map<string, number>();
          
          orders.forEach((order) => {
            const country = order.customerName?.split(" ").pop() || "Unknown";
            countryMap.set(country, (countryMap.get(country) || 0) + 1);
          });

          // Calculate percentages
          const total = Array.from(countryMap.values()).reduce((a, b) => a + b, 0);
          const countries = Array.from(countryMap.entries())
            .map(([country, count]) => ({
              country,
              count,
              percentage: Math.round((count / total) * 100),
              flag: getCountryFlag(country),
            }))
            .sort((a, b) => b.count - a.count)
            .slice(0, 5);

          setCountryData(countries);
        }
      } catch (error) {
        console.error("Fetch customer demographic error:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchCustomerData();
  }, []);

  const getCountryFlag = (country: string): string => {
    const flags: Record<string, string> = {
      USA: "🇺🇸",
      France: "🇫🇷",
      Germany: "🇩🇪",
      UK: "🇬🇧",
      Japan: "🇯🇵",
      China: "🇨🇳",
      India: "🇮🇳",
      Australia: "🇦🇺",
      Canada: "🇨🇦",
      Brazil: "🇧🇷",
    };
    return flags[country] || "🌍";
  };

  if (isLoading) {
    return (
      <div className="rounded-2xl border border-gray-200 bg-white p-5 dark:border-gray-800 dark:bg-white/[0.03] sm:p-6">
        <div className="flex items-center justify-center py-8">
          <div className="text-center">
            <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
            <p className="mt-4 text-gray-600 dark:text-gray-400">Loading demographics...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="rounded-2xl border border-gray-200 bg-white p-5 dark:border-gray-800 dark:bg-white/[0.03] sm:p-6">
      <div className="flex justify-between">
        <div>
          <h3 className="text-lg font-semibold text-gray-800 dark:text-white/90">
            Customers Demographic
          </h3>
          <p className="mt-1 text-gray-500 text-theme-sm dark:text-gray-400">
            Number of customers based on region
          </p>
        </div>
        <div className="relative inline-block">
          <button className="dropdown-toggle" onClick={toggleDropdown}>
            <MoreDotIcon className="text-gray-400 hover:text-gray-700 dark:hover:text-gray-300 size-6" />
          </button>
          <Dropdown
            isOpen={isOpen}
            onClose={closeDropdown}
            className="w-40 p-2"
          >
            <DropdownItem
              onItemClick={closeDropdown}
              className="flex w-full font-normal text-left text-gray-500 rounded-lg hover:bg-gray-100 hover:text-gray-700 dark:text-gray-400 dark:hover:bg-white/5 dark:hover:text-gray-300"
            >
              View More
            </DropdownItem>
            <DropdownItem
              onItemClick={closeDropdown}
              className="flex w-full font-normal text-left text-gray-500 rounded-lg hover:bg-gray-100 hover:text-gray-700 dark:text-gray-400 dark:hover:bg-white/5 dark:hover:text-gray-300"
            >
              Refresh
            </DropdownItem>
          </Dropdown>
        </div>
      </div>

      <div className="px-4 py-6 my-6 overflow-hidden border border-gray-200 rounded-2xl dark:border-gray-800 sm:px-6">
        <div
          id="mapOne"
          className="mapOne map-btn -mx-4 -my-6 h-[212px] w-[252px] 2xsm:w-[307px] xsm:w-[358px] sm:-mx-6 md:w-[668px] lg:w-[634px] xl:w-[393px] 2xl:w-[554px]"
        >
          <CountryMap />
        </div>
      </div>

      <div className="space-y-5">
        {countryData.length === 0 ? (
          <div className="text-center text-gray-500 dark:text-gray-400 py-8">
            No demographic data available
          </div>
        ) : (
          countryData.map((data, index) => (
            <div key={index} className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="text-2xl">
                  {data.flag}
                </div>
                <div>
                  <p className="font-semibold text-gray-800 text-theme-sm dark:text-white/90">
                    {data.country}
                  </p>
                  <span className="block text-gray-500 text-theme-xs dark:text-gray-400">
                    {data.count.toLocaleString()} Customers
                  </span>
                </div>
              </div>

              <div className="flex w-full max-w-[140px] items-center gap-3">
                <div className="relative block h-2 w-full max-w-[100px] rounded-sm bg-gray-200 dark:bg-gray-800">
                  <div 
                    className="absolute left-0 top-0 flex h-full items-center justify-center rounded-sm bg-blue-600 dark:bg-blue-500 text-xs font-medium text-white"
                    style={{ width: `${data.percentage}%` }}
                  ></div>
                </div>
                <p className="font-medium text-gray-800 text-theme-sm dark:text-white/90 min-w-[40px]">
                  {data.percentage}%
                </p>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}