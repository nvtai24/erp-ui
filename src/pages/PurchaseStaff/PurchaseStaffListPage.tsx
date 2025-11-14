// pages/PurchaseStaff/PurchaseStaffListPage.tsx
import { useState, useEffect } from "react";
import PageMeta from "../../components/common/PageMeta";
import Toast from "../../components/common/Toast";
import ConfirmDialog from "../../components/common/ConfirmDialog";
import { useToast } from "../../hooks/useToast";
import PurchaseStaffTable from "../../components/purchase-staff/PurchaseStaffTable";
import CreatePurchaseStaffModal from "../../components/purchase-staff/CreatePurchaseStaffModal";
import TransferWarehouseModal from "../../components/purchase-staff/TransferWarehouseModal";
import purchaseStaffService from "../../services/purchaseStaffService";
import employeeService from "../../services/employeeService";
import warehouseService from "../../services/warehouseService";
import { PurchaseStaff } from "../../types/purchaseStaff";
import { Employee } from "../../types/employee";
import { Warehouse } from "../../types/warehouse";

export default function PurchaseStaffListPage() {
  const { toast, showToast, hideToast } = useToast();
  const [purchaseStaffs, setPurchaseStaffs] = useState<PurchaseStaff[]>([]);
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [warehouses, setWarehouses] = useState<Warehouse[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Modals
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [transferModal, setTransferModal] = useState<{
    isOpen: boolean;
    staffId: number | null;
    currentWarehouseId: number | null;
  }>({ isOpen: false, staffId: null, currentWarehouseId: null });

  // Confirm Dialog
  const [confirmDialog, setConfirmDialog] = useState<{
    isOpen: boolean;
    staffId: number | null;
  }>({ isOpen: false, staffId: null });

  // Filters
  const [warehouseFilter, setWarehouseFilter] = useState<number | "">("");

  useEffect(() => {
    fetchEmployees();
    fetchWarehouses();
  }, []);

  useEffect(() => {
    fetchPurchaseStaffs();
  }, [warehouseFilter]);

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

  const fetchWarehouses = async () => {
    try {
      const response = await warehouseService.getWarehouses({});
      if (response.success && response.data) {
        setWarehouses(response.data);
      }
    } catch (error: any) {
      console.error("Fetch warehouses error:", error);
    }
  };

  const fetchPurchaseStaffs = async () => {
    setIsLoading(true);
    setError(null);
    try {
      let response;
      if (warehouseFilter) {
        response = await purchaseStaffService.getPurchaseStaffByWarehouse(
          Number(warehouseFilter)
        );
      } else {
        response = await purchaseStaffService.getAllPurchaseStaff();
      }

      if (response.success && response.data) {
        setPurchaseStaffs(Array.isArray(response.data) ? response.data : [response.data]);
      } else {
        setError(response.message || "Failed to fetch purchase staff");
      }
    } catch (error: any) {
      console.error("Fetch purchase staff error:", error);
      setError(
        error.response?.data?.message || "Failed to fetch purchase staff"
      );
    } finally {
      setIsLoading(false);
    }
  };

  const handleCreate = async (employeeId: number, warehouseId: number) => {
    try {
      const response = await purchaseStaffService.createPurchaseStaff({
        employeeId,
        warehouseId,
      });
      if (response.success) {
        showToast("Employee assigned to warehouse successfully!", "success");
        setIsCreateModalOpen(false);
        fetchPurchaseStaffs();
      } else {
        showToast(response.message || "Failed to assign employee", "error");
      }
    } catch (error: any) {
      console.error("Create purchase staff error:", error);
      showToast(
        error.response?.data?.message || "Failed to assign employee",
        "error"
      );
    }
  };

  const handleEdit = (staffId: number) => {
    const staff = purchaseStaffs.find((s) => s.staffId === staffId);
    if (staff) {
      setTransferModal({
        isOpen: true,
        staffId,
        currentWarehouseId: staff.warehouseId,
      });
    }
  };

  const handleTransfer = async (warehouseId: number) => {
    if (!transferModal.staffId) return;

    try {
      const response = await purchaseStaffService.updatePurchaseStaff(
        transferModal.staffId,
        { warehouseId }
      );
      if (response.success) {
        showToast("Employee transferred to new warehouse!", "success");
        setTransferModal({ isOpen: false, staffId: null, currentWarehouseId: null });
        fetchPurchaseStaffs();
      } else {
        showToast(response.message || "Failed to transfer employee", "error");
      }
    } catch (error: any) {
      console.error("Transfer purchase staff error:", error);
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
      const response = await purchaseStaffService.deletePurchaseStaff(
        confirmDialog.staffId
      );
      if (response.success) {
        showToast("Purchase staff removed successfully!", "success");
        fetchPurchaseStaffs();
      } else {
        showToast(response.message || "Failed to remove purchase staff", "error");
      }
    } catch (error: any) {
      console.error("Delete purchase staff error:", error);
      showToast(
        error.response?.data?.message || "Failed to remove purchase staff",
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
        title="Purchase Staff Management | ERP System"
        description="Manage warehouse staff assignments"
      />

      {toast && (
        <Toast message={toast.message} type={toast.type} onClose={hideToast} />
      )}

      <ConfirmDialog
        isOpen={confirmDialog.isOpen}
        title="Remove Purchase Staff"
        message="Are you sure you want to remove this employee from warehouse staff? This action cannot be undone."
        confirmText="Remove"
        cancelText="Cancel"
        type="danger"
        onConfirm={confirmDelete}
        onCancel={cancelDelete}
      />

      <CreatePurchaseStaffModal
        isOpen={isCreateModalOpen}
        employees={employees}
        warehouses={warehouses}
        onClose={() => setIsCreateModalOpen(false)}
        onCreate={handleCreate}
      />

      <TransferWarehouseModal
        isOpen={transferModal.isOpen}
        currentWarehouseId={transferModal.currentWarehouseId}
        warehouses={warehouses}
        onClose={() =>
          setTransferModal({ isOpen: false, staffId: null, currentWarehouseId: null })
        }
        onTransfer={handleTransfer}
      />

      <div className="mx-auto max-w-7xl mt-6">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
            Purchase Staff Management
          </h1>
          <button
            onClick={() => setIsCreateModalOpen(true)}
            className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 font-medium"
          >
            + Assign Employee to Warehouse
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
                Filter by Warehouse
              </label>
              <select
                value={warehouseFilter}
                onChange={(e) => setWarehouseFilter(e.target.value ? Number(e.target.value) : "")}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
              >
                <option value="">-- All Warehouses --</option>
                {warehouses.map((wh) => (
                  <option key={wh.warehouseId} value={wh.warehouseId}>
                    {wh.warehouseName}
                  </option>
                ))}
              </select>
            </div>
            <div className="flex items-end">
              <button
                onClick={() => setWarehouseFilter("")}
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
        <PurchaseStaffTable
          data={purchaseStaffs}
          isLoading={isLoading}
          onEdit={handleEdit}
          onDelete={handleDelete}
          itemsPerPage={10}
        />
      </div>
    </>
  );
}

