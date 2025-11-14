// components/sale-staff/TransferStoreModal.tsx
import { useState, useEffect } from "react";
import { Store } from "../../types/store";

interface TransferStoreModalProps {
  isOpen: boolean;
  currentStoreId: number | null;
  stores: Store[];
  onClose: () => void;
  onTransfer: (storeId: number) => void;
}

export default function TransferStoreModal({
  isOpen,
  currentStoreId,
  stores,
  onClose,
  onTransfer,
}: TransferStoreModalProps) {
  const [storeId, setStoreId] = useState<number | "">("");
  const [error, setError] = useState<string>("");

  useEffect(() => {
    if (!isOpen) {
      setStoreId("");
      setError("");
    }
  }, [isOpen]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (!storeId) {
      setError("Please select a store");
      return;
    }

    if (storeId === currentStoreId) {
      setError("Please select a different store");
      return;
    }

    onTransfer(Number(storeId));
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto animate-in fade-in duration-200">
      <div className="flex min-h-screen items-center justify-center p-4">
        {/* Backdrop với blur */}
        <div
          className="fixed inset-0 bg-black/30 backdrop-blur-sm transition-all"
          onClick={onClose}
        />

        {/* Modal */}
        <div 
          className="relative bg-white dark:bg-gray-800 rounded-xl shadow-2xl max-w-md w-full mx-auto animate-in zoom-in-95 duration-200"
          onClick={(e) => e.stopPropagation()}
        >
        <div className="flex items-center justify-between p-5 border-b border-gray-200 dark:border-gray-700">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
            Transfer to Another Store
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
              Select New Store <span className="text-red-500">*</span>
            </label>
            <select
              value={storeId}
              onChange={(e) => setStoreId(Number(e.target.value))}
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              required
            >
              <option value="">-- Select Store --</option>
              {stores
                .filter((store) => store.storeId !== currentStoreId)
                .map((store) => (
                  <option key={store.storeId} value={store.storeId}>
                    {store.storeName} - {store.location}
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
    </div>
  );
}

