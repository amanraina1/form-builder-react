import type { FieldOption } from "../../types";

interface Props {
  name: string;
  label?: string;
  value: boolean | string[];
  onChange: (value: boolean | string[], name: string) => void;
  options?: FieldOption[];
  description?: string;
  required?: boolean;
  error?: string;
  className?: string;
}

export default function CheckboxField({
  name,
  label,
  value,
  onChange,
  options,
  description = "",
  required = false,
  error = "",
  className = "",
}: Props) {
  const isToggle = !options || options.length === 0;

  const toggleArrayItem = (current: string[], item: string): string[] =>
    current.includes(item)
      ? current.filter((v) => v !== item)
      : [...current, item];

  return (
    <div className={`mb-3 ${className}`}>
      {isToggle ? (
        <label className="flex items-center gap-2 cursor-pointer font-bold text-sm/6 text-gray-900">
          <input
            type="checkbox"
            name={name}
            id={name}
            checked={!!value}
            onChange={(e) => onChange(e.target.checked, name)}
          />
          {label}
          {required && <span className="text-red-500">*</span>}
        </label>
      ) : (
        <>
          <label htmlFor={name} className="block font-bold text-sm/6 text-gray-900">
            {label}
            {required && <span className="text-red-500">*</span>}
          </label>

          <div className="flex gap-3 mt-1 flex-wrap">
            {(options || []).map((option) => {
              const arr = Array.isArray(value) ? value : [];
              return (
                <label
                  key={option.value}
                  className="flex items-center gap-1 cursor-pointer"
                >
                  <input
                    type="checkbox"
                    name={name}
                    value={option.value}
                    checked={arr.includes(option.value)}
                    onChange={() =>
                      onChange(toggleArrayItem(arr, option.value), name)
                    }
                  />
                  <span className="text-sm text-gray-700">{option.label}</span>
                </label>
              );
            })}
          </div>
        </>
      )}

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
