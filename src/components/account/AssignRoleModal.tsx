import { useState, useEffect } from "react";
import roleService from "../../services/roleService";
import { Role } from "../../types/role";
import { ApiResponse, AssignRoleRequest } from "../../types/account";

interface AssignRoleModalProps {
  userName: string;
  userRoles: string[]; // danh sách role hiện có của user
  onSubmit: (data: AssignRoleRequest) => void;
  onClose: () => void;
  isSubmitting?: boolean;
}

export default function AssignRoleModal({
  userName,
  userRoles,
  onSubmit,
  onClose,
  isSubmitting = false,
}: AssignRoleModalProps) {
  const [availableRoles, setAvailableRoles] = useState<Role[]>([]);
  const [selectedRoles, setSelectedRoles] = useState<string[]>(userRoles || []);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchRoles = async () => {
      try {
        const res: ApiResponse<Role[]> = await roleService.getRoles();
        if (res.success && res.data) {
          setAvailableRoles(res.data);
        }
      } finally {
        setLoading(false);
      }
    };
    fetchRoles();
  }, []);

  const toggleRole = (roleName: string) => {
    setSelectedRoles(prev =>
      prev.includes(roleName)
        ? prev.filter(r => r !== roleName)
        : [...prev, roleName]
    );
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit({ userName, roles: selectedRoles });
  };

  return (
    <div className="fixed inset-0 z-[9999999] flex items-center justify-center bg-black/40 backdrop-blur-sm" onClick={onClose}>
      <div
        className="bg-white dark:bg-gray-800 rounded-lg shadow-lg w-full max-w-md mx-4"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex justify-between items-center p-4 border-b border-gray-200 dark:border-gray-700">
          <h2 className="text-lg font-semibold text-gray-900 dark:text-white">Assign Roles</h2>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300">
            ✕
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          {loading ? (
            <p>Loading roles...</p>
          ) : (
            <div className="space-y-2 max-h-64 overflow-y-auto">
              {availableRoles.map(role => (
                <label key={role.name} className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    checked={selectedRoles.includes(role.name)}
                    onChange={() => toggleRole(role.name)}
                    className="w-4 h-4"
                  />
                  <span className="text-gray-700 dark:text-gray-300">{role.name}</span>
                </label>
              ))}
            </div>
          )}

          <div className="flex justify-end gap-3 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 border rounded-md text-gray-700 dark:text-gray-300"
              disabled={isSubmitting}
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSubmitting || loading}
              className="px-4 py-2 rounded-md bg-blue-600 text-white hover:bg-blue-700"
            >
              {isSubmitting ? "Assigning..." : "Assign"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
