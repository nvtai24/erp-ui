import { useState, useEffect } from "react";
import employeeService from "../../services/employeeService";

interface Employee {
  employeeId: number;
  fullName: string;
}

interface PayrollFormProps {
  payroll?: {
    payrollId: number;
    employeeId: number;
    employeeName: string;
    month: number;
    year: number;
  };
  onSubmit: (data: { employeeId: number; month: number; year: number }) => void;
  onClose: () => void;
  isSubmitting?: boolean;
}

export default function PayrollForm({
  payroll,
  onSubmit,
  onClose,
  isSubmitting = false,
}: PayrollFormProps) {
  const [formData, setFormData] = useState({
    employeeId: 0,
    month: new Date().getMonth() + 1,
    year: new Date().getFullYear(),
  });

  const [employees, setEmployees] = useState<Employee[]>([]);
  const [loadingEmployees, setLoadingEmployees] = useState(true);
  const [errors, setErrors] = useState({
    employeeId: "",
    month: "",
    year: "",
  });

  // Fetch danh sách nhân viên
  const fetchEmployees = async () => {
    try {
      const res = await employeeService.getEmployees({
        pageNumber: 1,
        pageSize: 100,
      });
      if (res.success && res.data) {
        setEmployees(
          res.data.map((emp: any) => ({
            employeeId: emp.employeeId,
            fullName: emp.fullName,
          }))
        );
      }
    } catch (error) {
      console.error("Error fetching employees:", error);
    } finally {
      setLoadingEmployees(false);
    }
  };

  useEffect(() => {
    fetchEmployees();
  }, []);

  useEffect(() => {
    if (payroll) {
      setFormData({
        employeeId: payroll.employeeId,
        month: payroll.month,
        year: payroll.year,
      });
    }
  }, [payroll]);

  const validateForm = () => {
    const newErrors = {
      employeeId: "",
      month: "",
      year: "",
    };

    if (!formData.employeeId) {
      newErrors.employeeId = "Please select an employee";
    }
    if (!formData.month || formData.month < 1 || formData.month > 12) {
      newErrors.month = "Month must be between 1 and 12";
    }
    if (!formData.year || formData.year < 2000) {
      newErrors.year = "Year must be valid";
    }

    setErrors(newErrors);
    return !newErrors.employeeId && !newErrors.month && !newErrors.year;
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]:
        name === "employeeId" || name === "month" || name === "year"
          ? Number(value)
          : value,
    }));

    if (errors[name as keyof typeof errors]) {
      setErrors((prev) => ({ ...prev, [name]: "" }));
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (validateForm()) {
      onSubmit(formData);
    }
  };

  return (
    <div
      className="fixed inset-0 z-[99999999] flex items-center justify-center bg-gray-900/50 backdrop-blur-sm"
      onClick={onClose}
    >
      <div
        className="bg-white dark:bg-gray-800 rounded-lg shadow-xl w-full max-w-md mx-4"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200 dark:border-gray-700">
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
            {payroll ? "Edit Payroll" : "Calculate Payroll"}
          </h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-500 dark:hover:text-gray-300"
          >
            ✕
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          {/* Employee selection */}
          {payroll ? (
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Employee
              </label>
              <input
                type="text"
                value={payroll.employeeName}
                readOnly
                className="w-full px-3 py-2 border rounded-md bg-gray-100 text-gray-600 cursor-not-allowed"
              />
            </div>
          ) : (
            <div>
              <label
                htmlFor="employeeId"
                className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2"
              >
                Select Employee <span className="text-red-500">*</span>
              </label>
              <select
                id="employeeId"
                name="employeeId"
                value={formData.employeeId}
                onChange={handleChange}
                className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white ${
                  errors.employeeId
                    ? "border-red-500"
                    : "border-gray-300 dark:border-gray-600"
                } max-h-40 overflow-y-auto`}
              >
                <option value="">-- Select an employee --</option>
                {loadingEmployees ? (
                  <option disabled>Loading...</option>
                ) : (
                  employees.map((emp) => (
                    <option key={emp.employeeId} value={emp.employeeId}>
                      {emp.fullName}
                    </option>
                  ))
                )}
              </select>
              {errors.employeeId && (
                <p className="mt-1 text-sm text-red-500">{errors.employeeId}</p>
              )}
            </div>
          )}

          {/* Month */}
          <div>
            <label
              htmlFor="month"
              className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2"
            >
              Month <span className="text-red-500">*</span>
            </label>
            <select
              id="month"
              name="month"
              value={formData.month}
              onChange={handleChange}
              className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white ${
                errors.month
                  ? "border-red-500"
                  : "border-gray-300 dark:border-gray-600"
              }`}
            >
              {[...Array(12)].map((_, i) => (
                <option key={i + 1} value={i + 1}>
                  {new Date(2000, i).toLocaleString("default", {
                    month: "long",
                  })}{" "}
                  ({i + 1})
                </option>
              ))}
            </select>
            {errors.month && (
              <p className="mt-1 text-sm text-red-500">{errors.month}</p>
            )}
          </div>

          {/* Year */}
          <div>
            <label
              htmlFor="year"
              className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2"
            >
              Year <span className="text-red-500">*</span>
            </label>
            <input
              type="number"
              id="year"
              name="year"
              value={formData.year}
              onChange={handleChange}
              min="2000"
              max="2100"
              className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white ${
                errors.year
                  ? "border-red-500"
                  : "border-gray-300 dark:border-gray-600"
              }`}
            />
            {errors.year && (
              <p className="mt-1 text-sm text-red-500">{errors.year}</p>
            )}
          </div>

          {/* Actions */}
          <div className="flex justify-end gap-3 pt-4">
            <button
              type="button"
              onClick={onClose}
              disabled={isSubmitting}
              className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 dark:bg-gray-700 dark:text-gray-300 dark:border-gray-600 dark:hover:bg-gray-600 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isSubmitting ? "Calculating..." : payroll ? "Update" : "Calculate"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
