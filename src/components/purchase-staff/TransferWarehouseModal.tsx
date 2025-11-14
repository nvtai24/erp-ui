// components/purchase-staff/TransferWarehouseModal.tsx
import { useState, useEffect } from "react";
import { Warehouse } from "../../types/warehouse";

interface TransferWarehouseModalProps {
  isOpen: boolean;
  currentWarehouseId: number | null;
  warehouses: Warehouse[];
  onClose: () => void;
  onTransfer: (warehouseId: number) => void;
}

export default function TransferWarehouseModal({
  isOpen,
  currentWarehouseId,
  warehouses,
  onClose,
  onTransfer,
}: TransferWarehouseModalProps) {
  const [warehouseId, setWarehouseId] = useState<number | "">("");
  const [error, setError] = useState<string>("");

  useEffect(() => {
    if (!isOpen) {
      setWarehouseId("");
      setError("");
    }
  }, [isOpen]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (!warehouseId) {
      setError("Please select a warehouse");
      return;
    }

    if (warehouseId === currentWarehouseId) {
      setError("Please select a different warehouse");
      return;
    }

    onTransfer(Number(warehouseId));
  };

  if (!isOpen) return null;

  return (
    <div 
      className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 p-4"
      onClick={onClose}
    >
      <div 
        className="bg-white dark:bg-gray-800 rounded-lg shadow-xl max-w-md w-full mx-auto"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between p-5 border-b border-gray-200 dark:border-gray-700">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
            Transfer to Another Warehouse
          </h3>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors"
            aria-label="Close"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-5">
          {error && (
            <div className="mb-4 p-3 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded text-red-800 dark:text-red-300 text-sm">
              {error}
            </div>
          )}

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">
              Select New Warehouse <span className="text-red-500">*</span>
            </label>
            <select
              value={warehouseId}
              onChange={(e) => setWarehouseId(Number(e.target.value))}
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              required
            >
              <option value="">-- Select Warehouse --</option>
              {warehouses
                .filter((wh) => wh.warehouseId !== currentWarehouseId)
                .map((wh) => (
                  <option key={wh.warehouseId} value={wh.warehouseId}>
                    {wh.warehouseName} - {wh.location}
                  </option>
                ))}
            </select>
          </div>

          <div className="flex justify-end gap-3 mt-6">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-md hover:bg-gray-50 dark:hover:bg-gray-700 font-medium transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 font-medium transition-colors"
            >
              Transfer
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

