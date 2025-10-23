import { useState, useCallback } from "react";
import PageMeta from "../../components/common/PageMeta";
import CustomerList from "../../components/customer/CustomerList";
import CustomerService from "../../services/customerService";
import { Customer, ApiResponse } from "../../types/customer";
import CustomerForm from "../../components/customer/CustomerForm";
import {
  ToastProvider,
  useToast,
} from "../../components/ui/toast/ToastProvider";
import { confirmDelete } from "../../components/ui/alert/ConfirmDialog";

function CustomersContent() {
  const [editingCustomer, setEditingCustomer] = useState<Customer | null>(null);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [filterName, setFilterName] = useState("");
  const [filterStatus, setFilterStatus] = useState("");
  const [refreshKey, setRefreshKey] = useState(0);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [filterNameInput, setFilterNameInput] = useState("");
  const [filterStatusInput, setFilterStatusInput] = useState("");

  const { addToast } = useToast(); // ✅ hook toast

  const fetchCustomers = useCallback(
    async (page: number, pageSize: number) => {
      try {
        const res = await CustomerService.getCustomers({
          Keyword: filterName || undefined,
          Status: filterStatus || undefined,
          PageIndex: page,
          PageSize: pageSize,
        });

        // check success và fallback
        if (!res.success) {
          addToast({
            type: "error",
            message: res.message || "Failed to fetch Customers",
          });
          return { data: [], totalItems: 0 };
        }

        return {
          data: res.data || [], // nếu data null thì trả về []
          totalItems: res.metaData?.totalItems || 0, // nếu metaData null thì 0
        };
      } catch (error) {
        console.error("Fetch Customer error:", error);
        addToast({ type: "error", message: "Failed to fetch Customer" });
        return { data: [], totalItems: 0 };
      }
    },
    [filterName, filterStatus]
  );

  const handleAdd = () => {
    setEditingCustomer(null);
    setShowCreateModal(true);
  };

  const handleEdit = (customer: Customer) => {
    setEditingCustomer(customer);
    setShowCreateModal(true);
  };

  const handleDelete = async (customerId: number) => {
    const result = await confirmDelete("Customer");

    if (!result.isConfirmed) return;

    try {
      const response = await CustomerService.deleteCustomer(customerId);

      if (response.success) {
        addToast({
          type: "success",
          message: "Customer deleted successfully!",
        });
        setRefreshKey((prev) => prev + 1);
      } else {
        addToast({
          type: "error",
          message: response.message || "Failed to delete customer",
        });
      }
    } catch (error: any) {
      console.error("Delete error:", error);
      addToast({
        type: "error",
        message: error.response?.data?.message || "Failed to delete customer",
      });
    }
  };

  const handleSubmitForm = async (data: {
    name: string;
    contact: string;
    address: string;
  }) => {
    if (isSubmitting) return;
    setIsSubmitting(true);

    try {
      let response: ApiResponse<Customer>;

      if (editingCustomer) {
        response = await CustomerService.updateCustomer(
          editingCustomer.customerId,
          data
        );
      } else {
        response = await CustomerService.createCustomer(data);
      }

      if (response.success) {
        addToast({
          type: "success",
          message: editingCustomer
            ? "Customer updated successfully!"
            : "Customer created successfully!",
        });
        setShowCreateModal(false);
        setRefreshKey((prev) => prev + 1);
      } else {
        addToast({
          type: "error",
          message: response.message || "Failed to save Customer",
        });
        setShowCreateModal(false);
      }
    } catch (error: any) {
      console.error("Submit error:", error);
      addToast({
        type: "error",
        message: error.response?.data?.message || "Failed to save Customer",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <>
      <PageMeta
        title="Customer Management | Admin Dashboard"
        description="Manage Customers"
      />

      <div className="mx-auto max-w-7xl mt-6">
        {/* Header */}
        <div className="sm:flex sm:items-center sm:justify-between mb-6">
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
            Customer Management
          </h1>
          <button
            onClick={handleAdd}
            className="mt-4 sm:mt-0 sm:ml-16 sm:flex-none inline-flex items-center justify-center rounded-md border border-transparent bg-blue-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
          >
            Add Customer
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
        <CustomerList
          key={refreshKey}
          fetchCustomers={fetchCustomers}
          onEdit={handleEdit}
          onDelete={handleDelete}
          itemsPerPage={5}
        />
      </div>

      {/* Create/Edit Modal */}
      {showCreateModal && (
        <CustomerForm
          customer={
            editingCustomer
              ? {
                  customerId: editingCustomer.customerId,
                  name: editingCustomer.name,
                  contact: editingCustomer.contact,
                  address: editingCustomer.address
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
      <CustomersContent />
    </ToastProvider>
  );
}
