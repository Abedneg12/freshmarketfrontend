import React from "react";

interface ConfirmModalProps {
  show: boolean;
  title?: string;
  description?: string;
  loading?: boolean;
  onClose: () => void;
  onConfirm: () => void;
  confirmLabel?: string;
  cancelLabel?: string;
}

export default function ConfirmModal({
  show,
  title,
  description,
  loading,
  onClose,
  onConfirm,
  confirmLabel = "Konfirmasi",
  cancelLabel = "Batal",
}: ConfirmModalProps) {
  if (!show) return null;
  return (
    <div className="fixed inset-0 bg-black/40 z-50 flex items-center justify-center">
      <div className="bg-white rounded-xl shadow-lg w-full max-w-xs p-6 animate-in fade-in">
        <h2 className="text-lg font-bold mb-2">{title}</h2>
        {description && <p className="text-gray-600 mb-4">{description}</p>}
        <div className="flex justify-end gap-2">
          <button
            onClick={onClose}
            disabled={loading}
            className="px-4 py-1.5 rounded-md text-gray-700 bg-gray-100 hover:bg-gray-200 font-medium"
          >{cancelLabel}</button>
          <button
            onClick={onConfirm}
            disabled={loading}
            className="px-4 py-1.5 rounded-md text-white bg-green-600 hover:bg-green-700 font-medium"
          >
            {loading ? "Memproses..." : confirmLabel}
          </button>
        </div>
      </div>
    </div>
  );
}
