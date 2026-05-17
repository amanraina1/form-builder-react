import { useBuilderStore } from "../../../../stores/builder";
import TextField from "../../../FormFields/TextField";
import CheckboxField from "../../../FormFields/CheckboxField";
import {
  hasOptions,
  supportsValidation,
  getMeta,
  makeId,
} from "../../../../lib/fieldRegistry";
import type { FieldOption, FormField } from "../../../../types";

interface Props {
  activeField: FormField | null;
}

export default function SimpleFieldSettings({ activeField }: Props) {
  const updateActiveField = useBuilderStore((s) => s.updateActiveField);

  if (!activeField) {
    return <p className="text-gray-400">Select a field to edit its settings.</p>;
  }

  const meta = getMeta(activeField.dataType);
  const showOptions = hasOptions(activeField.dataType);
  const showValidation = supportsValidation(activeField.dataType);
  const showPlaceholder = !!meta && meta.preview !== "options";

  const onChange = (value: unknown, name: string) => {
    updateActiveField({ name, value });
  };

  const onValidationChange = (value: string, name: string) => {
    const current = activeField.validation || { min: null, max: null };
    const parsed = value === "" || value == null ? null : Number(value);
    const next =
      name === "min_validation"
        ? { ...current, min: parsed }
        : { ...current, max: parsed };
    onChange(next, "validation");
  };

  const addOption = () => {
    const options = activeField.options || [];
    const nextIndex = options.length + 1;
    onChange(
      [
        ...options,
        {
          id: makeId(),
          label: `Option ${nextIndex}`,
          value: `option_${nextIndex}`,
        },
      ],
      "options",
    );
  };

  const removeOption = (id: number) => {
    onChange(
      (activeField.options || []).filter((o) => o.id !== id),
      "options",
    );
  };

  const updateOption = (id: number, key: keyof FieldOption, value: string) => {
    onChange(
      (activeField.options || []).map((o) =>
        o.id === id ? { ...o, [key]: value } : o,
      ),
      "options",
    );
  };

  return (
    <div className="min-h-10">
      <TextField
        name="label"
        label="Label"
        placeholder="Enter Label"
        value={activeField.label}
        onChange={onChange}
      />

      <TextField
        name="name"
        label="Field name (key)"
        placeholder="e.g. first_name"
        description="Used as the data key. Letters, numbers and underscores only"
        value={activeField.name}
        onChange={onChange}
      />

      {showPlaceholder && (
        <TextField
          name="placeholder"
          label="Placeholder"
          placeholder="Placeholder"
          value={activeField.placeholder}
          onChange={onChange}
        />
      )}

      <TextField
        name="helpText"
        label="Help text"
        placeholder="e.g. Enter Name"
        value={activeField.helpText}
        onChange={onChange}
      />

      <CheckboxField
        name="isRequired"
        label="Required field"
        className="mb-2"
        value={activeField.isRequired}
        onChange={onChange}
      />

      {showValidation && (
        <>
          <TextField
            name="min_validation"
            label="Validation"
            type="number"
            placeholder="Min length"
            value={activeField.validation?.min ?? ""}
            onChange={onValidationChange}
          />
          <TextField
            name="max_validation"
            type="number"
            placeholder="Max length"
            value={activeField.validation?.max ?? ""}
            onChange={onValidationChange}
          />
        </>
      )}

      {showOptions && (
        <>
          <label className="block font-bold text-sm/6 text-gray-900">
            Options
          </label>

          {(activeField.options || []).map((option) => (
            <div
              key={option.id}
              className="grid grid-cols-5 items-center gap-3"
            >
              <TextField
                name={`label_${option.id}`}
                className="col-span-2"
                placeholder={option.label}
                value={option.label}
                onChange={(val) => updateOption(option.id, "label", val)}
              />
              <TextField
                name={`value_${option.id}`}
                className="col-span-2"
                placeholder={option.value}
                value={option.value}
                onChange={(val) => updateOption(option.id, "value", val)}
              />
              <button
                type="button"
                onClick={() => removeOption(option.id)}
                aria-label={`Remove option ${option.label}`}
                className="border mb-3 h-7 w-10 rounded-lg text-red-500 border-red-200 hover:bg-red-100 cursor-pointer"
              >
                x
              </button>
            </div>
          ))}

          <button
            type="button"
            onClick={addOption}
            className="bg-transparent text-xs px-2 py-1 hover:bg-gray-200 cursor-pointer text-gray-700 border border-gray-500 hover:border-transparent rounded-xl"
          >
            + Add option
          </button>
        </>
      )}
    </div>
  );
}
