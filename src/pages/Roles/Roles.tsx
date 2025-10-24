import { useState, useCallback, useEffect } from "react";
import PageMeta from "../../components/common/PageMeta";
import RoleList from "../../components/role/RoleList";
import RoleForm from "../../components/role/RoleForm";
import roleService from "../../services/roleService";
import { Role, ApiResponse, UpdateRoleRequest } from "../../types/role";
import {
  ToastProvider,
  useToast,
} from "../../components/ui/toast/ToastProvider";
import { confirmDelete } from "../../components/ui/alert/ConfirmDialog";

function RolesContent() {
  const [roles, setRoles] = useState<Role[]>([]);
  const [editingRole, setEditingRole] = useState<Role | null>(null);
  const [showModal, setShowModal] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [filterName, setFilterName] = useState("");
  const [filterNameInput, setFilterNameInput] = useState("");
  const { addToast } = useToast();

  // ✅ Fetch tất cả role
  const fetchRoles = useCallback(async () => {
    try {
      const res = await roleService.getRoles();

      if (res.success) {
        setRoles(res.data || []);
      } else {
        addToast({
          type: "error",
          message: res.message || "Failed to load roles",
        });
        setRoles([]);
      }
    } catch (error) {
      console.error("Fetch roles error:", error);
      addToast({ type: "error", message: "Failed to load roles" });
      setRoles([]);
    }
  }, []);

  useEffect(() => {
    fetchRoles();
  }, [fetchRoles]);

  // ✅ Add role
  const handleAdd = () => {
    setEditingRole(null);
    setShowModal(true);
  };

  // ✅ Edit role
  const handleEdit = (role: Role) => {
    setEditingRole(role);
    setShowModal(true);
  };

  // ✅ Delete role
  const handleDelete = async (roleName: string) => {
    const result = await confirmDelete("Role");
    if (!result.isConfirmed) return;

    try {
      const response = await roleService.deleteRole(roleName);
      if (response.success) {
        addToast({ type: "success", message: "Role deleted successfully!" });
        fetchRoles();
      } else {
        addToast({
          type: "error",
          message: response.message || "Failed to delete role",
        });
      }
    } catch (error: any) {
      console.error("Delete error:", error);
      addToast({
        type: "error",
        message: error.response?.data?.message || "Failed to delete role",
      });
    }
  };

  // ✅ Submit form (Add/Update)
  const handleSubmitForm = async (data: { name: string; oldName?: string }) => {
    if (isSubmitting) return;
    setIsSubmitting(true);

    try {
      let response: ApiResponse<Role>;

      if (data.oldName) {
        // ⚙️ Nếu có oldName → Update
        const updateRequest: UpdateRoleRequest = {
          oldName: data.oldName,
          newName: data.name,
        };
        response = await roleService.updateRole(updateRequest);
      } else {
        // ➕ Nếu không có oldName → Create
        response = await roleService.addRole(data.name);
      }

      if (response.success) {
        addToast({
          type: "success",
          message: data.oldName
            ? "Role updated successfully!"
            : "Role created successfully!",
        });
        setShowModal(false);
        fetchRoles();
      } else {
        addToast({
          type: "error",
          message: response.message || "Failed to save role",
        });
      }
    } catch (error: any) {
      console.error("Submit error:", error);
      addToast({
        type: "error",
        message: error.response?.data?.message || "Failed to save role",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <>
      <PageMeta title="Role Management | Admin Dashboard" description="Manage roles" />

      <div className="mx-auto max-w-5xl mt-6">
        {/* Header */}
        <div className="sm:flex sm:items-center sm:justify-between mb-6">
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
            Role Management
          </h1>
          <button
            onClick={handleAdd}
            className="mt-4 sm:mt-0 sm:ml-16 sm:flex-none inline-flex items-center justify-center rounded-md border border-transparent bg-blue-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
          >
            Add Role
          </button>
        </div>

        {/* Filter */}
        <div className="mb-4 flex flex-wrap gap-4">
          <input
            type="text"
            placeholder="Search by role name"
            value={filterNameInput}
            onChange={(e) => setFilterNameInput(e.target.value)}
            className="border rounded-md px-3 py-2 w-64 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />

          <button
            onClick={() => setFilterName(filterNameInput)}
            className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700"
          >
            Filter
          </button>

          <button
            onClick={() => {
              setFilterName("");
              setFilterNameInput("");
            }}
            className="bg-gray-300 text-gray-800 px-4 py-2 rounded-md hover:bg-gray-400"
          >
            Clear
          </button>
        </div>

        {/* Role List */}
        <RoleList roles={roles} onEdit={handleEdit} onDelete={handleDelete} />
      </div>

      {/* Modal Form */}
      {showModal && (
        <RoleForm
          role={
            editingRole
              ? { id: editingRole.id, name: editingRole.name }
              : undefined
          }
          onSubmit={handleSubmitForm}
          onClose={() => setShowModal(false)}
          isSubmitting={isSubmitting}
        />
      )}
    </>
  );
}

export default function Roles() {
  return (
    <ToastProvider>
      <RolesContent />
    </ToastProvider>
  );
}
