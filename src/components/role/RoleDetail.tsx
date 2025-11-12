import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Permission } from "../../types/role";
import roleService from "../../services/roleService";
import { useToast, ToastProvider } from "../ui/toast/ToastProvider";
import { authService } from "../../services/authService";

function RoleDetailContent() {
  const { roleName } = useParams<{ roleName: string }>();
  const navigate = useNavigate();

  const [allPermissions, setAllPermissions] = useState<Permission[]>([]);
  const [assignedPermissions, setAssignedPermissions] = useState<string[]>([]);
  const [expandedGroups, setExpandedGroups] = useState<Record<string, boolean>>({});
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const { addToast } = useToast();

  useEffect(() => {
    async function fetchData() {
      try {
        const resAll = await roleService.getAllPermissions();
        const all = resAll.data || [];

        const resAssigned = await roleService.getPermissionsByRole(roleName!);
        const rawAssigned = resAssigned.data || [];

        const assignedNames = Array.isArray(rawAssigned)
          ? rawAssigned.map((p) => (typeof p === "object" && "name" in p ? p.name : p))
          : [];

        setAllPermissions(all);
        setAssignedPermissions(assignedNames);
      } catch (err) {
        console.error("❌ Fetch failed:", err);
        addToast({ type: "error", message: "Failed to load permissions" });
      } finally {
        setLoading(false);
      }
    }

    if (roleName) fetchData();
  }, [roleName]);

  const togglePermission = (perm: string) => {
    setAssignedPermissions((prev) =>
      prev.includes(perm) ? prev.filter((p) => p !== perm) : [...prev, perm]
    );
  };

  const savePermissions = async () => {
  setSaving(true);
  try {
    const res = await roleService.assignPermissions({
      roleName: roleName!,
      permissions: assignedPermissions,
    });

    if (res.success) {
      addToast({
        type: "success",
        message: "Permission assigned successfully!",
      });

      // 🔹 Log user trước khi refresh
      console.log("🔹 [Before refresh] Current user:", authService.getCurrentUser());

      // 🔄 Gọi API refresh user info
      console.log("🔹 Calling authService.refreshUser()...");
      await authService.refreshUser();

      // ⏳ Log user sau khi refresh
      const updatedUser = authService.getCurrentUser();
      console.log("✅ [After refresh] Updated user:", updatedUser);
    } else {
      addToast({
        type: "error",
        message: res.message || "Failed to assign permission",
      });
    }
  } catch (err) {
    console.error("❌ Failed to assign permission:", err);
    addToast({ type: "error", message: "Failed to assign permission" });
  } finally {
    setSaving(false);
  }
};

  const groupedPermissions = allPermissions.reduce((acc, perm) => {
    const [group] = perm.name.split("_");
    if (!acc[group]) acc[group] = [];
    acc[group].push(perm);
    return acc;
  }, {} as Record<string, Permission[]>);

  const toggleGroup = (group: string) => {
    setExpandedGroups((prev) => ({
      ...prev,
      [group]: !prev[group],
    }));
  };

  const removeAll = (group: string) => {
    const perms = groupedPermissions[group].map((p) => p.name);
    setAssignedPermissions((prev) => prev.filter((p) => !perms.includes(p)));
  };

  const selectAll = (group: string) => {
    const perms = groupedPermissions[group].map((p) => p.name);
    setAssignedPermissions((prev) => Array.from(new Set([...prev, ...perms])));
  };

  // ✅ Select all permissions across all groups
  const selectAllGlobal = () => {
    const allNames = allPermissions.map((p) => p.name);
    setAssignedPermissions(Array.from(new Set([...allNames])));
  };

  // ✅ Remove all permissions across all groups
  const removeAllGlobal = () => {
    setAssignedPermissions([]);
  };

  if (loading) return <div>Loading...</div>;

  return (
    <div className="p-4 bg-white dark:bg-gray-800 rounded-lg shadow">
      <h2 className="text-lg font-semibold mb-4">Role: {roleName}</h2>

      {/* ✅ Global controls */}
      <div className="flex items-center gap-4 mb-4">
        <button
          onClick={selectAllGlobal}
          className="px-3 py-1 text-sm bg-green-100 text-green-700 rounded hover:bg-green-200"
        >
          Select all permissions
        </button>
        <button
          onClick={removeAllGlobal}
          className="px-3 py-1 text-sm bg-red-100 text-red-700 rounded hover:bg-red-200"
        >
          Remove all permissions
        </button>
      </div>

      <div className="space-y-4">
        {Object.entries(groupedPermissions).map(([group, perms]) => {
          const selectedCount = perms.filter((p) =>
            assignedPermissions.includes(p.name)
          ).length;

          return (
            <div
              key={group}
              className="border border-gray-300 dark:border-gray-700 rounded-lg"
            >
              {/* Group header */}
              <button
                onClick={() => toggleGroup(group)}
                className="w-full flex justify-between items-center px-4 py-2 text-left hover:bg-gray-50 dark:hover:bg-gray-700 rounded-t-lg"
              >
                <div className="flex items-center space-x-2">
                  {/* ✅ Bỏ bold */}
                  <span className="text-gray-800 dark:text-gray-100">{group}</span>
                  <span className="text-green-600 bg-green-100 text-xs px-2 py-0.5 rounded-full">
                    {selectedCount}/{perms.length} permissions granted
                  </span>
                </div>
                <span className="text-sm text-gray-500">
                  {expandedGroups[group] ? "▲" : "▼"}
                </span>
              </button>

              {/* Permission list */}
              {expandedGroups[group] && (
                <div className="p-4 border-t border-gray-200 dark:border-gray-700">
                  <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-2">
                    {perms.map((p) => (
                      <label
                        key={p.name}
                        className="flex items-center space-x-2 text-sm"
                      >
                        <input
                          type="checkbox"
                          checked={assignedPermissions.includes(p.name)}
                          onChange={() => togglePermission(p.name)}
                          className="accent-green-600"
                        />
                        <span>{p.description || p.name}</span>
                      </label>
                    ))}
                  </div>

                  <div className="flex gap-4 mt-3">
                    <button
                      onClick={() => selectAll(group)}
                      className="text-green-600 text-sm hover:underline"
                    >
                      Select all
                    </button>
                    <button
                      onClick={() => removeAll(group)}
                      className="text-red-500 text-sm hover:underline"
                    >
                      Remove all
                    </button>
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>

      <div className="mt-6 flex justify-end space-x-3">
        <button
          onClick={() => navigate("/roles")}
          className="px-4 py-2 bg-gray-300 rounded hover:bg-gray-400"
          disabled={saving}
        >
          Cancel
        </button>

        <button
          onClick={savePermissions}
          disabled={saving}
          className={`px-4 py-2 rounded text-white flex items-center justify-center ${
            saving
              ? "bg-green-400 cursor-not-allowed"
              : "bg-green-600 hover:bg-green-700"
          }`}
        >
          {saving && (
            <svg
              className="animate-spin h-4 w-4 mr-2 text-white"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
            >
              <circle
                className="opacity-25"
                cx="12"
                cy="12"
                r="10"
                stroke="currentColor"
                strokeWidth="4"
              ></circle>
              <path
                className="opacity-75"
                fill="currentColor"
                d="M4 12a8 8 0 018-8v4l3.5-3.5L12 0v4a8 8 0 018 8h-4l3.5 3.5L20 12h-4a8 8 0 01-8 8v-4l-3.5 3.5L8 20v-4a8 8 0 01-8-8z"
              ></path>
            </svg>
          )}
          {saving ? "Saving..." : "Save"}
        </button>
      </div>
    </div>
  );
}

export default function RoleDetail() {
  return (
    <ToastProvider>
      <RoleDetailContent />
    </ToastProvider>
  );
}
