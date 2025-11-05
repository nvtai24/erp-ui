// components/employees/EmployeeDetailModal.tsx
import { useState, useEffect } from "react";
import { X, Edit, Trash2, Mail, Phone, Briefcase, Calendar, DollarSign, Users } from "lucide-react";
import employeeService from "../../services/employeeService";
import { EmployeeDetail } from "../../types/employee";

interface EmployeeDetailModalProps {
  isOpen: boolean;
  employeeId: number | null;
  onClose: () => void;
  onEdit: (employeeId: number) => void;
  onDelete: (employeeId: number) => void;
}

export default function EmployeeDetailModal({
  isOpen,
  employeeId,
  onClose,
  onEdit,
  onDelete,
}: EmployeeDetailModalProps) {
  const [employee, setEmployee] = useState<EmployeeDetail | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (isOpen && employeeId) {
      fetchEmployeeDetail();
    }
  }, [isOpen, employeeId]);

  const fetchEmployeeDetail = async () => {
    if (!employeeId) return;

    setIsLoading(true);
    setError(null);
    try {
      const response = await employeeService.getEmployeeById(employeeId);
      if (response.success && response.data) {
        setEmployee(response.data);
      } else {
        setError(response.message || "Failed to fetch employee details");
      }
    } catch (error: any) {
      console.error("Fetch employee detail error:", error);
      setError(error.response?.data?.message || "Failed to fetch employee details");
    } finally {
      setIsLoading(false);
    }
  };

  const formatDate = (dateString: string) => {
    try {
      return new Date(dateString).toLocaleDateString("en-US", {
        year: "numeric",
        month: "long",
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

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto animate-in fade-in duration-200">
      <div className="flex min-h-screen items-center justify-center p-4">
        {/* Backdrop - mờ đi */}
        <div
          className="fixed inset-0 bg-black/30 backdrop-blur-sm transition-all"
          onClick={onClose}
        />

        {/* Modal */}
        <div className="relative bg-white dark:bg-gray-800 rounded-xl shadow-2xl w-full max-w-5xl max-h-[90vh] overflow-hidden animate-in zoom-in-95 duration-200">
          {/* Header với gradient */}
          <div className="bg-gradient-to-r from-blue-600 to-blue-700 px-6 py-5">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-2xl font-bold text-white">Employee Profile</h2>
                <p className="text-blue-100 text-sm mt-1">View detailed employee information</p>
              </div>
              <div className="flex items-center gap-2">
                {employee && (
                  <>
                    <button
                      onClick={() => onEdit(employee.employeeId)}
                      className="p-2.5 text-white bg-white/20 hover:bg-white/30 rounded-lg transition-all"
                      title="Edit Employee"
                    >
                      <Edit className="w-5 h-5" />
                    </button>
                    <button
                      onClick={() => onDelete(employee.employeeId)}
                      className="p-2.5 text-white bg-red-500/20 hover:bg-red-500/30 rounded-lg transition-all"
                      title="Delete Employee"
                    >
                      <Trash2 className="w-5 h-5" />
                    </button>
                  </>
                )}
                <button
                  onClick={onClose}
                  className="p-2.5 text-white/80 hover:text-white hover:bg-white/10 rounded-lg transition-colors ml-2"
                >
                  <X className="w-6 h-6" />
                </button>
              </div>
            </div>
          </div>

          {/* Body */}
          <div className="px-6 py-6 overflow-y-auto max-h-[calc(90vh-120px)]">
            {isLoading ? (
              <div className="text-center py-12">
                <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
                <p className="text-gray-500 dark:text-gray-400 mt-4">Loading employee details...</p>
              </div>
            ) : error ? (
              <div className="bg-red-50 dark:bg-red-900/20 border-2 border-red-200 dark:border-red-800 rounded-xl p-6">
                <div className="flex items-center gap-3">
                  <span className="text-3xl">⚠️</span>
                  <p className="text-red-800 dark:text-red-300 font-medium">{error}</p>
                </div>
              </div>
            ) : !employee ? (
              <div className="text-center py-12">
                <span className="text-6xl">👤</span>
                <p className="text-gray-500 dark:text-gray-400 mt-4 text-lg">Employee not found</p>
              </div>
            ) : (
              <div className="space-y-6">
                {/* Employee Header Card */}
                <div className="bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20 rounded-xl p-6 border border-blue-100 dark:border-blue-800">
                  <div className="flex items-center gap-4">
                    <div className="w-20 h-20 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-full flex items-center justify-center text-white text-3xl font-bold shadow-lg">
                      {employee.fullName.charAt(0).toUpperCase()}
                    </div>
                    <div className="flex-1">
                      <h3 className="text-2xl font-bold text-gray-900 dark:text-white">
                        {employee.fullName}
                      </h3>
                      <p className="text-blue-600 dark:text-blue-400 font-medium text-lg mt-1">
                        {employee.position}
                      </p>
                      <p className="text-gray-600 dark:text-gray-400 text-sm mt-1">
                        Employee ID: #{employee.employeeId}
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="text-sm text-gray-600 dark:text-gray-400">Base Salary</p>
                      <p className="text-2xl font-bold text-green-600 dark:text-green-400">
                        {formatCurrency(employee.salary)}
                      </p>
                    </div>
                  </div>
                </div>

                {/* Information Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* Personal Information */}
                  <div className="bg-white dark:bg-gray-700/50 rounded-xl p-6 border border-gray-200 dark:border-gray-700 shadow-sm">
                    <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
                      <span className="text-2xl">👤</span>
                      Personal Information
                    </h3>
                    
                    <div className="space-y-4">
                      <div className="flex items-start gap-3">
                        <div className="mt-1 text-gray-400">
                          <Users className="w-5 h-5" />
                        </div>
                        <div>
                          <p className="text-sm text-gray-600 dark:text-gray-400">Gender</p>
                          <p className="text-base font-semibold text-gray-900 dark:text-white">
                            {employee.gender}
                          </p>
                        </div>
                      </div>

                      <div className="flex items-start gap-3">
                        <div className="mt-1 text-gray-400">
                          <Calendar className="w-5 h-5" />
                        </div>
                        <div>
                          <p className="text-sm text-gray-600 dark:text-gray-400">Date of Birth</p>
                          <p className="text-base font-semibold text-gray-900 dark:text-white">
                            {formatDate(employee.dateOfBirth)}
                          </p>
                          <p className="text-sm text-blue-600 dark:text-blue-400 mt-1">
                            {employee.age} years old
                          </p>
                        </div>
                      </div>

                      <div className="flex items-start gap-3">
                        <div className="mt-1 text-gray-400">
                          <Mail className="w-5 h-5" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-sm text-gray-600 dark:text-gray-400">Email</p>
                          <p className="text-base font-semibold text-gray-900 dark:text-white break-all">
                            {employee.email || "N/A"}
                          </p>
                        </div>
                      </div>

                      <div className="flex items-start gap-3">
                        <div className="mt-1 text-gray-400">
                          <Phone className="w-5 h-5" />
                        </div>
                        <div>
                          <p className="text-sm text-gray-600 dark:text-gray-400">Phone</p>
                          <p className="text-base font-semibold text-gray-900 dark:text-white">
                            {employee.phone || "N/A"}
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Employment Information */}
                  <div className="bg-white dark:bg-gray-700/50 rounded-xl p-6 border border-gray-200 dark:border-gray-700 shadow-sm">
                    <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
                      <span className="text-2xl">💼</span>
                      Employment Information
                    </h3>

                    <div className="space-y-4">
                      <div className="flex items-start gap-3">
                        <div className="mt-1 text-gray-400">
                          <Briefcase className="w-5 h-5" />
                        </div>
                        <div>
                          <p className="text-sm text-gray-600 dark:text-gray-400">Position</p>
                          <p className="text-base font-semibold text-gray-900 dark:text-white">
                            {employee.position}
                          </p>
                        </div>
                      </div>

                      <div className="flex items-start gap-3">
                        <div className="mt-1 text-gray-400">
                          <Users className="w-5 h-5" />
                        </div>
                        <div>
                          <p className="text-sm text-gray-600 dark:text-gray-400">Department</p>
                          <p className="text-base font-semibold text-gray-900 dark:text-white">
                            {employee.departmentName || "N/A"}
                          </p>
                        </div>
                      </div>

                      <div className="flex items-start gap-3">
                        <div className="mt-1 text-gray-400">
                          <Calendar className="w-5 h-5" />
                        </div>
                        <div>
                          <p className="text-sm text-gray-600 dark:text-gray-400">Hire Date</p>
                          <p className="text-base font-semibold text-gray-900 dark:text-white">
                            {formatDate(employee.hireDate)}
                          </p>
                          <p className="text-sm text-blue-600 dark:text-blue-400 mt-1">
                            {employee.yearsOfService} years of service
                          </p>
                        </div>
                      </div>

                      <div className="flex items-start gap-3">
                        <div className="mt-1 text-gray-400">
                          <DollarSign className="w-5 h-5" />
                        </div>
                        <div>
                          <p className="text-sm text-gray-600 dark:text-gray-400">Base Salary</p>
                          <p className="text-xl font-bold text-green-600 dark:text-green-400">
                            {formatCurrency(employee.salary)}
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}