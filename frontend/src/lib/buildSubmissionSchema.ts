import { z, type ZodTypeAny } from "zod";
import type { FormField } from "../types";

const hasNumber = (v: unknown): v is number =>
  typeof v === "number" && !Number.isNaN(v);

export function buildSubmissionSchema(fields: FormField[]) {
  const shape: Record<string, ZodTypeAny> = {};

  for (const field of fields) {
    let s: ZodTypeAny;
    const min = field.validation?.min ?? null;
    const max = field.validation?.max ?? null;

    switch (field.dataType) {
      case "email":
        s = z.string().email("Must be a valid email");
        break;

      case "number": {
        let n = z.coerce.number({ message: "Must be a number" });
        if (hasNumber(min)) n = n.min(min, `Must be at least ${min}`);
        if (hasNumber(max)) n = n.max(max, `Must be at most ${max}`);
        s = n;
        break;
      }

      case "date":
        s = z
          .string()
          .refine((v) => !Number.isNaN(Date.parse(v)), "Must be a valid date");
        break;

      case "select":
      case "radio": {
        const values = (field.options ?? []).map((o) => o.value);
        s = values.length
          ? z
              .string()
              .refine(
                (v) => values.includes(v),
                `Must be one of: ${values.join(", ")}`,
              )
          : z.string();
        break;
      }

      case "multiselect":
      case "checkbox": {
        const values = (field.options ?? []).map((o) => o.value);
        s = z.array(
          values.length
            ? z.string().refine((v) => values.includes(v), "Invalid option")
            : z.string(),
        );
        break;
      }

      case "textarea":
      case "text":
      default: {
        let t = z.string();
        if (hasNumber(min))
          t = t.min(min, `Must be at least ${min} characters`);
        if (hasNumber(max)) t = t.max(max, `Must be at most ${max} characters`);
        s = t;
        break;
      }
    }

    if (!field.isRequired) {
      s = s.nullable().optional();
    } else if (
      field.dataType === "multiselect" ||
      field.dataType === "checkbox"
    ) {
      s = s.refine(
        (arr) => Array.isArray(arr) && arr.length > 0,
        `${field.label} requires at least one option`,
      );
    } else {
      s = s.refine((v) => v !== "" && v != null, `${field.label} is required`);
    }

    shape[field.name] = s;
  }

  return z.object(shape);
}

export const buildDefaultValues = (
  fields: FormField[],
): Record<string, unknown> => {
  const out: Record<string, unknown> = {};
  for (const f of fields) {
    if (f.dataType === "multiselect" || f.dataType === "checkbox") {
      out[f.name] = [];
    } else {
      out[f.name] = "";
    }
  }
  return out;
};
