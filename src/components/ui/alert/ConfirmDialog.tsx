import Swal from "sweetalert2";

export interface ConfirmDialogOptions {
  title?: string;
  text?: string;
  confirmText?: string;
  cancelText?: string;
  width?: string;
  confirmColor?: string;
}

export async function confirmDialog({
  title = "Confirm Action",
  text = "Are you sure you want to perform this action?",
  confirmText = "Confirm",
  cancelText = "Cancel",
  width = "450px",
  confirmColor = "red",
}: ConfirmDialogOptions) {
  const colorMap: Record<string, string> = {
    red: "bg-red-500 hover:bg-red-600 focus:ring-red-300",
    blue: "bg-blue-500 hover:bg-blue-600 focus:ring-blue-300",
    green: "bg-green-500 hover:bg-green-600 focus:ring-green-300",
  };

  return await Swal.fire({
    title,
    text,
    icon: undefined,
    showCancelButton: true,
    confirmButtonText: confirmText,
    cancelButtonText: cancelText,
    reverseButtons: false,
    customClass: {
      popup: "rounded-lg shadow-md p-2 pb-3 min-h-[90px]",
      title: "text-[12px] font-semibold text-gray-700 mb-0.5",
      htmlContainer: "text-gray-600 text-[11px] mb-3 leading-tight",
      actions: "flex justify-end gap-2 mt-1 w-full",
      confirmButton: `text-white text-sm px-3 py-1 rounded-md font-medium min-w-[70px] ${colorMap[confirmColor]}`,
      cancelButton:
        "bg-gray-200 text-gray-700 text-sm px-3 py-1 rounded-md hover:bg-gray-300 focus:ring-2 focus:ring-gray-300 font-medium min-w-[70px]",
    },
    buttonsStyling: false,
    width,
  });
}

export async function confirmDelete(itemName = "") {
  return confirmDialog({
    title: `Delete ${itemName}`,
    text: `Are you sure you want to delete this ${itemName}?`,
    confirmText: "Delete",
    cancelText: "Cancel",
    confirmColor: "red",
  });
}