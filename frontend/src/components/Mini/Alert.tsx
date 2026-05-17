import { useAlertStore } from "../../stores/alert";

export default function Alert() {
  const { message, type, dismiss } = useAlertStore();
  const visible = type !== "" && message !== "";

  const bgClass = type === "success" ? "bg-green-200/50" : "bg-red-200/50";
  const iconClass =
    type === "success" ? "fas fa-check-circle" : "fas fa-warning";

  return (
    <div
      className={`alert-container mb-2 ${visible ? "visible" : "invisible"}`}
    >
      <div className={`alert rounded-lg ${bgClass}`} role="alert">
        <div className="flex items-center justify-between px-2 py-2">
          <div className="flex items-center gap-2 alert-message">
            <i className={iconClass}></i>
            <p>{message}</p>
          </div>
          <button
            type="button"
            onClick={dismiss}
            aria-label="Dismiss alert"
            className="cursor-pointer"
          >
            <i className="fas fa-x text-gray-500 hover:text-gray-900 text-sm"></i>
          </button>
        </div>
      </div>
    </div>
  );
}
