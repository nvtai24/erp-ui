import { useState, useEffect } from "react";
import employeeService from "../../services/employeeService";

interface Employee {
  employeeId: number;
  fullName: string;
}

interface AttendanceFormProps {
  attendance?: {
    attendanceId: number;
    employeeId: number;
    employeeName: string;
    workDate: string;
    status: "Present" | "Absent" | "Late" | "Leave";
    daysOff: number;
  };
  onSubmit: (data: {
    employeeId: number;
    workDate: string;
    status: "Present" | "Absent" | "Late" | "Leave";
    daysOff: number;
  }) => void;
  onClose: () => void;
  isSubmitting?: boolean;
}

export default function AttendanceForm({
  attendance,
  onSubmit,
  onClose,
  isSubmitting = false,
}: AttendanceFormProps) {
  const [formData, setFormData] = useState({
    employeeId: 0,
    workDate: "",
    status: "Present" as "Present" | "Absent" | "Late" | "Leave",
    daysOff: 0,
  });

  const [employees, setEmployees] = useState<Employee[]>([]);
  const [loadingEmployees, setLoadingEmployees] = useState(true);

  // Fetch danh sách nhân viên từ employeeService
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
    if (attendance) {
      setFormData({
        employeeId: attendance.employeeId,
        workDate: attendance.workDate,
        status: attendance.status,
        daysOff: attendance.daysOff,
      });
    } else {
      setFormData({
        employeeId: 0,
        workDate: "",
        status: "Present",
        daysOff: 0,
      });
    }
  }, [attendance]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]:
        name === "employeeId" || name === "daysOff"
          ? Number(value)
          : (value as "Present" | "Absent" | "Late" | "Leave"),
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formData);
  };

  return (
    <div
      className="fixed inset-0 z-[9999] flex items-center justify-center bg-gray-900/50 backdrop-blur-sm"
      onClick={onClose}
    >
      <div
        className="bg-white dark:bg-gray-800 rounded-lg shadow-xl w-full max-w-md mx-4"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200 dark:border-gray-700">
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
            {attendance ? "Edit Attendance" : "Add New Attendance"}
          </h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
          >
            ✕
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          {/* Employee selection */}
          {attendance ? (
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Employee
              </label>
              <input
                type="text"
                value={attendance.employeeName}
                readOnly
                className="w-full px-3 py-2 border rounded-md bg-gray-100 text-gray-600 cursor-not-allowed"
              />
            </div>
          ) : (
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Select Employee
              </label>
              <select
                name="employeeId"
                value={formData.employeeId}
                onChange={handleChange}
                className="w-full px-3 py-2 border rounded-md focus:ring-2 focus:ring-blue-500 focus:outline-none max-h-40 overflow-y-auto"
                required
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
            </div>
          )}

          {/* Work Date */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Work Date
            </label>
            <input
              type="date"
              name="workDate"
              value={formData.workDate}
              onChange={handleChange}
              className="w-full px-3 py-2 border rounded-md focus:ring-2 focus:ring-blue-500 focus:outline-none"
              required
            />
          </div>

          {/* Status */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Status
            </label>
            <select
              name="status"
              value={formData.status}
              onChange={handleChange}
              className="w-full px-3 py-2 border rounded-md focus:ring-2 focus:ring-blue-500 focus:outline-none"
            >
              <option value="Present">Present</option>
              <option value="Absent">Absent</option>
              <option value="Late">Late</option>
              <option value="Leave">Leave</option>
            </select>
          </div>

          {/* Days Off */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Days Off
            </label>
            <input
              type="number"
              name="daysOff"
              value={formData.daysOff}
              onChange={handleChange}
              min={0}
              step={1}
              placeholder="Enter number of days off"
              className="w-full px-3 py-2 border rounded-md focus:ring-2 focus:ring-blue-500 focus:outline-none"
            />
          </div>

          {/* Buttons */}
          <div className="flex justify-end gap-3 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-sm font-medium border rounded-md hover:bg-gray-100 dark:hover:bg-gray-700"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-md hover:bg-blue-700 disabled:opacity-70"
            >
              {isSubmitting ? "Saving..." : attendance ? "Update" : "Create"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
