// pages/Payrolls/payroll.tsx
import { useState, useCallback } from "react";
import PageMeta from "../../components/common/PageMeta";
import PayrollList from "../../components/payroll/PayrollList";
import payrollService from "../../services/payrollService";
import { Payroll, ApiResponse, PayrollCalculateModel } from "../../types/payroll";
import PayrollForm from "../../components/payroll/PayrollForm";
import {
  ToastProvider,
  useToast,
} from "../../components/ui/toast/ToastProvider";
import { confirmDelete } from "../../components/ui/alert/ConfirmDialog";

function PayrollsContent() {
  const [viewingPayroll, setViewingPayroll] = useState<Payroll | null>(null);
  const [showCalculateModal, setShowCalculateModal] = useState(false);
  const [showDetailModal, setShowDetailModal] = useState(false);
  const [filterKeyword, setFilterKeyword] = useState("");
  const [refreshKey, setRefreshKey] = useState(0);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [filterKeywordInput, setFilterKeywordInput] = useState("");

  const { addToast } = useToast();

  const fetchPayrolls = useCallback(
    async (page: number, pageSize: number) => {
      try {
        const res = await payrollService.getPayrolls({
          Keyword: filterKeyword || undefined,
          PageIndex: page,
          PageSize: pageSize,
        });

        if (!res.success) {
          addToast({
            type: "error",
            message: res.message || "Failed to fetch payrolls",
          });
          return { data: [], totalItems: 0 };
        }

        return {
          data: res.data || [],
          totalItems: res.metaData?.totalItems || 0,
        };
      } catch (error) {
        console.error("Fetch payroll error:", error);
        addToast({ type: "error", message: "Failed to fetch payroll" });
        return { data: [], totalItems: 0 };
      }
    },
    [filterKeyword]
  );

  const handleCalculate = () => {
    setShowCalculateModal(true);
  };

  const handleView = async (payroll: Payroll) => {
    try {
      const response = await payrollService.getPayrollById(payroll.payrollId);
      if (response.success && response.data) {
        setViewingPayroll(response.data);
        setShowDetailModal(true);
      } else {
        addToast({
          type: "error",
          message: response.message || "Failed to fetch payroll details",
        });
      }
    } catch (error: any) {
      console.error("View error:", error);
      addToast({
        type: "error",
        message: error.response?.data?.message || "Failed to fetch payroll details",
      });
    }
  };

  const handleDelete = async (payrollId: number) => {
    const result = await confirmDelete("Payroll record");

    if (!result.isConfirmed) return;

    try {
      const response = await payrollService.deletePayroll(payrollId);

      if (response.success) {
        addToast({
          type: "success",
          message: "Payroll deleted successfully!",
        });
        setRefreshKey((prev) => prev + 1);
      } else {
        addToast({
          type: "error",
          message: response.message || "Failed to delete payroll",
        });
      }
    } catch (error: any) {
      console.error("Delete error:", error);
      addToast({
        type: "error",
        message: error.response?.data?.message || "Failed to delete payroll",
      });
    }
  };

  const handleSubmitCalculate = async (data: PayrollCalculateModel) => {
    if (isSubmitting) return;
    setIsSubmitting(true);

    try {
      const response = await payrollService.calculatePayroll(data);

      if (response.success) {
        addToast({
          type: "success",
          message: "Payroll calculated successfully!",
        });
        setShowCalculateModal(false);
        setRefreshKey((prev) => prev + 1);
      } else {
        addToast({
          type: "error",
          message: response.message || "Failed to calculate payroll",
        });
      }
    } catch (error: any) {
      console.error("Calculate error:", error);
      addToast({
        type: "error",
        message: error.response?.data?.message || "Failed to calculate payroll",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('vi-VN', {
      style: 'currency',
      currency: 'VND'
    }).format(amount);
  };

  const getMonthName = (month: number) => {
    return new Date(2000, month - 1).toLocaleString('default', { month: 'long' });
  };

  return (
    <>
      <PageMeta
        title="Payroll Management | Admin Dashboard"
        description="Manage Payrolls"
      />

      <div className="mx-auto max-w-7xl mt-6">
        {/* Header */}
        <div className="sm:flex sm:items-center sm:justify-between mb-6">
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
            Payroll Management
          </h1>
          <button
            onClick={handleCalculate}
            className="mt-4 sm:mt-0 sm:ml-16 sm:flex-none inline-flex items-center justify-center rounded-md border border-transparent bg-blue-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
          >
            Calculate Payroll
          </button>
        </div>

        {/* Filter Form */}
        <div className="mb-4 flex flex-wrap gap-4">
          <input
            type="text"
            placeholder="Search by employee name"
            value={filterKeywordInput}
            onChange={(e) => setFilterKeywordInput(e.target.value)}
            className="border rounded-md px-3 py-2 w-64 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />

          <button
            onClick={() => {
              setFilterKeyword(filterKeywordInput);
              setRefreshKey((prev) => prev + 1);
            }}
            className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700"
          >
            Filter
          </button>

          <button
            onClick={() => {
              setFilterKeyword("");
              setFilterKeywordInput("");
              setRefreshKey((prev) => prev + 1);
            }}
            className="bg-gray-300 text-gray-800 px-4 py-2 rounded-md hover:bg-gray-400"
          >
            Clear Filter
          </button>
        </div>

        {/* Payroll List */}
        <PayrollList
          key={refreshKey}
          fetchPayrolls={fetchPayrolls}
          onView={handleView}
          onDelete={handleDelete}
          itemsPerPage={5}
        />
      </div>

      {/* Calculate Modal */}
      {showCalculateModal && (
        <PayrollForm
          onSubmit={handleSubmitCalculate}
          onClose={() => setShowCalculateModal(false)}
          isSubmitting={isSubmitting}
        />
      )}

      {/* Detail Modal */}
      {showDetailModal && viewingPayroll && (
        <div
          className="fixed inset-0 z-[99999999] flex items-center justify-center bg-gray-900/50 backdrop-blur-sm"
          onClick={() => setShowDetailModal(false)}
        >
          <div
            className="bg-white dark:bg-gray-800 rounded-lg shadow-xl w-full max-w-2xl mx-4"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header */}
            <div className="flex items-center justify-between p-6 border-b border-gray-200 dark:border-gray-700">
              <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
                Payroll Details
              </h2>
              <button
                onClick={() => setShowDetailModal(false)}
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

            {/* Content */}
            <div className="p-6 space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-500 dark:text-gray-400">
                    Employee Name
                  </label>
                  <p className="mt-1 text-base text-gray-900 dark:text-white font-semibold">
                    {viewingPayroll.employeeName}
                  </p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-500 dark:text-gray-400">
                    Period
                  </label>
                  <p className="mt-1 text-base text-gray-900 dark:text-white">
                    {getMonthName(viewingPayroll.month)} {viewingPayroll.year}
                  </p>
                </div>
              </div>

              <div className="border-t border-gray-200 dark:border-gray-700 pt-4">
                <div className="space-y-3">
                  <div className="flex justify-between">
                    <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                      Basic Salary
                    </span>
                    <span className="text-sm text-gray-900 dark:text-white font-semibold">
                      {formatCurrency(viewingPayroll.basicSalary)}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                      Deductions
                    </span>
                    <span className="text-sm text-red-600 dark:text-red-400 font-semibold">
                      -{formatCurrency(viewingPayroll.deductions)}
                    </span>
                  </div>
                  <div className="border-t border-gray-200 dark:border-gray-700 pt-3 flex justify-between">
                    <span className="text-base font-bold text-gray-900 dark:text-white">
                      Net Pay
                    </span>
                    <span className="text-base font-bold text-green-600 dark:text-green-400">
                      {formatCurrency(viewingPayroll.netPay)}
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* Footer */}
            <div className="flex justify-end gap-3 p-6 border-t border-gray-200 dark:border-gray-700">
              <button
                onClick={() => setShowDetailModal(false)}
                className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 dark:bg-gray-700 dark:text-gray-300 dark:border-gray-600 dark:hover:bg-gray-600"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

// Wrap page với ToastProvider
export default function Payrolls() {
  return (
    <ToastProvider>
      <PayrollsContent />
    </ToastProvider>
  );
}