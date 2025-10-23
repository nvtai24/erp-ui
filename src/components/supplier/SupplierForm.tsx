import { useState, useEffect } from "react";

interface SupplierFormProps {
  supplier?: {
    supplierId: number;
    supplierName: string;
    contact: string;
    address: string;
  };
  onSubmit: (data: { supplierName: string; contact: string; address: string }) => void;
  onClose: () => void;
  isSubmitting?: boolean;
}

export default function SupplierForm({
  supplier,
  onSubmit,
  onClose,
  isSubmitting = false,
}: SupplierFormProps) {
  const [formData, setFormData] = useState({
    supplierId: 0,
    supplierName: "",
    contact: "",
    address: "",
  });

  const [errors, setErrors] = useState({
    supplierId: 0,
    supplierName: "",
    contact: "",
    address: "",
  });

  useEffect(() => {
    if (supplier) {
      setFormData({
        supplierId: supplier.supplierId,
        supplierName: supplier.supplierName,
        contact: supplier.contact,
        address: supplier.address,
      });
    }
  }, [supplier]);

  const validateForm = () => {
    const newErrors = {
      supplierId: 0,
      supplierName: "",
      contact: "",
      address: "",
    };

    if (!formData.supplierName.trim()) {
      newErrors.supplierName = "Supplier name is required";
    }

    if (!formData.contact.trim()) {
      newErrors.contact = "Contact is required";
    }

    if (!formData.address.trim()) {
      newErrors.address = "Address is required";
    }

    setErrors(newErrors);
    return !newErrors.supplierName && !newErrors.contact && !newErrors.address;
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
            {supplier ? "Edit Supplier" : "Add New Supplier"}
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
              htmlFor="supplierName"
              className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2"
            >
              Supplier Name <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              id="supplierName"
              name="supplierName"
              value={formData.supplierName}
              onChange={handleChange}
              className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white ${
                errors.supplierName
                  ? "border-red-500"
                  : "border-gray-300 dark:border-gray-600"
              }`}
              placeholder="Enter Supplier name"
            />
            {errors.supplierName && (
              <p className="mt-1 text-sm text-red-500">{errors.supplierName}</p>
            )}
          </div>

          <div>
            <label
              htmlFor="Contact"
              className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2"
            >
              Contact <span className="text-red-500">*</span>
            </label>
            <input
              id="contact"
              name="contact"
              value={formData.contact}
              onChange={handleChange}
              className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white resize-none ${
                errors.contact
                  ? "border-red-500"
                  : "border-gray-300 dark:border-gray-600"
              }`}
              placeholder="Enter Supplier contact"
            />
            {errors.contact && (
              <p className="mt-1 text-sm text-red-500">{errors.contact}</p>
            )}
          </div>

          <div>
            <label
              htmlFor="Address"
              className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2"
            >
              Address <span className="text-red-500">*</span>
            </label>
            <input
              id="address"
              name="address"
              value={formData.address}
              onChange={handleChange}
              className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white resize-none ${
                errors.address
                  ? "border-red-500"
                  : "border-gray-300 dark:border-gray-600"
              }`}
              placeholder="Enter Supplier address"
            />
            {errors.address && (
              <p className="mt-1 text-sm text-red-500">{errors.address}</p>
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
              {isSubmitting ? "Saving..." : supplier ? "Update" : "Create"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
