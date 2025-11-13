import { useEffect, useState } from "react";
import { Attendance } from "../../types/attendance";
import { Edit, Trash2 } from "lucide-react";

interface AttendanceListProps {
  fetchAttendances: (page: number, pageSize: number) => Promise<{ data: Attendance[]; totalItems: number }>;
  onEdit?: (attendance: Attendance) => void;
  onDelete?: (attendanceId: number) => void;
  itemsPerPage?: number;
}

export default function AttendanceList({
  fetchAttendances,
  onEdit,
  onDelete,
  itemsPerPage = 10,
}: AttendanceListProps) {
  const [data, setData] = useState<Attendance[]>([]);
  const [loading, setLoading] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalItems, setTotalItems] = useState(0);

  const totalPages = Math.ceil(totalItems / itemsPerPage);

  useEffect(() => {
    const load = async () => {
      setLoading(true);
      try {
        const res = await fetchAttendances(currentPage, itemsPerPage);
        setData(res.data);
        setTotalItems(res.totalItems);
      } finally {
        setLoading(false);
      }
    };
    load();
  }, [currentPage, fetchAttendances, itemsPerPage]);

  if (loading)
    return (
      <div className="flex justify-center items-center h-32">
        <div className="animate-spin h-8 w-8 border-b-2 border-blue-600 rounded-full"></div>
      </div>
    );

  if (!data.length) return <div className="text-center py-10">No attendance records found.</div>;

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow overflow-hidden">
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
          <thead className="bg-gray-50 dark:bg-gray-700">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">#</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Employee</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Work Date</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Days Off</th>
              <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">Actions</th>
            </tr>
          </thead>
          <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
            {data.map((item, i) => (
              <tr key={item.attendanceId} className="hover:bg-gray-50 dark:hover:bg-gray-700">
                <td className="px-6 py-4 text-sm">{i + 1}</td>
                <td className="px-6 py-4 text-sm">{item.employeeName}</td>
                <td className="px-6 py-4 text-sm">{new Date(item.workDate).toLocaleDateString("vi-VN")}</td>
                <td className="px-6 py-4 text-sm">{item.status}</td>
                <td className="px-6 py-4 text-sm">{item.daysOff}</td>
                <td className="px-6 py-4 text-right text-sm">
                  <button onClick={() => onEdit?.(item)} className="text-blue-600 mr-3">
                    <Edit size={18} />
                  </button>
                  <button onClick={() => onDelete?.(item.attendanceId)} className="text-red-600">
                    <Trash2 size={18} />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="p-4 flex justify-between items-center border-t dark:border-gray-700">
          <span className="text-sm text-gray-700 dark:text-gray-300">
            Showing {(currentPage - 1) * itemsPerPage + 1}–
            {Math.min(currentPage * itemsPerPage, totalItems)} of {totalItems}
          </span>
          <div>
            <button
              onClick={() => setCurrentPage((p) => Math.max(p - 1, 1))}
              disabled={currentPage === 1}
              className="px-3 py-1 border rounded mr-2 disabled:opacity-50"
            >
              Prev
            </button>
            <button
              onClick={() => setCurrentPage((p) => Math.min(p + 1, totalPages))}
              disabled={currentPage === totalPages}
              className="px-3 py-1 border rounded disabled:opacity-50"
            >
              Next
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
