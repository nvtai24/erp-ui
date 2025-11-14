import { useEffect, useState } from "react";
import { Contract } from "../../types/contract";

type Props = {
  fetchContracts: (page: number, pageSize: number) => Promise<{ data: Contract[]; totalItems: number }>;
  onEdit: (contract: Contract) => void;
  onDelete: (id: number) => void;
  itemsPerPage: number;
};

export default function ContractList({ fetchContracts, onEdit, onDelete, itemsPerPage }: Props) {
  const [contracts, setContracts] = useState<Contract[]>([]);
  const [page, setPage] = useState(1);
  const [totalItems, setTotalItems] = useState(0);
  const totalPages = Math.ceil(totalItems / itemsPerPage);

  useEffect(() => {
    loadData(page);
  }, [page, fetchContracts]);

  const loadData = async (pageIndex: number) => {
    const result = await fetchContracts(pageIndex, itemsPerPage);
    setContracts(result.data);
    setTotalItems(result.totalItems);
  };

  return (
    <div className="overflow-x-auto bg-white shadow-md rounded-lg">
      <table className="min-w-full table-auto text-sm text-left">
        <thead className="bg-gray-100 text-gray-700">
          <tr>
            <th className="px-4 py-2 border-b">#</th>
            <th className="px-4 py-2 border-b">Type</th>
            <th className="px-4 py-2 border-b">Employee</th>
            <th className="px-4 py-2 border-b">Position</th>
            <th className="px-4 py-2 border-b">Salary</th>
            <th className="px-4 py-2 border-b">Start</th>
            <th className="px-4 py-2 border-b">End</th>
            <th className="px-4 py-2 border-b">Status</th>
            <th className="px-4 py-2 border-b text-right">Actions</th>
          </tr>
        </thead>
        <tbody>
          {contracts.length === 0 ? (
            <tr>
              <td colSpan={9} className="text-center py-4 text-gray-500">
                No contracts found
              </td>
            </tr>
          ) : (
            contracts.map((item, index) => (
              <tr key={item.contractId} className="hover:bg-gray-50">
                <td className="px-4 py-2 border-b">{(page - 1) * itemsPerPage + index + 1}</td>
                <td className="px-4 py-2 border-b">{item.contractType}</td>
                <td className="px-4 py-2 border-b">{item.employeeName || "—"}</td>
                <td className="px-4 py-2 border-b">{item.position}</td>
                <td className="px-4 py-2 border-b">{item.baseSalary.toLocaleString()} $</td>
                <td className="px-4 py-2 border-b">{item.startDate?.substring(0, 10)}</td>
                <td className="px-4 py-2 border-b">{item.endDate?.substring(0, 10)}</td>
                <td className="px-4 py-2 border-b">
                  <span
                    className={`px-2 py-1 text-xs rounded ${
                      item.status === "Active"
                        ? "bg-green-100 text-green-800"
                        : item.status === "Expired"
                        ? "bg-red-100 text-red-700"
                        : "bg-yellow-100 text-yellow-700"
                    }`}
                  >
                    {item.status}
                  </span>
                </td>
                <td className="px-4 py-2 border-b text-right">
                  <button
                    onClick={() => onEdit(item)}
                    className="text-blue-600 hover:text-blue-800 mr-3"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => onDelete(item.contractId)}
                    className="text-red-600 hover:text-red-800"
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex justify-between items-center p-4 border-t">
          <p className="text-sm text-gray-600">
            Page {page} of {totalPages}
          </p>
          <div className="flex gap-2">
            <button
              onClick={() => setPage((p) => Math.max(1, p - 1))}
              disabled={page === 1}
              className={`px-3 py-1 border rounded-md ${
                page === 1 ? "text-gray-400 border-gray-200" : "hover:bg-gray-100"
              }`}
            >
              Prev
            </button>
            <button
              onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
              disabled={page === totalPages}
              className={`px-3 py-1 border rounded-md ${
                page === totalPages ? "text-gray-400 border-gray-200" : "hover:bg-gray-100"
              }`}
            >
              Next
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
