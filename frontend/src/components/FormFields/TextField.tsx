import type { ChangeEvent } from "react";

interface Props {
  name: string;
  label?: string;
  type?: "text" | "textarea" | "number" | "email";
  value: string | number;
  onChange: (value: string, name: string) => void;
  placeholder?: string;
  description?: string;
  required?: boolean;
  error?: string;
  className?: string;
}

export default function TextField({
  name,
  label,
  type = "text",
  value,
  onChange,
  placeholder = "",
  description = "",
  required = false,
  error = "",
  className = "",
}: Props) {
  const handle = (
    e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => {
    onChange(e.target.value, name);
  };

  const outlineClass = error ? "outline-red-500" : "outline-gray-300";

  return (
    <div className={`mb-3 ${className}`}>
      {label && (
        <label htmlFor={name} className="block font-bold text-sm/6 text-gray-900">
          {label}
          {required && <span className="text-red-500">*</span>}
        </label>
      )}

      <div
        className={`flex items-center rounded-md bg-white pl-3 outline-1 -outline-offset-1 has-[input:focus-within]:outline-2 has-[input:focus-within]:-outline-offset-2 has-[input:focus-within]:outline-indigo-600 has-[textarea:focus-within]:outline-2 has-[textarea:focus-within]:-outline-offset-2 has-[textarea:focus-within]:outline-indigo-600 ${outlineClass}`}
      >
        {type === "textarea" ? (
          <textarea
            name={name}
            id={name}
            value={value ?? ""}
            onChange={handle}
            placeholder={placeholder}
            className="block min-w-0 grow py-1.5 pr-3 pl-1 text-base text-gray-900 placeholder:text-gray-400 focus:outline-none sm:text-sm/6"
          />
        ) : (
          <input
            type={type}
            name={name}
            id={name}
            value={value ?? ""}
            onChange={handle}
            placeholder={placeholder}
            className="block min-w-0 grow py-1.5 pr-3 pl-1 text-base text-gray-900 placeholder:text-gray-400 focus:outline-none sm:text-sm/6"
          />
        )}
      </div>

      {error ? (
        <small className="text-red-600 text-sm" role="alert">
          <i className="fas fa-circle-exclamation"></i> {error}
        </small>
      ) : description ? (
        <small className="text-gray-500">
          <i className="fas fa-circle-info"></i> {description}
        </small>
      ) : null}
    </div>
  );
}
