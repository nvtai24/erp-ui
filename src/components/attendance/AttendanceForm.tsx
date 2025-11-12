import { useState, useEffect } from "react";

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

  useEffect(() => {
    if (attendance) {
      setFormData({
        employeeId: attendance.employeeId,
        workDate: attendance.workDate,
        status: attendance.status,
        daysOff: attendance.daysOff,
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
          {/* Employee ID */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Employee ID
            </label>
            <input
              type="number"
              name="employeeId"
              value={formData.employeeId || ""}
              onChange={handleChange}
              className="w-full px-3 py-2 border rounded-md focus:ring-2 focus:ring-blue-500 focus:outline-none"
              required
            />
          </div>

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
