import { Controller, type Control } from "react-hook-form";
import TextField from "../FormFields/TextField";
import DateField from "../FormFields/DateField";
import SelectField from "../FormFields/SelectField";
import RadioField from "../FormFields/RadioField";
import CheckboxField from "../FormFields/CheckboxField";
import type { FormField } from "../../types";

interface Props {
  field: FormField;
  control: Control<Record<string, unknown>>;
  error?: string;
}

export default function FieldRenderer({ field, control, error }: Props) {
  const shared = {
    name: field.name,
    label: field.label,
    description: field.helpText,
    required: field.isRequired,
    placeholder: field.placeholder,
    error,
  };

  return (
    <Controller
      name={field.name}
      control={control}
      render={({ field: ctrl }) => {
        const onChange = (value: unknown) => ctrl.onChange(value);

        if (["text", "textarea", "number", "email"].includes(field.dataType)) {
          return (
            <TextField
              {...shared}
              type={field.dataType as "text" | "textarea" | "number" | "email"}
              value={(ctrl.value as string | number) ?? ""}
              onChange={onChange}
            />
          );
        }

        if (field.dataType === "date") {
          return (
            <DateField
              {...shared}
              value={(ctrl.value as string) ?? ""}
              onChange={onChange}
            />
          );
        }

        if (field.dataType === "select") {
          return (
            <SelectField
              {...shared}
              value={(ctrl.value as string) ?? ""}
              onChange={onChange}
              options={field.options || []}
            />
          );
        }

        if (field.dataType === "multiselect") {
          return (
            <SelectField
              {...shared}
              value={(ctrl.value as string[]) ?? []}
              onChange={onChange}
              options={field.options || []}
              multiple
            />
          );
        }

        if (field.dataType === "radio") {
          return (
            <RadioField
              {...shared}
              value={(ctrl.value as string) ?? ""}
              onChange={onChange}
              options={field.options || []}
            />
          );
        }

        if (field.dataType === "checkbox") {
          return (
            <CheckboxField
              {...shared}
              value={(ctrl.value as string[]) ?? []}
              onChange={onChange}
              options={field.options || []}
            />
          );
        }

        return <></>;
      }}
    />
  );
}
