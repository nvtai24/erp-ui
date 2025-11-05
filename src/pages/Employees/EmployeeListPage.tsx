// pages/employees/EmployeeListPage.tsx
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import PageMeta from "../../components/common/PageMeta";
import Toast from "../../components/common/Toast";
import ConfirmDialog from "../../components/common/ConfirmDialog";
import { useToast } from "../../hooks/useToast";
import EmployeeListTable from "../../components/employees/EmployeeListTable";
import employeeService from "../../services/employeeService";
import departmentService from "../../services/departmentService";
import { Employee, Department } from "../../types/employee";

export default function EmployeeListPage() {
  const navigate = useNavigate();
  const { toast, showToast, hideToast } = useToast();
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [departments, setDepartments] = useState<Department[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Confirm Dialog
  const [confirmDialog, setConfirmDialog] = useState<{
    isOpen: boolean;
    employeeId: number | null;
  }>({ isOpen: false, employeeId: null });

  // Filters
  const [searchTerm, setSearchTerm] = useState("");
  const [departmentId, setDepartmentId] = useState<number | undefined>();
  const [position, setPosition] = useState("");

  // Pagination
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize] = useState(10);
  const [totalItems, setTotalItems] = useState(0);

  useEffect(() => {
    fetchDepartments();
  }, []);

  useEffect(() => {
    fetchEmployees();
  }, [searchTerm, departmentId, position, currentPage]);

  const fetchDepartments = async () => {
    try {
      const response = await departmentService.getDepartments();
      if (response.success && response.data) {
        setDepartments(response.data);
      }
    } catch (error: any) {
      console.error("Fetch departments error:", error);
    }
  };

  const fetchEmployees = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await employeeService.getEmployees({
        searchTerm: searchTerm || undefined,
        departmentId,
        position: position || undefined,
        pageNumber: currentPage,
        pageSize,
      });

      if (response.success && response.data) {
        setEmployees(response.data);
        setTotalItems(response.metaData?.totalItems || 0);
      } else {
        setError(response.message || "Failed to fetch employees");
      }
    } catch (error: any) {
      console.error("Fetch employees error:", error);
      setError(error.response?.data?.message || "Failed to fetch employees");
    } finally {
      setIsLoading(false);
    }
  };

  const handleSearch = () => {
    setCurrentPage(1);
    fetchEmployees();
  };

  const handleClearFilters = () => {
    setSearchTerm("");
    setDepartmentId(undefined);
    setPosition("");
    setCurrentPage(1);
  };

  const handleEdit = (employeeId: number) => {
    navigate(`/employees/edit/${employeeId}`);
  };

  const handleDelete = (employeeId: number) => {
    setConfirmDialog({ isOpen: true, employeeId });
  };

  const confirmDelete = async () => {
    if (!confirmDialog.employeeId) return;

    try {
      const response = await employeeService.deleteEmployee(confirmDialog.employeeId);
      if (response.success) {
        showToast("Employee deleted successfully!", "success");
        fetchEmployees();
      } else {
        showToast(response.message || "Failed to delete employee", "error");
      }
    } catch (error: any) {
      console.error("Delete employee error:", error);
      showToast("Failed to delete employee", "error");
    } finally {
      setConfirmDialog({ isOpen: false, employeeId: null });
    }
  };

  const cancelDelete = () => {
    setConfirmDialog({ isOpen: false, employeeId: null });
  };

  return (
    <>
      <PageMeta
        title="Employee Management | ERP System"
        description="Manage employee records"
      />

      {toast && (
        <Toast message={toast.message} type={toast.type} onClose={hideToast} />
      )}

      <ConfirmDialog
        isOpen={confirmDialog.isOpen}
        title="Delete Employee"
        message="Are you sure you want to delete this employee? This action cannot be undone."
        confirmText="Delete"
        cancelText="Cancel"
        type="danger"
        onConfirm={confirmDelete}
        onCancel={cancelDelete}
      />

      <div className="mx-auto max-w-7xl mt-6">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
            Employee Management
          </h1>
          <button
            onClick={() => navigate("/employees/create")}
            className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 font-medium"
          >
            + Add Employee
          </button>
        </div>

        {/* Filters */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6 mb-6">
          <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
            Filters
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Search
              </label>
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Search by name, email, phone..."
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Department
              </label>
              <select
                value={departmentId || ""}
                onChange={(e) =>
                  setDepartmentId(e.target.value ? Number(e.target.value) : undefined)
                }
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
              >
                <option value="">-- All Departments --</option>
                {departments.map((dept) => (
                  <option key={dept.departmentId} value={dept.departmentId}>
                    {dept.departmentName}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Position
              </label>
              <input
                type="text"
                value={position}
                onChange={(e) => setPosition(e.target.value)}
                placeholder="Enter position"
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
              />
            </div>
            <div className="flex items-end gap-2">
              <button
                onClick={handleSearch}
                className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 font-medium"
              >
                Search
              </button>
              <button
                onClick={handleClearFilters}
                className="px-4 py-2 bg-gray-200 dark:bg-gray-600 text-gray-900 dark:text-white rounded hover:bg-gray-300 dark:hover:bg-gray-500 font-medium"
              >
                Clear
              </button>
            </div>
          </div>
        </div>

        {/* Error Message */}
        {error && (
          <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-4 mb-4">
            <p className="text-red-800 dark:text-red-300">{error}</p>
          </div>
        )}

        {/* Table */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow">
          <EmployeeListTable
            data={employees}
            totalItems={totalItems}
            currentPage={currentPage}
            pageSize={pageSize}
            isLoading={isLoading}
            onPageChange={setCurrentPage}
            onEdit={handleEdit}
            onDelete={handleDelete}
          />
        </div>
      </div>
    </>
  );
}