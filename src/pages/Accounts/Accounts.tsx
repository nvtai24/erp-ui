import { useState, useCallback } from "react";
import PageMeta from "../../components/common/PageMeta";
import AccountList from "../../components/account/AccountList";
import AccountForm from "../../components/account/AccountForm";
import ChangePasswordModal from "../../components/account/ChangePasswordModal";
import accountService from "../../services/accountService";
import { authService } from "../../services/authService";
import {
  Account,
  RegisterRequest,
  UpdateAccountRequest,
  ChangePasswordRequest,
  AssignRoleRequest,
} from "../../types/account";
import {
  ToastProvider,
  useToast,
} from "../../components/ui/toast/ToastProvider";
import { confirmDelete } from "../../components/ui/alert/ConfirmDialog";
import AssignRoleModal from "../../components/account/AssignRoleModal";

function AccountsContent() {
  const [showForm, setShowForm] = useState(false);
  const [editingAccount, setEditingAccount] = useState<Account | null>(null);
  const [showChangePassword, setShowChangePassword] = useState(false);
  const [selectedAccount, setSelectedAccount] = useState<Account | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showAssignRole, setShowAssignRole] = useState(false);
  const [filterKeyword, setFilterKeyword] = useState("");
  const [filterKeywordInput, setFilterKeywordInput] = useState("");
  const [refreshKey, setRefreshKey] = useState(0);
  const { addToast } = useToast();

  const fetchAccounts = useCallback(
    async (page: number, pageSize: number) => {
      try {
        const res = await accountService.getAccountsWithRoles({
          Keyword: filterKeyword || undefined,
          PageIndex: page,
          PageSize: pageSize,
        });

        if (!res.success) {
          addToast({
            type: "error",
            message: res.message || "Failed to fetch accounts",
          });
          return { data: [], totalItems: 0 };
        }

        return {
          data: res.data || [],
          totalItems: res.metaData?.totalItems || 0,
        };
      } catch (error) {
        console.error("Fetch accounts error:", error);
        addToast({ type: "error", message: "Failed to fetch accounts" });
        return { data: [], totalItems: 0 };
      }
    },
    [filterKeyword]
  );

  const handleAdd = () => {
    setEditingAccount(null);
    setShowForm(true);
  };

  const handleEdit = (acc: Account) => {
    setEditingAccount(acc);
    setShowForm(true);
  };

  const handleDelete = async (userName: string) => {
    const result = await confirmDelete("Account");
    if (!result.isConfirmed) return;

    setIsSubmitting(true);
    try {
      const res = await accountService.deleteAccount(userName);
      if (res.success) {
        addToast({ type: "success", message: `Deleted ${userName}` });
        setRefreshKey((prev) => prev + 1);
      } else {
        addToast({ type: "error", message: res.message });
      }
    } catch {
      addToast({ type: "error", message: "Failed to delete account" });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleSubmitForm = async (data: any) => {
    if (isSubmitting) return;
    setIsSubmitting(true);

    try {
      if (editingAccount) {
        const updateData: UpdateAccountRequest = {
          userName: editingAccount.userName,
          email: data.email,
          phoneNumber: data.phoneNumber,
        };
        const res = await accountService.updateAccount(updateData);
        if (res.success) {
          addToast({ type: "success", message: "Account updated!" });
          setShowForm(false);
          setRefreshKey((prev) => prev + 1);
        } else {
          addToast({ type: "error", message: res.message });
        }
      } else {
        const registerData: RegisterRequest = {
          userName: data.userName,
          password: data.password!,
          email: data.email,
          phoneNumber: data.phoneNumber,
        };
        const res = await accountService.register(registerData);
        if (res.success) {
          addToast({ type: "success", message: "Account created!" });
          setShowForm(false);
          setRefreshKey((prev) => prev + 1);
        } else {
          addToast({ type: "error", message: res.message });
        }
      }
    } catch {
      addToast({ type: "error", message: "API call failed" });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleChangePassword = async (data: any) => {
    setIsSubmitting(true);
    try {
      const req: ChangePasswordRequest = {
        userName: selectedAccount!.userName,
        oldPassword: data.oldPassword,
        newPassword: data.newPassword,
      };
      const res = await accountService.changePassword(req);
      if (res.success) {
        addToast({
          type: "success",
          message: "Password changed successfully!",
        });
        setShowChangePassword(false);
      } else {
        addToast({ type: "error", message: res.message });
      }
    } catch {
      addToast({ type: "error", message: "Failed to change password" });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleAssignRole = async (data: AssignRoleRequest) => {
    setIsSubmitting(true);
    try {
      console.log(
        "🔹 [Before refresh] Current user:",
        authService.getCurrentUser()
      );

      const res = await accountService.assignRole(data);
      if (res.success) {
        addToast({ type: "success", message: "Roles assigned successfully!" });

        // 🔄 Gọi API để cập nhật lại user info
        console.log("🔹 Calling authService.refreshUser()...");
        await authService.refreshUser();

        // ⏳ Đợi 1 chút để localStorage cập nhật rồi log
        const updatedUser = authService.getCurrentUser();
        console.log("✅ [After refresh] Updated user:", updatedUser);

        setShowAssignRole(false);
        setRefreshKey((prev) => prev + 1);
      } else {
        addToast({ type: "error", message: res.message });
      }
    } catch (error) {
      console.error("❌ Failed to assign roles:", error);
      addToast({ type: "error", message: "Failed to assign roles" });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <>
      <PageMeta
        title="Account Management | Admin Dashboard"
        description="Manage user accounts"
      />

      <div className="mx-auto max-w-7xl mt-6">
        {/* Header */}
        <div className="sm:flex sm:items-center sm:justify-between mb-6">
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
            Account Management
          </h1>
          <button
            onClick={handleAdd}
            className="mt-4 sm:mt-0 sm:ml-16 sm:flex-none inline-flex items-center justify-center rounded-md border border-transparent bg-blue-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
          >
            Add Account
          </button>
        </div>

        {/* Filter Form */}
        <div className="mb-4 flex flex-wrap gap-4">
          <input
            type="text"
            placeholder="Search by username, email or phone"
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

        {/* Account List with Pagination */}
        <AccountList
          key={refreshKey}
          fetchAccounts={fetchAccounts}
          onEdit={handleEdit}
          onChangePassword={(acc) => {
            setSelectedAccount(acc);
            setShowChangePassword(true);
          }}
          onDelete={handleDelete}
          onAssignRole={(acc: Account) => {
            setSelectedAccount(acc);
            setShowAssignRole(true);
          }}
          itemsPerPage={10}
        />
      </div>

      {showForm && (
        <AccountForm
          account={editingAccount || undefined}
          onSubmit={handleSubmitForm}
          onClose={() => setShowForm(false)}
          isSubmitting={isSubmitting}
        />
      )}

      {showChangePassword && selectedAccount && (
        <ChangePasswordModal
          userName={selectedAccount.userName}
          onSubmit={handleChangePassword}
          onClose={() => setShowChangePassword(false)}
          isSubmitting={isSubmitting}
        />
      )}

      {showAssignRole && selectedAccount && (
        <AssignRoleModal
          userName={selectedAccount.userName}
          userRoles={selectedAccount.roles || []}
          onSubmit={handleAssignRole}
          onClose={() => setShowAssignRole(false)}
          isSubmitting={isSubmitting}
        />
      )}
    </>
  );
}

export default function Accounts() {
  return (
    <ToastProvider>
      <AccountsContent />
    </ToastProvider>
  );
}
