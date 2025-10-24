import { Account } from "../../types/account";
import { UserCog, Trash2, Pencil, KeyRound } from "lucide-react";

interface AccountListProps {
  accounts: Account[];
  onEdit?: (account: Account) => void;
  onAssignRole?: (account: Account) => void;
  onChangePassword?: (account: Account) => void;
  onDelete?: (userName: string) => void;
}

export default function AccountList({
  accounts,
  onEdit,
  onAssignRole,
  onChangePassword,
  onDelete,
}: AccountListProps) {
  if (!accounts.length)
    return <div className="text-center py-10">No accounts found.</div>;

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow overflow-hidden">
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
          <thead className="bg-gray-50 dark:bg-gray-700">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                Username
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                Email
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                Phone
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                Roles
              </th>
              <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                Actions
              </th>
            </tr>
          </thead>

          <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
            {accounts.map((acc) => (
              <tr key={acc.id || acc.userName} className="hover:bg-gray-50 dark:hover:bg-gray-700">
                <td className="px-6 py-4 text-sm text-gray-900 dark:text-white">
                  {acc.userName}
                </td>
                <td className="px-6 py-4 text-sm text-gray-900 dark:text-white">
                  {acc.email || "—"}
                </td>
                <td className="px-6 py-4 text-sm text-gray-900 dark:text-white">
                  {acc.phoneNumber || "—"}
                </td>
                <td className="px-6 py-4 text-sm text-gray-700 dark:text-gray-300">
                  {acc.roles?.length ? acc.roles.join(", ") : "—"}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                  <div className="flex justify-end space-x-3">
                    <button
                      onClick={() => onEdit?.(acc)}
                      className="text-green-600 hover:text-green-800 dark:text-green-400 dark:hover:text-green-300"
                      title="Edit Account"
                    >
                      <Pencil size={18} />
                    </button>

                    <button
                      onClick={() => onAssignRole?.(acc)}
                      className="text-blue-600 hover:text-blue-900 dark:text-blue-400 dark:hover:text-blue-300"
                      title="Assign Role"
                    >
                      <UserCog size={18} />
                    </button>

                    <button
                      onClick={() => onChangePassword?.(acc)}
                      className="text-yellow-600 hover:text-yellow-800 dark:text-yellow-400 dark:hover:text-yellow-300"
                      title="Change Password"
                    >
                      <KeyRound size={18} />
                    </button>

                    <button
                      onClick={() => onDelete?.(acc.userName)}
                      className="text-red-600 hover:text-red-900 dark:text-red-400 dark:hover:text-red-300"
                      title="Delete Account"
                    >
                      <Trash2 size={18} />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
