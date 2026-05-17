import { createPortal } from "react-dom";

interface Props {
  show: boolean;
  title?: string;
  message?: string;
  confirmText?: string;
  cancelText?: string;
  variant?: "danger" | "primary";
  onConfirm: () => void;
  onCancel: () => void;
}

export default function ConfirmModal({
  show,
  title = "Are you sure?",
  message = "",
  confirmText = "Confirm",
  cancelText = "Cancel",
  variant = "danger",
  onConfirm,
  onCancel,
}: Props) {
  if (!show) return null;

  const confirmBg =
    variant === "danger"
      ? "bg-red-600 hover:bg-red-700"
      : "bg-blue-700 hover:bg-blue-900";

  return createPortal(
    <div
      className="modal-backdrop"
      onClick={(e) => {
        if (e.target === e.currentTarget) onCancel();
      }}
      role="dialog"
      aria-modal="true"
    >
      <div className="modal-card">
        <h3 className="font-bold text-lg mb-2">{title}</h3>
        <p className="text-gray-600 mb-4">{message}</p>
        <div className="flex justify-end gap-2">
          <button
            type="button"
            onClick={onCancel}
            className="bg-transparent text-gray-700 border border-gray-400 hover:bg-gray-100 font-semibold py-1 px-3 rounded-md cursor-pointer"
          >
            {cancelText}
          </button>
          <button
            type="button"
            onClick={onConfirm}
            className={`font-semibold py-1 px-3 rounded-md cursor-pointer text-white ${confirmBg}`}
          >
            {confirmText}
          </button>
        </div>
      </div>
      <style>{`
        .modal-backdrop {
          position: fixed;
          inset: 0;
          background: rgba(15, 23, 42, 0.5);
          display: flex;
          align-items: center;
          justify-content: center;
          z-index: 2000;
          backdrop-filter: blur(2px);
        }
        .modal-card {
          background: white;
          padding: 1.5rem;
          border-radius: 14px;
          width: min(420px, 90vw);
          box-shadow: 0 20px 50px rgba(0, 0, 0, 0.18);
        }
      `}</style>
    </div>,
    document.body,
  );
}
