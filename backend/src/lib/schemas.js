import { z } from "zod";

export const ALLOWED_TYPES = [
  "text",
  "textarea",
  "email",
  "number",
  "date",
  "select",
  "multiselect",
  "radio",
  "checkbox",
];

export const HAS_OPTIONS = ["select", "multiselect", "radio", "checkbox"];

const optionsSchema = z.object({
  label: z.string().min(1).max(50),
  value: z.string().min(1).max(50),
});

const validationSchema = z
  .object({
    min: z.number().nullable().optional(),
    max: z.number().nullable().optional(),
  })
  .nullable()
  .optional();

const fieldSchema = z
  .object({
    label: z.string().min(1, "Label is required").max(50),
    name: z
      .string()
      .min(1, "Name is required")
      .max(50)
      .regex(
        /^[a-zA-Z_][a-zA-Z0-9_]*$/,
        "Name must start with a letter or underscore and contain only letters, numbers and underscores",
      ),
    dataType: z.enum(ALLOWED_TYPES, "Unknown field type"),
    helpText: z.string().max(500).nullable().optional(),
    placeholder: z.string().max(150).nullable().optional(),
    isRequired: z.boolean().optional().default(false),
    options: z.array(optionsSchema).nullable().optional(),
    validation: validationSchema,
  })
  .superRefine((field, ctx) => {
    if (HAS_OPTIONS.includes(field.dataType)) {
      if (!field.options || field.options.length === 0) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: `${field.dataType} fields require at least one option`,
          path: ["options"],
        });
      }
    }
  });

export const formSchema = z
  .object({
    name: z.string().min(1, "Form name is required").max(50),
    description: z.string().max(1000).nullable().optional(),
    isActive: z.boolean().optional().default(true),
    fields: z.array(fieldSchema).optional().default([]),
  })
  .superRefine((form, ctx) => {
    const seen = new Set();
    form.fields.forEach((f, idx) => {
      if (seen.has(f.name)) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: `Duplicate field name "${f.name}"`,
          path: ["fields", idx, "name"],
        });
      }
      seen.add(f.name);
    });
  });

const hasNumber = (v) => typeof v === "number" && !Number.isNaN(v);

export function buildSubmissionSchema(fields) {
  const shape = {};

  for (const field of fields) {
    let s;
    const min = field.validation?.min;
    const max = field.validation?.max;

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
        if (hasNumber(min)) t = t.min(min, `Must be at least ${min} characters`);
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

  return z.object({ data: z.object(shape) });
}
