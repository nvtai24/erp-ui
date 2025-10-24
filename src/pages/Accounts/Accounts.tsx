import { useState, useEffect } from "react";
import PageMeta from "../../components/common/PageMeta";
import AccountList from "../../components/account/AccountList";
import AccountForm from "../../components/account/AccountForm";
import ChangePasswordModal from "../../components/account/ChangePasswordModal";
import accountService from "../../services/accountService";
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
  const [accounts, setAccounts] = useState<Account[]>([]);
  const [showForm, setShowForm] = useState(false);
  const [editingAccount, setEditingAccount] = useState<Account | null>(null);
  const [showChangePassword, setShowChangePassword] = useState(false);
  const [selectedAccount, setSelectedAccount] = useState<Account | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showAssignRole, setShowAssignRole] = useState(false);
  const { addToast } = useToast();

  const fetchAccounts = async () => {
    try {
      const res = await accountService.getAccountsWithRoles();
      if (res.success) {
        setAccounts(res.data || []);
      } else {
        addToast({ type: "error", message: res.message });
      }
    } catch {
      addToast({ type: "error", message: "Failed to load accounts" });
    }
  };

  useEffect(() => {
    fetchAccounts();
  }, []);

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
      // Gọi API delete
      const res = await accountService.deleteAccount(userName);
      if (res.success) {
        addToast({ type: "success", message: `Deleted ${userName}` });
        fetchAccounts(); // refresh danh sách
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
    setIsSubmitting(true);
    try {
      if (editingAccount) {
        // Update account
        const updateData: UpdateAccountRequest = {
          userName: editingAccount.userName,
          email: data.email,
          phoneNumber: data.phoneNumber,
        };
        const res = await accountService.updateAccount(updateData);
        if (res.success) {
          addToast({ type: "success", message: "Account updated!" });
          setShowForm(false);
          fetchAccounts();
        } else {
          addToast({ type: "error", message: res.message });
        }
      } else {
        // Create account via register
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
          fetchAccounts();
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
      const res = await accountService.assignRole(data);
      if (res.success) {
        addToast({ type: "success", message: "Roles assigned successfully!" });
        setShowAssignRole(false);
        fetchAccounts();
      } else {
        addToast({ type: "error", message: res.message });
      }
    } catch {
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

      <div className="mx-auto max-w-6xl mt-6">
        <div className="sm:flex sm:items-center sm:justify-between mb-6">
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
            Account Management
          </h1>
          <button
            onClick={handleAdd}
            className="mt-4 sm:mt-0 sm:ml-16 inline-flex items-center justify-center rounded-md border border-transparent bg-blue-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-blue-700"
          >
            Add Account
          </button>
        </div>

        <AccountList
          accounts={accounts}
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
          userRoles={selectedAccount.roles || []} // tick sẵn những role user đã có
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
