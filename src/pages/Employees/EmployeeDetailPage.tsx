// pages/employees/EmployeeDetailPage.tsx
import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import PageMeta from "../../components/common/PageMeta";
import Toast from "../../components/common/Toast";
import ConfirmDialog from "../../components/common/ConfirmDialog";
import { useToast } from "../../hooks/useToast";
import employeeService from "../../services/employeeService";
import { EmployeeDetail } from "../../types/employee";

export default function EmployeeDetailPage() {
  const { employeeId } = useParams<{ employeeId: string }>();
  const navigate = useNavigate();
  const { toast, showToast, hideToast } = useToast();
  const [employee, setEmployee] = useState<EmployeeDetail | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [confirmDialog, setConfirmDialog] = useState(false);

  useEffect(() => {
    const fetchEmployeeDetail = async () => {
      if (!employeeId) return;

      setIsLoading(true);
      setError(null);
      try {
        const response = await employeeService.getEmployeeById(Number(employeeId));

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

    fetchEmployeeDetail();
  }, [employeeId]);

  const handleDelete = () => {
    setConfirmDialog(true);
  };

  const confirmDelete = async () => {
    if (!employeeId) return;

    try {
      const response = await employeeService.deleteEmployee(Number(employeeId));
      if (response.success) {
        showToast("Employee deleted successfully!", "success");
        setTimeout(() => navigate("/employees"), 1500);
      } else {
        showToast(response.message || "Failed to delete employee", "error");
      }
    } catch (error: any) {
      console.error("Delete employee error:", error);
      showToast("Failed to delete employee", "error");
    } finally {
      setConfirmDialog(false);
    }
  };

  const cancelDelete = () => {
    setConfirmDialog(false);
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

  if (isLoading) {
    return (
      <div className="mx-auto max-w-4xl mt-6 text-center">
        <p className="text-gray-500 dark:text-gray-400">Loading employee details...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="mx-auto max-w-4xl mt-6">
        <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-4 mb-4">
          <p className="text-red-800 dark:text-red-300">{error}</p>
        </div>
        <button
          onClick={() => navigate("/employees")}
          className="text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300 font-medium"
        >
          ← Back to Employee List
        </button>
      </div>
    );
  }

  if (!employee) {
    return (
      <div className="mx-auto max-w-4xl mt-6">
        <p className="text-gray-500 dark:text-gray-400">Employee not found</p>
        <button
          onClick={() => navigate("/employees")}
          className="mt-4 text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300 font-medium"
        >
          ← Back to Employee List
        </button>
      </div>
    );
  }

  return (
    <>
      <PageMeta
        title={`${employee.fullName} | Employee Detail`}
        description="Employee details"
      />

      {toast && (
        <Toast message={toast.message} type={toast.type} onClose={hideToast} />
      )}

      <ConfirmDialog
        isOpen={confirmDialog}
        title="Delete Employee"
        message={`Are you sure you want to delete ${employee.fullName}? This action cannot be undone.`}
        confirmText="Delete"
        cancelText="Cancel"
        type="danger"
        onConfirm={confirmDelete}
        onCancel={cancelDelete}
      />

      <div className="mx-auto max-w-4xl mt-6">
        <button
          onClick={() => navigate("/employees")}
          className="mb-4 text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300 font-medium"
        >
          ← Back to Employee List
        </button>

        <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
          <div className="flex justify-between items-start mb-6">
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
              Employee Profile
            </h1>
            <div className="flex gap-2">
              <button
                onClick={() => navigate(`/employees/edit/${employee.employeeId}`)}
                className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 font-medium"
              >
                Edit Profile
              </button>
              <button
                onClick={handleDelete}
                className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700 font-medium"
              >
                Delete
              </button>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Personal Information */}
            <div className="space-y-4">
              <h2 className="text-lg font-semibold text-gray-900 dark:text-white pb-2 border-b border-gray-200 dark:border-gray-700">
                Personal Information
              </h2>
              
              <div>
                <p className="text-sm text-gray-600 dark:text-gray-400">Employee ID</p>
                <p className="text-base font-medium text-gray-900 dark:text-white">
                  #{employee.employeeId}
                </p>
              </div>

              <div>
                <p className="text-sm text-gray-600 dark:text-gray-400">Full Name</p>
                <p className="text-base font-medium text-gray-900 dark:text-white">
                  {employee.fullName}
                </p>
              </div>

              <div>
                <p className="text-sm text-gray-600 dark:text-gray-400">Gender</p>
                <p className="text-base font-medium text-gray-900 dark:text-white">
                  {employee.gender}
                </p>
              </div>

              <div>
                <p className="text-sm text-gray-600 dark:text-gray-400">Date of Birth</p>
                <p className="text-base font-medium text-gray-900 dark:text-white">
                  {formatDate(employee.dateOfBirth)}
                </p>
              </div>

              <div>
                <p className="text-sm text-gray-600 dark:text-gray-400">Age</p>
                <p className="text-base font-medium text-gray-900 dark:text-white">
                  {employee.age} years old
                </p>
              </div>

              <div>
                <p className="text-sm text-gray-600 dark:text-gray-400">Email</p>
                <p className="text-base font-medium text-gray-900 dark:text-white">
                  {employee.email || "N/A"}
                </p>
              </div>

              <div>
                <p className="text-sm text-gray-600 dark:text-gray-400">Phone</p>
                <p className="text-base font-medium text-gray-900 dark:text-white">
                  {employee.phone || "N/A"}
                </p>
              </div>
            </div>

            {/* Employment Information */}
            <div className="space-y-4">
              <h2 className="text-lg font-semibold text-gray-900 dark:text-white pb-2 border-b border-gray-200 dark:border-gray-700">
                Employment Information
              </h2>

              <div>
                <p className="text-sm text-gray-600 dark:text-gray-400">Position</p>
                <p className="text-base font-medium text-gray-900 dark:text-white">
                  {employee.position}
                </p>
              </div>

              <div>
                <p className="text-sm text-gray-600 dark:text-gray-400">Department</p>
                <p className="text-base font-medium text-gray-900 dark:text-white">
                  {employee.departmentName || "N/A"}
                </p>
              </div>

              <div>
                <p className="text-sm text-gray-600 dark:text-gray-400">Hire Date</p>
                <p className="text-base font-medium text-gray-900 dark:text-white">
                  {formatDate(employee.hireDate)}
                </p>
              </div>

              <div>
                <p className="text-sm text-gray-600 dark:text-gray-400">Years of Service</p>
                <p className="text-base font-medium text-gray-900 dark:text-white">
                  {employee.yearsOfService} years
                </p>
              </div>

              <div>
                <p className="text-sm text-gray-600 dark:text-gray-400">Base Salary</p>
                <p className="text-base font-medium text-blue-600 dark:text-blue-400">
                  {formatCurrency(employee.salary)}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}