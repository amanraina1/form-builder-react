import type { ChangeEvent } from "react";
import type { FieldOption } from "../../types";

interface Props {
  name: string;
  label?: string;
  value: string | string[];
  onChange: (value: string | string[], name: string) => void;
  options: FieldOption[];
  description?: string;
  multiple?: boolean;
  required?: boolean;
  error?: string;
  placeholder?: string;
}

export default function SelectField({
  name,
  label,
  value,
  onChange,
  options,
  description = "",
  multiple = false,
  required = false,
  error = "",
}: Props) {
  const handle = (e: ChangeEvent<HTMLSelectElement>) => {
    if (multiple) {
      const selected = Array.from(e.target.selectedOptions).map((o) => o.value);
      onChange(selected, name);
    } else {
      onChange(e.target.value, name);
    }
  };

  const outlineClass = error ? "outline-red-500" : "outline-gray-300";
  const selectValue = multiple
    ? Array.isArray(value)
      ? value
      : []
    : (value as string) ?? "";

  return (
    <div className="mb-3">
      {label && (
        <label htmlFor={name} className="block font-bold text-sm/6 text-gray-900">
          {label}
          {required && <span className="text-red-500">*</span>}
        </label>
      )}

      <div
        className={`rounded-md bg-white pl-3 outline-1 -outline-offset-1 has-[select:focus-within]:outline-2 has-[select:focus-within]:-outline-offset-2 has-[select:focus-within]:outline-indigo-600 ${outlineClass}`}
      >
        <select
          name={name}
          id={name}
          multiple={multiple}
          value={selectValue}
          onChange={handle}
          className="py-1.5 pr-3 pl-1 w-full text-gray-900 placeholder:text-gray-400 focus:outline-none sm:text-sm/6"
        >
          {!multiple && (
            <option disabled value="">
              Select option
            </option>
          )}
          {options.map((opt) => (
            <option key={opt.value} value={opt.value}>
              {opt.label}
            </option>
          ))}
        </select>
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
