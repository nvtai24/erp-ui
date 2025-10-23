import { useState, useCallback } from "react";
import PageMeta from "../../components/common/PageMeta";
import SupplierList from "../../components/supplier/SupplierList";
import SupplierService from "../../services/supplierService";
import { Supplier, ApiResponse } from "../../types/supplier";
import SupplierForm from "../../components/supplier/SupplierForm";
import {
  ToastProvider,
  useToast,
} from "../../components/ui/toast/ToastProvider";
import { confirmDelete } from "../../components/ui/alert/ConfirmDialog";

function SuppliersContent() {
  const [editingSupplier, setEditingSupplier] = useState<Supplier | null>(null);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [filterName, setFilterName] = useState("");
  const [filterStatus, setFilterStatus] = useState("");
  const [refreshKey, setRefreshKey] = useState(0);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [filterNameInput, setFilterNameInput] = useState("");
  const [filterStatusInput, setFilterStatusInput] = useState("");

  const { addToast } = useToast(); // ✅ hook toast

  const fetchSuppliers = useCallback(
    async (page: number, pageSize: number) => {
      try {
        const res = await SupplierService.getSuppliers({
          Keyword: filterName || undefined,
          Status: filterStatus || undefined,
          PageIndex: page,
          PageSize: pageSize,
        });

        // check success và fallback
        if (!res.success) {
          addToast({
            type: "error",
            message: res.message || "Failed to fetch Suppliers",
          });
          return { data: [], totalItems: 0 };
        }

        return {
          data: res.data || [], // nếu data null thì trả về []
          totalItems: res.metaData?.totalItems || 0, // nếu metaData null thì 0
        };
      } catch (error) {
        console.error("Fetch Supplier error:", error);
        addToast({ type: "error", message: "Failed to fetch Supplier" });
        return { data: [], totalItems: 0 };
      }
    },
    [filterName, filterStatus]
  );

  const handleAdd = () => {
    setEditingSupplier(null);
    setShowCreateModal(true);
  };

  const handleEdit = (supplier: Supplier) => {
    setEditingSupplier(supplier);
    setShowCreateModal(true);
  };

  const handleDelete = async (supplierId: number) => {
    const result = await confirmDelete("Supplier");

    if(!result.isConfirmed) return;

    try {
      const response = await SupplierService.deleteSupplier(supplierId);

      if (response.success) {
        addToast({
          type: "success",
          message: "Supplier deleted successfully!",
        });
        setRefreshKey((prev) => prev + 1);
      } else {
        addToast({
          type: "error",
          message: response.message || "Failed to delete supplier",
        });
      }
    } catch (error: any) {
      console.error("Delete error:", error);
      addToast({
        type: "error",
        message: error.response?.data?.message || "Failed to delete supplier",
      });
    }
  };

  const handleSubmitForm = async (data: {
    supplierName: string;
    contact: string;
    address: string;
  }) => {
    if (isSubmitting) return;
    setIsSubmitting(true);

    try {
      let response: ApiResponse<Supplier>;

      if (editingSupplier) {
        response = await SupplierService.updateSupplier(
          editingSupplier.supplierId,
          data
        );
      } else {
        response = await SupplierService.createSupplier(data);
      }

      if (response.success) {
        addToast({
          type: "success",
          message: editingSupplier
            ? "Supplier updated successfully!"
            : "Supplier created successfully!",
        });
        setShowCreateModal(false);
        setRefreshKey((prev) => prev + 1);
      } else {
        addToast({
          type: "error",
          message: response.message || "Failed to save Supplier",
        });
        setShowCreateModal(false);
      }
    } catch (error: any) {
      console.error("Submit error:", error);
      addToast({
        type: "error",
        message: error.response?.data?.message || "Failed to save Supplier",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <>
      <PageMeta
        title="Supplier Management | Admin Dashboard"
        description="Manage Suppliers"
      />

      <div className="mx-auto max-w-7xl mt-6">
        {/* Header */}
        <div className="sm:flex sm:items-center sm:justify-between mb-6">
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
            Supplier Management
          </h1>
          <button
            onClick={handleAdd}
            className="mt-4 sm:mt-0 sm:ml-16 sm:flex-none inline-flex items-center justify-center rounded-md border border-transparent bg-blue-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
          >
            Add Supplier
          </button>
        </div>

        {/* Filter Form */}
        <div className="mb-4 flex flex-wrap gap-4">
          <input
            type="text"
            placeholder="Search by name"
            value={filterNameInput}
            onChange={(e) => setFilterNameInput(e.target.value)}
            className="border rounded-md px-3 py-2 w-64 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />

          {/* <select
            value={filterStatusInput}
            onChange={(e) => setFilterStatusInput(e.target.value)}
            className="border rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="">All Status</option>
            <option value="active">Active</option>
            <option value="inactive">Inactive</option>
          </select> */}

          <button
            onClick={() => {
              setFilterName(filterNameInput);
              setFilterStatus(filterStatusInput);
              setRefreshKey((prev) => prev + 1);
            }}
            className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700"
          >
            Filter
          </button>

          <button
            onClick={() => {
              setFilterName("");
              setFilterStatus("");
              setFilterNameInput("");
              setFilterStatusInput("");
              setRefreshKey((prev) => prev + 1);
            }}
            className="bg-gray-300 text-gray-800 px-4 py-2 rounded-md hover:bg-gray-400"
          >
            Clear Filter
          </button>
        </div>

        {/* Category List */}
        <SupplierList
          key={refreshKey}
          fetchSuppliers={fetchSuppliers}
          onEdit={handleEdit}
          onDelete={handleDelete}
          itemsPerPage={5}
        />
      </div>

      {/* Create/Edit Modal */}
      {showCreateModal && (
        <SupplierForm
          supplier={
            editingSupplier
              ? {
                  supplierId: editingSupplier.supplierId,
                  supplierName: editingSupplier.supplierName,
                  contact: editingSupplier.contact,
                  address: editingSupplier.address,
                }
              : undefined
          }
          onSubmit={handleSubmitForm}
          onClose={() => setShowCreateModal(false)}
          isSubmitting={isSubmitting}
        />
      )}
    </>
  );
}

// Wrap page với ToastProvider
export default function Categories() {
  return (
    <ToastProvider>
      <SuppliersContent />
    </ToastProvider>
  );
}
