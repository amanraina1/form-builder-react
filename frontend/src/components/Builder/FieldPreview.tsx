import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { useBuilderStore } from "../../stores/builder";
import { getMeta } from "../../lib/fieldRegistry";
import type { FormField } from "../../types";

interface Props {
  field: FormField;
  isOverlay?: boolean;
}

const inputClass =
  "block w-full rounded-md py-1.5 px-2 text-base text-gray-900 outline-1 -outline-offset-1 outline-gray-300 placeholder:text-gray-400 sm:text-sm/6 bg-gray-100/70";

export default function FieldPreview({ field, isOverlay = false }: Props) {
  const activeField = useBuilderStore((s) => s.activeField);
  const setActiveField = useBuilderStore((s) => s.setActiveField);
  const removeField = useBuilderStore((s) => s.removeField);

  const meta = getMeta(field.dataType);
  const isActive = activeField?.id === field.id;

  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({
    id: `field-${field.id}`,
    data: { source: "canvas", fieldId: field.id },
    disabled: isOverlay,
  });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging && !isOverlay ? 0.4 : 1,
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      onClick={() => setActiveField(field)}
      className={`grid grid-cols-10 items-start gap-2 p-2 my-2 bg-white rounded-xl ${
        isActive ? "shadow outline outline-blue-500" : ""
      } ${isOverlay ? "shadow-2xl cursor-grabbing" : "cursor-pointer"}`}
      role="group"
      aria-label={field.label}
    >
      <div
        {...attributes}
        {...listeners}
        className={`${isOverlay ? "cursor-grabbing" : "cursor-grab active:cursor-grabbing"} col-span-1 self-center text-gray-300 hover:text-gray-600 flex justify-center`}
        onClick={(e) => e.stopPropagation()}
        aria-label="Drag to reorder"
      >
        <i className="fas fa-grip-vertical"></i>
      </div>

      <label
        htmlFor={field.name}
        className="col-span-2 self-center text-sm font-medium text-gray-900"
      >
        {field.label}
        {field.isRequired && <span className="text-red-500">*</span>}
      </label>

      <div className="col-span-6 self-center">
        {meta?.preview === "input" && (
          <input
            type={meta.inputType}
            id={field.name}
            placeholder={field.placeholder}
            disabled
            className={inputClass}
          />
        )}
        {meta?.preview === "textarea" && (
          <textarea
            id={field.name}
            placeholder={field.placeholder}
            disabled
            rows={2}
            className={inputClass}
          />
        )}
        {meta?.preview === "select" && (
          <select
            id={field.name}
            multiple={meta.multiple}
            disabled
            className={inputClass}
          >
            <option disabled value="">
              {field.placeholder || meta.defaultPlaceholder}
            </option>
            {(field.options || []).map((opt) => (
              <option key={opt.id} value={opt.value}>
                {opt.label}
              </option>
            ))}
          </select>
        )}
        {meta?.preview === "options" && (
          <div className="space-y-1">
            {(field.options || []).map((opt) => (
              <div key={opt.id} className="flex items-center gap-2">
                <input
                  type={meta.optionInputType}
                  name={field.name}
                  disabled
                  className="cursor-not-allowed"
                />
                <span className="text-sm text-gray-700">{opt.label}</span>
              </div>
            ))}
          </div>
        )}

        {field.helpText && (
          <small className="block mt-1 text-gray-500">
            <i className="fas fa-circle-info"></i> {field.helpText}
          </small>
        )}
      </div>

      <button
        type="button"
        onClick={(e) => {
          e.stopPropagation();
          removeField(field.id);
        }}
        aria-label={`Remove ${field.label}`}
        className="col-span-1 justify-self-end self-center h-7 w-7 rounded-lg text-red-500 border border-red-200 hover:bg-red-100 cursor-pointer"
      >
        <i className="fas fa-trash text-xs"></i>
      </button>
    </div>
  );
}
