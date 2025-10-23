import { useState, useEffect } from "react";

interface CustomerFormProps {
  customer?: {
    customerId: number;
    name: string;
    contact: string;
    address: string;
  };
  onSubmit: (data: { name: string; contact: string; address: string }) => void;
  onClose: () => void;
  isSubmitting?: boolean;
}

export default function CustomerForm({
  customer,
  onSubmit,
  onClose,
  isSubmitting = false,
}: CustomerFormProps) {
  const [formData, setFormData] = useState({
    customerId: 0,
    name: "",
    contact: "",
    address: "",
  });

  const [errors, setErrors] = useState({
    customerId: 0,
    name: "",
    contact: "",
    address: "",
  });

  useEffect(() => {
    if (customer) {
      setFormData({
        customerId: customer.customerId,
        name: customer.name,
        contact: customer.contact,
        address: customer.address,
      });
    }
  }, [customer]);

  const validateForm = () => {
    const newErrors = {
      customerId: 0,
      name: "",
      contact: "",
      address: "",
    };

    if (!formData.name.trim()) {
      newErrors.name = "Customer name is required";
    }

    if (!formData.contact.trim()) {
      newErrors.contact = "Contact is required";
    }

    if (!formData.address.trim()) {
      newErrors.address = "Address is required";
    }

    setErrors(newErrors);
    return !newErrors.name && !newErrors.contact && !newErrors.address;
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
            {customer ? "Edit Customer" : "Add New Customer"}
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
              htmlFor="name"
              className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2"
            >
              Customer Name <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              id="name"
              name="name"
              value={formData.name}
              onChange={handleChange}
              className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white ${
                errors.name
                  ? "border-red-500"
                  : "border-gray-300 dark:border-gray-600"
              }`}
              placeholder="Enter Customer name"
            />
            {errors.name && (
              <p className="mt-1 text-sm text-red-500">{errors.name}</p>
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
              placeholder="Enter Customer contact"
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
              placeholder="Enter Customer address"
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
              {isSubmitting ? "Saving..." : customer ? "Update" : "Create"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
