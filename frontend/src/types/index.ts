export type FieldType =
  | "text"
  | "textarea"
  | "number"
  | "email"
  | "date"
  | "select"
  | "multiselect"
  | "radio"
  | "checkbox";

export interface FieldOption {
  id: number;
  label: string;
  value: string;
}

export interface FieldValidation {
  min: number | null;
  max: number | null;
}

export interface FormField {
  id: number;
  dataType: FieldType;
  name: string;
  label: string;
  placeholder: string;
  helpText: string;
  isRequired: boolean;
  options?: FieldOption[];
  validation?: FieldValidation;
}

export interface User {
  id: string | number;
  email: string;
  name?: string | null;
}

export interface FormSummary {
  id: string | number;
  name: string;
  description?: string | null;
  isActive: boolean;
  fieldsCount?: number;
  submissionsCount?: number;
}

export interface FormDetail {
  id: string | number;
  name: string;
  description: string | null;
  isActive: boolean;
  fields: FormField[];
}

export interface Submission {
  id: string | number;
  data: Record<string, unknown>;
  createdAt: string;
}

export type FieldValue = string | number | boolean | string[] | number[] | null;
