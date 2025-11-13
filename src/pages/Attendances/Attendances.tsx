import { useState, useCallback } from "react";
import PageMeta from "../../components/common/PageMeta";
import AttendanceList from "../../components/attendance/AttendanceList";
import attendanceService from "../../services/attendanceService";
import { Attendance, ApiResponse } from "../../types/attendance";
import AttendanceForm from "../../components/attendance/AttendanceForm";
import { ToastProvider, useToast } from "../../components/ui/toast/ToastProvider";
import { confirmDelete } from "../../components/ui/alert/ConfirmDialog";

function AttendancesContent() {
  const [editingAttendance, setEditingAttendance] = useState<Attendance | null>(null);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [filterKeyword, setFilterKeyword] = useState("");
  const [refreshKey, setRefreshKey] = useState(0);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const { addToast } = useToast();

  const fetchAttendances = useCallback(async (page: number, pageSize: number) => {
    try {
      const res = await attendanceService.getAttendances({
        Keyword: filterKeyword || undefined,
        PageIndex: page,
        PageSize: pageSize,
      });

      if (!res.success) {
        addToast({ type: "error", message: res.message || "Failed to fetch attendance records" });
        return { data: [], totalItems: 0 };
      }

      return {
        data: res.data || [],
        totalItems: res.metaData?.totalItems || 0,
      };
    } catch (error) {
      console.error("Fetch attendance error:", error);
      addToast({ type: "error", message: "Failed to fetch attendance records" });
      return { data: [], totalItems: 0 };
    }
  }, [filterKeyword]);

  const handleAdd = () => {
    setEditingAttendance(null);
    setShowCreateModal(true);
  };

  const handleEdit = (attendance: Attendance) => {
    setEditingAttendance(attendance);
    setShowCreateModal(true);
  };

  const handleDelete = async (id: number) => {
    const result = await confirmDelete("attendance record");
    if (!result.isConfirmed) return;

    try {
      const response = await attendanceService.deleteAttendance(id);
      if (response.success) {
        addToast({ type: "success", message: "Attendance deleted successfully!" });
        setRefreshKey((prev) => prev + 1);
      } else {
        addToast({ type: "error", message: response.message || "Failed to delete record" });
      }
    } catch (error: any) {
      console.error("Delete error:", error);
      addToast({
        type: "error",
        message: error.response?.data?.message || "Failed to delete record",
      });
    }
  };

  const handleSubmitForm = async (data: Omit<Attendance, "attendanceId" | "employeeName">) => {
    if (isSubmitting) return;
    setIsSubmitting(true);

    try {
      let response: ApiResponse<Attendance>;

      if (editingAttendance) {
        response = await attendanceService.updateAttendance(editingAttendance.attendanceId, data);
      } else {
        response = await attendanceService.createAttendance(data);
      }

      if (response.success) {
        addToast({
          type: "success",
          message: editingAttendance
            ? "Attendance updated successfully!"
            : "Attendance created successfully!",
        });
        setShowCreateModal(false);
        setRefreshKey((prev) => prev + 1);
      } else {
        addToast({ type: "error", message: response.message || "Failed to save record" });
      }
    } catch (error: any) {
      console.error("Submit error:", error);
      addToast({
        type: "error",
        message: error.response?.data?.message || "Failed to save record",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <>
      <PageMeta title="Attendance Management | Admin Dashboard" description="Manage employee attendance" />

      <div className="mx-auto max-w-7xl mt-6">
        <div className="sm:flex sm:items-center sm:justify-between mb-6">
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Attendance Management</h1>
          <button
            onClick={handleAdd}
            className="mt-4 sm:mt-0 sm:ml-16 sm:flex-none inline-flex items-center justify-center rounded-md border border-transparent bg-blue-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-blue-700"
          >
            Add Attendance
          </button>
        </div>

        <div className="mb-4 flex gap-4">
          <input
            type="text"
            placeholder="Search by employee name"
            value={filterKeyword}
            onChange={(e) => setFilterKeyword(e.target.value)}
            className="border rounded-md px-3 py-2 w-64 focus:ring-2 focus:ring-blue-500"
          />
          <button
            onClick={() => setRefreshKey((prev) => prev + 1)}
            className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700"
          >
            Filter
          </button>
          <button
            onClick={() => {
              setFilterKeyword("");
              setRefreshKey((prev) => prev + 1);
            }}
            className="bg-gray-300 text-gray-800 px-4 py-2 rounded-md hover:bg-gray-400"
          >
            Clear Filter
          </button>
        </div>

        <AttendanceList
          key={refreshKey}
          fetchAttendances={fetchAttendances}
          onEdit={handleEdit}
          onDelete={handleDelete}
          itemsPerPage={5}
        />
      </div>

      {showCreateModal && (
        <AttendanceForm
          attendance={editingAttendance || undefined}
          onSubmit={handleSubmitForm}
          onClose={() => setShowCreateModal(false)}
          isSubmitting={isSubmitting}
        />
      )}
    </>
  );
}

export default function Attendances() {
  return (
    <ToastProvider>
      <AttendancesContent />
    </ToastProvider>
  );
}
