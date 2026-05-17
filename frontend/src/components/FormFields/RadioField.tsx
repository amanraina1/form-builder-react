import type { FieldOption } from "../../types";

interface Props {
  name: string;
  label?: string;
  value: string;
  onChange: (value: string, name: string) => void;
  options: FieldOption[];
  description?: string;
  required?: boolean;
  error?: string;
}

export default function RadioField({
  name,
  label,
  value,
  onChange,
  options,
  description = "",
  required = false,
  error = "",
}: Props) {
  return (
    <div className="mb-3">
      {label && (
        <label htmlFor={name} className="block font-bold text-sm/6 text-gray-900">
          {label}
          {required && <span className="text-red-500">*</span>}
        </label>
      )}

      <div className="flex gap-3 mt-1 flex-wrap">
        {options.map((option) => (
          <label
            key={option.value}
            className="flex items-center gap-1 cursor-pointer"
          >
            <input
              type="radio"
              name={name}
              value={option.value}
              checked={value === option.value}
              onChange={(e) => onChange(e.target.value, name)}
              className="text-base text-gray-900 focus:outline-none sm:text-sm/6"
            />
            <span className="text-sm text-gray-700">{option.label}</span>
          </label>
        ))}
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
