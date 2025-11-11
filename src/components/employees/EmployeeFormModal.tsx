// components/employees/EmployeeFormModal.tsx
import { useState, useEffect } from "react";
import { X } from "lucide-react";
import employeeService from "../../services/employeeService";
import departmentService from "../../services/departmentService";
import {
  CreateEmployeeDTO,
  UpdateEmployeeDTO,
  Department,
  EmployeeDetail,
} from "../../types/employee";

interface EmployeeFormModalProps {
  isOpen: boolean;
  employeeId?: number | null;
  onClose: () => void;
  onSuccess: () => void;
  onError: (message: string) => void;
}

export default function EmployeeFormModal({
  isOpen,
  employeeId,
  onClose,
  onSuccess,
  onError,
}: EmployeeFormModalProps) {
  const isEditMode = !!employeeId;

  const [formData, setFormData] = useState({
    fullName: "",
    gender: "Male",
    dateOfBirth: "",
    email: "",
    phone: "",
    position: "",
    departmentId: 0,
    hireDate: "",
    salary: 0,
  });

  const [departments, setDepartments] = useState<Department[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isFetching, setIsFetching] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    if (isOpen) {
      fetchDepartments();
      if (isEditMode && employeeId) {
        fetchEmployeeData();
      } else {
        resetForm();
      }
    }
  }, [isOpen, employeeId, isEditMode]);

  const resetForm = () => {
    setFormData({
      fullName: "",
      gender: "Male",
      dateOfBirth: "",
      email: "",
      phone: "",
      position: "",
      departmentId: 0,
      hireDate: "",
      salary: 0,
    });
    setErrors({});
  };

  const fetchDepartments = async () => {
    try {
      const response = await departmentService.getDepartments();
      if (response.success && response.data) {
        setDepartments(response.data);
      }
    } catch (error: any) {
      console.error("Fetch departments error:", error);
      onError("Failed to load departments");
    }
  };

  const fetchEmployeeData = async () => {
    setIsFetching(true);
    try {
      const response = await employeeService.getEmployeeById(Number(employeeId));
      if (response.success && response.data) {
        const employee = response.data;
        setFormData({
          fullName: employee.fullName,
          gender: employee.gender,
          dateOfBirth: employee.dateOfBirth.split("T")[0],
          email: employee.email || "",
          phone: employee.phone || "",
          position: employee.position,
          departmentId: employee.departmentId,
          hireDate: employee.hireDate.split("T")[0],
          salary: employee.salary,
        });
      } else {
        onError(response.message || "Failed to fetch employee data");
      }
    } catch (error: any) {
      console.error("Fetch employee error:", error);
      onError("Failed to fetch employee data");
    } finally {
      setIsFetching(false);
    }
  };

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (!formData.fullName.trim()) {
      newErrors.fullName = "Full name is required";
    } else if (formData.fullName.trim().length < 2) {
      newErrors.fullName = "Full name must be at least 2 characters";
    }

    if (!formData.email.trim()) {
      newErrors.email = "Email is required";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = "Invalid email format (e.g., user@example.com)";
    }

    if (!formData.phone.trim()) {
      newErrors.phone = "Phone number is required";
    } else if (formData.phone.trim().length < 8) {
      newErrors.phone = "Phone number must be at least 8 characters";
    }

    if (!formData.position.trim()) {
      newErrors.position = "Position is required";
    } else if (formData.position.trim().length < 2) {
      newErrors.position = "Position must be at least 2 characters";
    }

    if (formData.departmentId === 0) {
      newErrors.departmentId = "Please select a department";
    }

    if (!formData.dateOfBirth) {
      newErrors.dateOfBirth = "Date of birth is required";
    } else {
      const birthDate = new Date(formData.dateOfBirth);
      const today = new Date();
      const age = today.getFullYear() - birthDate.getFullYear();
      if (age < 16) {
        newErrors.dateOfBirth = "Employee must be at least 16 years old";
      } else if (age > 100) {
        newErrors.dateOfBirth = "Please enter a valid date of birth";
      }
    }

    if (!formData.hireDate) {
      newErrors.hireDate = "Hire date is required";
    } else {
      const hireDate = new Date(formData.hireDate);
      const today = new Date();
      if (hireDate > today) {
        newErrors.hireDate = "Hire date cannot be in the future";
      }
    }

    if (formData.salary < 0) {
      newErrors.salary = "Salary must be greater than or equal to 0";
    } else if (formData.salary === 0) {
      newErrors.salary = "Salary is required";
    }

    setErrors(newErrors);
    
    if (Object.keys(newErrors).length > 0) {
      onError("Please fill in all required fields correctly");
    }
    
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: name === "departmentId" || name === "salary" ? Number(value) : value,
    }));
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: "" }));
    }
  };

  const handleApiError = (errorMessage: string) => {
    // Try to parse field-specific errors
    const fieldErrors: Record<string, string> = {};
    
    // Common error patterns
    if (errorMessage.toLowerCase().includes("email")) {
      if (errorMessage.toLowerCase().includes("exists") || errorMessage.toLowerCase().includes("duplicate")) {
        fieldErrors.email = "This email is already registered";
      } else if (errorMessage.toLowerCase().includes("invalid")) {
        fieldErrors.email = "Invalid email format";
      } else {
        fieldErrors.email = errorMessage;
      }
    }
    
    if (errorMessage.toLowerCase().includes("phone")) {
      if (errorMessage.toLowerCase().includes("exists") || errorMessage.toLowerCase().includes("duplicate")) {
        fieldErrors.phone = "This phone number is already registered";
      } else if (errorMessage.toLowerCase().includes("invalid")) {
        fieldErrors.phone = "Invalid phone number format";
      } else {
        fieldErrors.phone = errorMessage;
      }
    }
    
    if (errorMessage.toLowerCase().includes("department")) {
      fieldErrors.departmentId = "Invalid department selected";
    }
    
    if (errorMessage.toLowerCase().includes("salary")) {
      fieldErrors.salary = "Invalid salary amount";
    }

    if (errorMessage.toLowerCase().includes("full name") || errorMessage.toLowerCase().includes("fullname")) {
      fieldErrors.fullName = "Invalid full name";
    }

    if (errorMessage.toLowerCase().includes("position")) {
      fieldErrors.position = "Invalid position";
    }

    // Set field errors if any found
    if (Object.keys(fieldErrors).length > 0) {
      setErrors(fieldErrors);
      onError("Please check the highlighted fields");
    } else {
      // Generic error
      onError(errorMessage);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    setIsLoading(true);

    try {
      if (isEditMode && employeeId) {
        const dto: UpdateEmployeeDTO = {
          employeeId: Number(employeeId),
          ...formData,
        };
        const response = await employeeService.updateEmployee(Number(employeeId), dto);
        if (response.success) {
          onSuccess();
          onClose();
        } else {
          // Parse error message to show field-specific errors
          const errorMsg = response.message || "Failed to update employee";
          handleApiError(errorMsg);
        }
      } else {
        const dto: CreateEmployeeDTO = formData;
        const response = await employeeService.createEmployee(dto);
        if (response.success) {
          onSuccess();
          onClose();
        } else {
          // Parse error message to show field-specific errors
          const errorMsg = response.message || "Failed to create employee";
          handleApiError(errorMsg);
        }
      }
    } catch (error: any) {
      console.error("Submit error:", error);
      const errorMsg = error.response?.data?.message || "Failed to save employee";
      handleApiError(errorMsg);
    } finally {
      setIsLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto animate-in fade-in duration-200">
      <div className="flex min-h-screen items-center justify-center p-4">
        {/* Backdrop - mờ đi thay vì đen */}
        <div
          className="fixed inset-0 bg-black/30 backdrop-blur-sm transition-all"
          onClick={onClose}
        />

        {/* Modal */}
        <div className="relative bg-white dark:bg-gray-800 rounded-lg shadow-xl w-full max-w-4xl max-h-[90vh] overflow-hidden animate-in zoom-in-95 duration-200">
          {/* Header */}
          <div className="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 px-6 py-4">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
                  {isEditMode ? "Edit Employee" : "Create New Employee"}
                </h2>
                <p className="text-gray-500 dark:text-gray-400 text-sm mt-1">
                  {isEditMode ? "Update employee information" : "Fill in the details to add a new employee"}
                </p>
              </div>
              <button
                onClick={onClose}
                className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg p-2 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
          </div>

          {/* Body */}
          <div className="px-6 py-6 overflow-y-auto max-h-[calc(90vh-180px)]">
            {isFetching ? (
              <div className="text-center py-12">
                <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
                <p className="text-gray-500 dark:text-gray-400 mt-4">Loading employee data...</p>
              </div>
            ) : (
              <form onSubmit={handleSubmit} id="employee-form">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* Full Name */}
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                      Full Name <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      name="fullName"
                      value={formData.fullName}
                      onChange={handleChange}
                      placeholder="Enter full name"
                      className={`w-full px-4 py-2.5 border rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all ${
                        errors.fullName
                          ? "border-red-500 focus:ring-red-500"
                          : "border-gray-300 dark:border-gray-600"
                      }`}
                    />
                    {errors.fullName && (
                      <p className="mt-1.5 text-sm text-red-600 dark:text-red-400 flex items-center gap-1">
                        <span>⚠</span> {errors.fullName}
                      </p>
                    )}
                  </div>

                  {/* Gender */}
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                      Gender <span className="text-red-500">*</span>
                    </label>
                    <select
                      name="gender"
                      value={formData.gender}
                      onChange={handleChange}
                      className="w-full px-4 py-2.5 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                    >
                      <option value="Male">Male</option>
                      <option value="Female">Female</option>
                      <option value="Other">Other</option>
                    </select>
                  </div>

                  {/* Date of Birth */}
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                      Date of Birth <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="date"
                      name="dateOfBirth"
                      value={formData.dateOfBirth}
                      onChange={handleChange}
                      className={`w-full px-4 py-2.5 border rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all ${
                        errors.dateOfBirth
                          ? "border-red-500 focus:ring-red-500"
                          : "border-gray-300 dark:border-gray-600"
                      }`}
                    />
                    {errors.dateOfBirth && (
                      <p className="mt-1.5 text-sm text-red-600 dark:text-red-400 flex items-center gap-1">
                        <span>⚠</span> {errors.dateOfBirth}
                      </p>
                    )}
                  </div>

                  {/* Email */}
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                      Email <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                      placeholder="example@company.com"
                      className={`w-full px-4 py-2.5 border rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all ${
                        errors.email
                          ? "border-red-500 focus:ring-red-500"
                          : "border-gray-300 dark:border-gray-600"
                      }`}
                    />
                    {errors.email && (
                      <p className="mt-1.5 text-sm text-red-600 dark:text-red-400 flex items-center gap-1">
                        <span>⚠</span> {errors.email}
                      </p>
                    )}
                  </div>

                  {/* Phone */}
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                      Phone <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="tel"
                      name="phone"
                      value={formData.phone}
                      onChange={handleChange}
                      placeholder="+84 123 456 789"
                      className={`w-full px-4 py-2.5 border rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all ${
                        errors.phone
                          ? "border-red-500 focus:ring-red-500"
                          : "border-gray-300 dark:border-gray-600"
                      }`}
                    />
                    {errors.phone && (
                      <p className="mt-1.5 text-sm text-red-600 dark:text-red-400 flex items-center gap-1">
                        <span>⚠</span> {errors.phone}
                      </p>
                    )}
                  </div>

                  {/* Position */}
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                      Position <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      name="position"
                      value={formData.position}
                      onChange={handleChange}
                      placeholder="e.g., Software Engineer"
                      className={`w-full px-4 py-2.5 border rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all ${
                        errors.position
                          ? "border-red-500 focus:ring-red-500"
                          : "border-gray-300 dark:border-gray-600"
                      }`}
                    />
                    {errors.position && (
                      <p className="mt-1.5 text-sm text-red-600 dark:text-red-400 flex items-center gap-1">
                        <span>⚠</span> {errors.position}
                      </p>
                    )}
                  </div>

                  {/* Department */}
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                      Department <span className="text-red-500">*</span>
                    </label>
                    <select
                      name="departmentId"
                      value={formData.departmentId}
                      onChange={handleChange}
                      className={`w-full px-4 py-2.5 border rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all ${
                        errors.departmentId
                          ? "border-red-500 focus:ring-red-500"
                          : "border-gray-300 dark:border-gray-600"
                      }`}
                    >
                      <option value={0}>-- Select Department --</option>
                      {departments.map((dept) => (
                        <option key={dept.departmentId} value={dept.departmentId}>
                          {dept.departmentName}
                        </option>
                      ))}
                    </select>
                    {errors.departmentId && (
                      <p className="mt-1.5 text-sm text-red-600 dark:text-red-400 flex items-center gap-1">
                        <span>⚠</span> {errors.departmentId}
                      </p>
                    )}
                  </div>

                  {/* Hire Date */}
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                      Hire Date <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="date"
                      name="hireDate"
                      value={formData.hireDate}
                      onChange={handleChange}
                      className={`w-full px-4 py-2.5 border rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all ${
                        errors.hireDate
                          ? "border-red-500 focus:ring-red-500"
                          : "border-gray-300 dark:border-gray-600"
                      }`}
                    />
                    {errors.hireDate && (
                      <p className="mt-1.5 text-sm text-red-600 dark:text-red-400 flex items-center gap-1">
                        <span>⚠</span> {errors.hireDate}
                      </p>
                    )}
                  </div>

                  {/* Base Salary */}
                  <div className="md:col-span-2">
                    <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                      Base Salary (USD) <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="number"
                      name="salary"
                      value={formData.salary}
                      onChange={handleChange}
                      step="0.01"
                      min="0"
                      placeholder="0.00"
                      className={`w-full px-4 py-2.5 border rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all ${
                        errors.salary
                          ? "border-red-500 focus:ring-red-500"
                          : "border-gray-300 dark:border-gray-600"
                      }`}
                    />
                    {errors.salary && (
                      <p className="mt-1.5 text-sm text-red-600 dark:text-red-400 flex items-center gap-1">
                        <span>⚠</span> {errors.salary}
                      </p>
                    )}
                  </div>
                </div>
              </form>
            )}
          </div>

          {/* Footer - Sticky */}
          {!isFetching && (
            <div className="sticky bottom-0 bg-white dark:bg-gray-800 px-6 py-4 border-t border-gray-200 dark:border-gray-700">
              <div className="flex gap-3 justify-end">
                <button
                  type="button"
                  onClick={onClose}
                  disabled={isLoading}
                  className="px-6 py-2 bg-white dark:bg-gray-700 text-gray-700 dark:text-gray-300 border border-gray-300 dark:border-gray-600 rounded hover:bg-gray-50 dark:hover:bg-gray-600 font-medium disabled:opacity-50 transition-all"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  form="employee-form"
                  disabled={isLoading}
                  className="px-6 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 font-medium disabled:opacity-50 disabled:cursor-not-allowed transition-all"
                >
                  {isLoading ? (
                    <span className="flex items-center justify-center gap-2">
                      <span className="inline-block animate-spin rounded-full h-4 w-4 border-b-2 border-white"></span>
                      Saving...
                    </span>
                  ) : (
                    <span>{isEditMode ? "Update Employee" : "Create Employee"}</span>
                  )}
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}