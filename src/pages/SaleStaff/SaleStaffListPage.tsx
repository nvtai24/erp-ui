// pages/SaleStaff/SaleStaffListPage.tsx
import { useState, useEffect } from "react";
import PageMeta from "../../components/common/PageMeta";
import Toast from "../../components/common/Toast";
import ConfirmDialog from "../../components/common/ConfirmDialog";
import { useToast } from "../../hooks/useToast";
import SaleStaffTable from "../../components/sale-staff/SaleStaffTable";
import CreateSaleStaffModal from "../../components/sale-staff/CreateSaleStaffModal";
import TransferStoreModal from "../../components/sale-staff/TransferStoreModal";
import saleStaffService from "../../services/saleStaffService";
import employeeService from "../../services/employeeService";
import storeService from "../../services/storeService";
import { SaleStaff } from "../../types/saleStaff";
import { Employee } from "../../types/employee";
import { Store } from "../../types/store";

export default function SaleStaffListPage() {
  const { toast, showToast, hideToast } = useToast();
  const [saleStaffs, setSaleStaffs] = useState<SaleStaff[]>([]);
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [stores, setStores] = useState<Store[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Modals
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [transferModal, setTransferModal] = useState<{
    isOpen: boolean;
    staffId: number | null;
    currentStoreId: number | null;
  }>({ isOpen: false, staffId: null, currentStoreId: null });

  // Confirm Dialog
  const [confirmDialog, setConfirmDialog] = useState<{
    isOpen: boolean;
    staffId: number | null;
  }>({ isOpen: false, staffId: null });

  // Filters
  const [storeFilter, setStoreFilter] = useState<number | "">("");

  useEffect(() => {
    fetchEmployees();
    fetchStores();
  }, []);

  useEffect(() => {
    fetchSaleStaffs();
  }, [storeFilter]);

  const fetchEmployees = async () => {
    try {
      const response = await employeeService.getEmployees({
        pageNumber: 1,
        pageSize: 1000,
      });
      if (response.success && response.data) {
        setEmployees(response.data);
      }
    } catch (error: any) {
      console.error("Fetch employees error:", error);
    }
  };

  const fetchStores = async () => {
    try {
      const response = await storeService.getAllStores();
      if (response.success && response.data) {
        setStores(response.data);
      }
    } catch (error: any) {
      console.error("Fetch stores error:", error);
    }
  };

  const fetchSaleStaffs = async () => {
    setIsLoading(true);
    setError(null);
    try {
      let response;
      if (storeFilter) {
        response = await saleStaffService.getSaleStaffByStore(
          Number(storeFilter)
        );
      } else {
        response = await saleStaffService.getAllSaleStaff();
      }

      if (response.success && response.data) {
        setSaleStaffs(Array.isArray(response.data) ? response.data : [response.data]);
      } else {
        setError(response.message || "Failed to fetch sale staff");
      }
    } catch (error: any) {
      console.error("Fetch sale staff error:", error);
      setError(error.response?.data?.message || "Failed to fetch sale staff");
    } finally {
      setIsLoading(false);
    }
  };

  const handleCreate = async (employeeId: number, storeId: number) => {
    try {
      const response = await saleStaffService.createSaleStaff({
        employeeId,
        storeId,
      });
      if (response.success) {
        showToast("Employee assigned to store successfully!", "success");
        setIsCreateModalOpen(false);
        fetchSaleStaffs();
      } else {
        showToast(response.message || "Failed to assign employee", "error");
      }
    } catch (error: any) {
      console.error("Create sale staff error:", error);
      showToast(
        error.response?.data?.message || "Failed to assign employee",
        "error"
      );
    }
  };

  const handleEdit = (staffId: number) => {
    const staff = saleStaffs.find((s) => s.staffId === staffId);
    if (staff) {
      setTransferModal({
        isOpen: true,
        staffId,
        currentStoreId: staff.storeId,
      });
    }
  };

  const handleTransfer = async (storeId: number) => {
    if (!transferModal.staffId) return;

    try {
      const response = await saleStaffService.updateSaleStaff(
        transferModal.staffId,
        { storeId }
      );
      if (response.success) {
        showToast("Employee transferred to new store!", "success");
        setTransferModal({ isOpen: false, staffId: null, currentStoreId: null });
        fetchSaleStaffs();
      } else {
        showToast(response.message || "Failed to transfer employee", "error");
      }
    } catch (error: any) {
      console.error("Transfer sale staff error:", error);
      showToast(
        error.response?.data?.message || "Failed to transfer employee",
        "error"
      );
    }
  };

  const handleDelete = (staffId: number) => {
    setConfirmDialog({ isOpen: true, staffId });
  };

  const confirmDelete = async () => {
    if (!confirmDialog.staffId) return;

    try {
      const response = await saleStaffService.deleteSaleStaff(
        confirmDialog.staffId
      );
      if (response.success) {
        showToast("Sale staff removed successfully!", "success");
        fetchSaleStaffs();
      } else {
        showToast(response.message || "Failed to remove sale staff", "error");
      }
    } catch (error: any) {
      console.error("Delete sale staff error:", error);
      showToast(
        error.response?.data?.message || "Failed to remove sale staff",
        "error"
      );
    } finally {
      setConfirmDialog({ isOpen: false, staffId: null });
    }
  };

  const cancelDelete = () => {
    setConfirmDialog({ isOpen: false, staffId: null });
  };

  return (
    <>
      <PageMeta
        title="Sale Staff Management | ERP System"
        description="Manage store sales staff assignments"
      />

      {toast && (
        <Toast message={toast.message} type={toast.type} onClose={hideToast} />
      )}

      <ConfirmDialog
        isOpen={confirmDialog.isOpen}
        title="Remove Sale Staff"
        message="Are you sure you want to remove this employee from sales staff? This action cannot be undone."
        confirmText="Remove"
        cancelText="Cancel"
        type="danger"
        onConfirm={confirmDelete}
        onCancel={cancelDelete}
      />

      <CreateSaleStaffModal
        isOpen={isCreateModalOpen}
        employees={employees}
        stores={stores}
        onClose={() => setIsCreateModalOpen(false)}
        onCreate={handleCreate}
      />

      <TransferStoreModal
        isOpen={transferModal.isOpen}
        currentStoreId={transferModal.currentStoreId}
        stores={stores}
        onClose={() =>
          setTransferModal({ isOpen: false, staffId: null, currentStoreId: null })
        }
        onTransfer={handleTransfer}
      />

      <div className="mx-auto max-w-7xl mt-6">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
            Sale Staff Management
          </h1>
          <button
            onClick={() => setIsCreateModalOpen(true)}
            className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 font-medium"
          >
            + Assign Employee to Store
          </button>
        </div>

        {/* Filters */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6 mb-6">
          <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
            Filters
          </h2>
          <div className="flex gap-4">
            <div className="flex-1">
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Filter by Store
              </label>
              <select
                value={storeFilter}
                onChange={(e) => setStoreFilter(e.target.value ? Number(e.target.value) : "")}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
              >
                <option value="">-- All Stores --</option>
                {stores.map((store) => (
                  <option key={store.storeId} value={store.storeId}>
                    {store.storeName}
                  </option>
                ))}
              </select>
            </div>
            <div className="flex items-end">
              <button
                onClick={() => setStoreFilter("")}
                className="px-4 py-2 bg-gray-200 dark:bg-gray-600 text-gray-900 dark:text-white rounded hover:bg-gray-300 dark:hover:bg-gray-500 font-medium"
              >
                Clear Filter
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
          <SaleStaffTable
            data={saleStaffs}
            isLoading={isLoading}
            onEdit={handleEdit}
            onDelete={handleDelete}
          />
        </div>
      </div>
    </>
  );
}

