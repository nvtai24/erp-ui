import { useState, useCallback } from "react";
import PageMeta from "../../components/common/PageMeta";
import ContractList from "../../components/contract/ContractList";
import contractService from "../../services/contractService";
import { Contract, ApiResponse } from "../../types/contract";
import ContractForm from "../../components/contract/ContractForm";
import { ToastProvider, useToast } from "../../components/ui/toast/ToastProvider";
import { confirmDelete } from "../../components/ui/alert/ConfirmDialog";

function ContractsContent() {
  const [editingContract, setEditingContract] = useState<Contract | null>(null);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [filterName, setFilterName] = useState("");
  const [refreshKey, setRefreshKey] = useState(0);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const { addToast } = useToast();

  const fetchContracts = useCallback(async (page: number, pageSize: number) => {
    try {
      const res = await contractService.getContracts({
        Keyword: filterName || undefined,
        PageIndex: page,
        PageSize: pageSize,
      });

      if (!res.success) {
        addToast({ type: "error", message: res.message || "Failed to fetch contracts" });
        return { data: [], totalItems: 0 };
      }

      return {
        data: res.data || [],
        totalItems: res.metaData?.totalItems || 0,
      };
    } catch (error) {
      console.error("Fetch contract error:", error);
      addToast({ type: "error", message: "Failed to fetch contracts" });
      return { data: [], totalItems: 0 };
    }
  }, [filterName]);

  const handleAdd = () => {
    setEditingContract(null);
    setShowCreateModal(true);
  };

  const handleEdit = (contract: Contract) => {
    setEditingContract(contract);
    setShowCreateModal(true);
  };

  const handleDelete = async (id: number) => {
    const result = await confirmDelete("Contract");
    if (!result.isConfirmed) return;

    try {
      const response = await contractService.deleteContract(id);
      if (response.success) {
        addToast({ type: "success", message: "Contract deleted successfully!" });
        setRefreshKey((prev) => prev + 1);
      } else {
        addToast({ type: "error", message: response.message || "Failed to delete contract" });
      }
    } catch (error: any) {
      console.error("Delete error:", error);
      addToast({
        type: "error",
        message: error.response?.data?.message || "Failed to delete contract",
      });
    }
  };

  const handleSubmitForm = async (data: Omit<Contract, "contractId" | "employeeName">) => {
    if (isSubmitting) return;
    setIsSubmitting(true);

    try {
      let response: ApiResponse<Contract>;

      if (editingContract) {
        response = await contractService.updateContract(editingContract.contractId, data);
      } else {
        response = await contractService.createContract(data);
      }

      if (response.success) {
        addToast({
          type: "success",
          message: editingContract ? "Contract updated successfully!" : "Contract created successfully!",
        });
        setShowCreateModal(false);
        setRefreshKey((prev) => prev + 1);
      } else {
        addToast({ type: "error", message: response.message || "Failed to save contract" });
      }
    } catch (error: any) {
      console.error("Submit error:", error);
      addToast({
        type: "error",
        message: error.response?.data?.message || "Failed to save contract",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <>
      <PageMeta title="Contract Management | Admin Dashboard" description="Manage Employee Contracts" />

      <div className="mx-auto max-w-7xl mt-6">
        {/* Header */}
        <div className="sm:flex sm:items-center sm:justify-between mb-6">
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Contract Management</h1>
          <button
            onClick={handleAdd}
            className="mt-4 sm:mt-0 sm:ml-16 sm:flex-none inline-flex items-center justify-center rounded-md border border-transparent bg-blue-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-blue-700"
          >
            Add Contract
          </button>
        </div>

        {/* Filter */}
        <div className="mb-4 flex gap-4">
          <input
            type="text"
            placeholder="Search by employee name"
            value={filterName}
            onChange={(e) => setFilterName(e.target.value)}
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
              setFilterName("");
              setRefreshKey((prev) => prev + 1);
            }}
            className="bg-gray-300 text-gray-800 px-4 py-2 rounded-md hover:bg-gray-400"
          >
            Clear Filter
          </button>
        </div>

        {/* List */}
        <ContractList
          key={refreshKey}
          fetchContracts={fetchContracts}
          onEdit={handleEdit}
          onDelete={handleDelete}
          itemsPerPage={5}
        />
      </div>

      {/* Form modal */}
      {showCreateModal && (
        <ContractForm
          contract={editingContract || undefined}
          onSubmit={handleSubmitForm}
          onClose={() => setShowCreateModal(false)}
          isSubmitting={isSubmitting}
        />
      )}
    </>
  );
}

export default function Contracts() {
  return (
    <ToastProvider>
      <ContractsContent />
    </ToastProvider>
  );
}
