// components/sale-staff/SaleStaffTable.tsx
import { SaleStaff } from "../../types/saleStaff";

interface SaleStaffTableProps {
  data: SaleStaff[];
  isLoading: boolean;
  onEdit: (staffId: number) => void;
  onDelete: (staffId: number) => void;
}

export default function SaleStaffTable({
  data,
  isLoading,
  onEdit,
  onDelete,
}: SaleStaffTableProps) {
  return (
    <div className="p-6">
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-gray-200 dark:border-gray-700">
              <th className="px-4 py-3 text-left font-semibold text-gray-900 dark:text-white">
                Staff ID
              </th>
              <th className="px-4 py-3 text-left font-semibold text-gray-900 dark:text-white">
                Employee Name
              </th>
              <th className="px-4 py-3 text-left font-semibold text-gray-900 dark:text-white">
                Email
              </th>
              <th className="px-4 py-3 text-left font-semibold text-gray-900 dark:text-white">
                Phone Number
              </th>
              <th className="px-4 py-3 text-left font-semibold text-gray-900 dark:text-white">
                Position
              </th>
              <th className="px-4 py-3 text-left font-semibold text-gray-900 dark:text-white">
                Store
              </th>
              <th className="px-4 py-3 text-left font-semibold text-gray-900 dark:text-white">
                Location
              </th>
              <th className="px-4 py-3 text-center font-semibold text-gray-900 dark:text-white">
                Actions
              </th>
            </tr>
          </thead>
          <tbody>
            {isLoading ? (
              <tr>
                <td colSpan={8} className="px-4 py-8 text-center text-gray-500">
                  Loading...
                </td>
              </tr>
            ) : data.length === 0 ? (
              <tr>
                <td colSpan={8} className="px-4 py-8 text-center text-gray-500">
                  No sale staff found
                </td>
              </tr>
            ) : (
              data.map((staff) => (
                <tr
                  key={staff.staffId}
                  className="border-b border-gray-100 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700/50"
                >
                  <td className="px-4 py-4 font-medium text-gray-900 dark:text-gray-100">
                    #{staff.staffId}
                  </td>
                  <td className="px-4 py-4 text-gray-900 dark:text-gray-100">
                    {staff.employeeName}
                  </td>
                  <td className="px-4 py-4 text-gray-900 dark:text-gray-100">
                    {staff.email || "N/A"}
                  </td>
                  <td className="px-4 py-4 text-gray-900 dark:text-gray-100">
                    {staff.phoneNumber || "N/A"}
                  </td>
                  <td className="px-4 py-4 text-gray-900 dark:text-gray-100">
                    {staff.position}
                  </td>
                  <td className="px-4 py-4 text-gray-900 dark:text-gray-100">
                    {staff.storeName}
                  </td>
                  <td className="px-4 py-4 text-gray-900 dark:text-gray-100">
                    {staff.storeLocation}
                  </td>
                  <td className="px-4 py-4 text-center">
                    <div className="flex justify-center gap-2">
                      <button
                        onClick={() => onEdit(staff.staffId)}
                        className="text-green-600 hover:text-green-800 dark:text-green-400 dark:hover:text-green-300 font-medium"
                      >
                        Transfer
                      </button>
                      <button
                        onClick={() => onDelete(staff.staffId)}
                        className="text-red-600 hover:text-red-800 dark:text-red-400 dark:hover:text-red-300 font-medium"
                      >
                        Remove
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}

