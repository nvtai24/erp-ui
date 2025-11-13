// components/payroll/PayrollForm.tsx
import { useState, useEffect } from "react";

interface PayrollFormProps {
  onSubmit: (data: { employeeId: number; month: number; year: number }) => void;
  onClose: () => void;
  isSubmitting?: boolean;
}

export default function PayrollForm({
  onSubmit,
  onClose,
  isSubmitting = false,
}: PayrollFormProps) {
  const [formData, setFormData] = useState({
    employeeId: 0,
    month: new Date().getMonth() + 1,
    year: new Date().getFullYear(),
  });

  const [errors, setErrors] = useState({
    employeeId: "",
    month: "",
    year: "",
  });

  const validateForm = () => {
    const newErrors = {
      employeeId: "",
      month: "",
      year: "",
    };

    if (!formData.employeeId || formData.employeeId === 0) {
      newErrors.employeeId = "Employee ID is required";
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

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (validateForm()) {
      onSubmit(formData);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: name === "employeeId" || name === "month" || name === "year" 
        ? parseInt(value) || 0 
        : value,
    }));
    
    if (errors[name as keyof typeof errors]) {
      setErrors((prev) => ({
        ...prev,
        [name]: "",
      }));
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
            Calculate Payroll
          </h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-500 dark:hover:text-gray-300"
          >
            <svg
              className="w-6 h-6"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <div>
            <label
              htmlFor="employeeId"
              className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2"
            >
              Employee ID <span className="text-red-500">*</span>
            </label>
            <input
              type="number"
              id="employeeId"
              name="employeeId"
              value={formData.employeeId || ""}
              onChange={handleChange}
              className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white ${
                errors.employeeId
                  ? "border-red-500"
                  : "border-gray-300 dark:border-gray-600"
              }`}
              placeholder="Enter employee ID"
            />
            {errors.employeeId && (
              <p className="mt-1 text-sm text-red-500">{errors.employeeId}</p>
            )}
          </div>

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
              <option value="">Select month</option>
              {[...Array(12)].map((_, i) => (
                <option key={i + 1} value={i + 1}>
                  {new Date(2000, i).toLocaleString('default', { month: 'long' })} ({i + 1})
                </option>
              ))}
            </select>
            {errors.month && (
              <p className="mt-1 text-sm text-red-500">{errors.month}</p>
            )}
          </div>

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
              placeholder="Enter year"
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
              {isSubmitting ? "Calculating..." : "Calculate"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}