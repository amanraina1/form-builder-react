import { HttpError } from "./errors.js";

export function formatZodError(err) {
  const errors = {};
  for (const issue of err.issues) {
    const key = issue.path.join(".");
    if (!errors[key]) errors[key] = [];
    errors[key].push(issue.message);
  }
  return errors;
}

export function validate(schema, data) {
  const result = schema.safeParse(data);
  if (!result.success) {
    throw new HttpError(
      422,
      "Validation failed",
      formatZodError(result.error),
    );
  }
  return result.data;
}
