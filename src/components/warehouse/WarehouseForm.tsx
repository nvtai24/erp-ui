import { useState, useEffect } from "react";

interface WarehouseFormProps {
  warehouse?: {
    warehouseId: number;
    warehouseName: string;
    location: string;
  };
  onSubmit: (data: { warehouseName: string; location: string }) => void;
  onClose: () => void;
  isSubmitting?: boolean;
}

export default function WarehouseForm({
  warehouse,
  onSubmit,
  onClose,
  isSubmitting = false,
}: WarehouseFormProps) {
  const [formData, setFormData] = useState({
    warehouseId: 0,
    warehouseName: "",
    location: "",
  });

  const [errors, setErrors] = useState({
    warehouseId: 0,
    warehouseName: "",
    location: "",
  });

  useEffect(() => {
    if (warehouse) {
      setFormData({
        warehouseId: warehouse.warehouseId,
        warehouseName: warehouse.warehouseName,
        location: warehouse.location,
      });
    }
  }, [warehouse]);

  const validateForm = () => {
    const newErrors = {
      warehouseId: 0,
      warehouseName: "",
      location: "",
    };

    if (!formData.warehouseName.trim()) {
      newErrors.warehouseName = "Warehouse name is required";
    }

    if (!formData.location.trim()) {
      newErrors.location = "Location is required";
    }

    setErrors(newErrors);
    return !newErrors.warehouseName && !newErrors.location;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (validateForm()) {
      onSubmit(formData);
    }
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
    // Clear error when user starts typing
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
            {warehouse ? "Edit Warehouse" : "Add New Warehouse"}
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
              htmlFor="warehouseName"
              className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2"
            >
              Warehouse Name <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              id="warehouseName"
              name="warehouseName"
              value={formData.warehouseName}
              onChange={handleChange}
              className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white ${
                errors.warehouseName
                  ? "border-red-500"
                  : "border-gray-300 dark:border-gray-600"
              }`}
              placeholder="Enter warehouse name"
            />
            {errors.warehouseName && (
              <p className="mt-1 text-sm text-red-500">{errors.warehouseName}</p>
            )}
          </div>

          <div>
            <label
              htmlFor="location"
              className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2"
            >
              Location <span className="text-red-500">*</span>
            </label>
            <textarea
              id="location"
              name="location"
              value={formData.location}
              onChange={handleChange}
              rows={4}
              className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white resize-none ${
                errors.location
                  ? "border-red-500"
                  : "border-gray-300 dark:border-gray-600"
              }`}
              placeholder="Enter warehouse location"
            />
            {errors.location && (
              <p className="mt-1 text-sm text-red-500">{errors.location}</p>
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
              {isSubmitting ? "Saving..." : warehouse ? "Update" : "Create"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
