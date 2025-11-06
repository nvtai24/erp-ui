// components/employees/EmployeeListTable.tsx
import { Employee } from "../../types/employee";

interface EmployeeListTableProps {
  data: Employee[];
  totalItems: number;
  currentPage: number;
  pageSize: number;
  isLoading: boolean;
  onPageChange: (page: number) => void;
  onRowClick: (employeeId: number) => void;
  onEdit: (employeeId: number) => void;
  onDelete: (employeeId: number) => void;
}

export default function EmployeeListTable({
  data,
  totalItems,
  currentPage,
  pageSize,
  isLoading,
  onPageChange,
  onRowClick,
  onEdit,
  onDelete,
}: EmployeeListTableProps) {
  const totalPages = Math.ceil(totalItems / pageSize);

  const formatDate = (dateString: string) => {
    try {
      const date = new Date(dateString);
      return date.toLocaleDateString("en-US", {
        year: "numeric",
        month: "short",
        day: "numeric",
      });
    } catch {
      return dateString;
    }
  };

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
    }).format(value);
  };

  const handleActionClick = (e: React.MouseEvent, action: () => void) => {
    e.stopPropagation();
    action();
  };

  return (
    <div className="p-6">
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-gray-200 dark:border-gray-700">
              <th className="px-4 py-3 text-left font-semibold text-gray-900 dark:text-white">
                ID
              </th>
              <th className="px-4 py-3 text-left font-semibold text-gray-900 dark:text-white">
                Full Name
              </th>
              <th className="px-4 py-3 text-left font-semibold text-gray-900 dark:text-white">
                Email
              </th>
              <th className="px-4 py-3 text-left font-semibold text-gray-900 dark:text-white">
                Phone
              </th>
              <th className="px-4 py-3 text-left font-semibold text-gray-900 dark:text-white">
                Position
              </th>
              <th className="px-4 py-3 text-left font-semibold text-gray-900 dark:text-white">
                Department
              </th>
              <th className="px-4 py-3 text-left font-semibold text-gray-900 dark:text-white">
                Hire Date
              </th>
              <th className="px-4 py-3 text-right font-semibold text-gray-900 dark:text-white">
                Base Salary
              </th>
              <th className="px-4 py-3 text-center font-semibold text-gray-900 dark:text-white">
                Actions
              </th>
            </tr>
          </thead>
          <tbody>
            {isLoading ? (
              <tr>
                <td colSpan={9} className="px-4 py-8 text-center text-gray-500">
                  Loading...
                </td>
              </tr>
            ) : data.length === 0 ? (
              <tr>
                <td colSpan={9} className="px-4 py-8 text-center text-gray-500">
                  No employees found
                </td>
              </tr>
            ) : (
              data.map((employee) => (
                <tr
                  key={employee.employeeId}
                  onClick={() => onRowClick(employee.employeeId)}
                  className="border-b border-gray-100 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700/50 cursor-pointer transition-colors"
                >
                  <td className="px-4 py-4 font-medium text-gray-900 dark:text-gray-100">
                    #{employee.employeeId}
                  </td>
                  <td className="px-4 py-4 text-gray-900 dark:text-gray-100">
                    {employee.fullName}
                  </td>
                  <td className="px-4 py-4 text-gray-900 dark:text-gray-100">
                    {employee.email || "N/A"}
                  </td>
                  <td className="px-4 py-4 text-gray-900 dark:text-gray-100">
                    {employee.phone || "N/A"}
                  </td>
                  <td className="px-4 py-4 text-gray-900 dark:text-gray-100">
                    {employee.position}
                  </td>
                  <td className="px-4 py-4 text-gray-900 dark:text-gray-100">
                    {employee.departmentName}
                  </td>
                  <td className="px-4 py-4 text-gray-900 dark:text-gray-100">
                    {formatDate(employee.hireDate)}
                  </td>
                  <td className="px-4 py-4 text-right font-medium text-gray-900 dark:text-gray-100">
                    {formatCurrency(employee.salary)}
                  </td>
                  <td className="px-4 py-4 text-center">
                    <div className="flex justify-center gap-2">
                      <button
                        onClick={(e) => handleActionClick(e, () => onRowClick(employee.employeeId))}
                        className="text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300 font-medium"
                      >
                        View
                      </button>
                      <button
                        onClick={(e) => handleActionClick(e, () => onEdit(employee.employeeId))}
                        className="text-green-600 hover:text-green-800 dark:text-green-400 dark:hover:text-green-300 font-medium"
                      >
                        Edit
                      </button>
                      <button
                        onClick={(e) => handleActionClick(e, () => onDelete(employee.employeeId))}
                        className="text-red-600 hover:text-red-800 dark:text-red-400 dark:hover:text-red-300 font-medium"
                      >
                        Delete
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {totalPages > 1 && (
        <div className="mt-6 flex justify-center gap-2">
          <button
            onClick={() => onPageChange(currentPage - 1)}
            disabled={currentPage === 1}
            className="px-3 py-2 rounded disabled:opacity-50 disabled:cursor-not-allowed bg-gray-100 text-gray-900 hover:bg-gray-200 dark:bg-gray-700 dark:text-white dark:hover:bg-gray-600"
          >
            ← Previous
          </button>

          {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
            <button
              key={page}
              onClick={() => onPageChange(page)}
              className={`px-3 py-2 rounded ${
                page === currentPage
                  ? "bg-blue-600 text-white font-semibold"
                  : "bg-gray-100 text-gray-900 hover:bg-gray-200 dark:bg-gray-700 dark:text-white dark:hover:bg-gray-600"
              }`}
            >
              {page}
            </button>
          ))}

          <button
            onClick={() => onPageChange(currentPage + 1)}
            disabled={currentPage === totalPages}
            className="px-3 py-2 rounded disabled:opacity-50 disabled:cursor-not-allowed bg-gray-100 text-gray-900 hover:bg-gray-200 dark:bg-gray-700 dark:text-white dark:hover:bg-gray-600"
          >
            Next →
          </button>
        </div>
      )}
    </div>
  );
}