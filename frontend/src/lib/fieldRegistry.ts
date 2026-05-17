import type { FieldOption, FieldType, FormField } from "../types";

let _idCounter = Date.now();
export const makeId = (): number => ++_idCounter;

interface FieldMeta {
  label: string;
  icon: string;
  preview: "input" | "textarea" | "select" | "options";
  inputType?: string;
  multiple?: boolean;
  optionInputType?: "radio" | "checkbox";
  defaultPlaceholder: string;
  hasOptions: boolean;
  supportsValidation: boolean;
}

const defaultOptions = (): FieldOption[] => [
  { id: makeId(), label: "Option 1", value: "option_1" },
  { id: makeId(), label: "Option 2", value: "option_2" },
];

export const FIELD_REGISTRY: Record<FieldType, FieldMeta> = {
  text: {
    label: "Single Line",
    icon: "fa-solid fa-font",
    preview: "input",
    inputType: "text",
    defaultPlaceholder: "Single Line",
    hasOptions: false,
    supportsValidation: true,
  },
  textarea: {
    label: "Multi Line",
    icon: "fa-solid fa-paragraph",
    preview: "textarea",
    defaultPlaceholder: "Multi Line",
    hasOptions: false,
    supportsValidation: true,
  },
  number: {
    label: "Number",
    icon: "fa-solid fa-hashtag",
    preview: "input",
    inputType: "number",
    defaultPlaceholder: "Integer",
    hasOptions: false,
    supportsValidation: true,
  },
  email: {
    label: "Email",
    icon: "fa-solid fa-at",
    preview: "input",
    inputType: "email",
    defaultPlaceholder: "email@example.com",
    hasOptions: false,
    supportsValidation: false,
  },
  date: {
    label: "Date",
    icon: "fa-solid fa-calendar",
    preview: "input",
    inputType: "date",
    defaultPlaceholder: "",
    hasOptions: false,
    supportsValidation: false,
  },
  select: {
    label: "Select",
    icon: "fa-solid fa-angle-down",
    preview: "select",
    multiple: false,
    defaultPlaceholder: "Select option",
    hasOptions: true,
    supportsValidation: false,
  },
  multiselect: {
    label: "Multi Select",
    icon: "fa-solid fa-align-center",
    preview: "select",
    multiple: true,
    defaultPlaceholder: "Select options",
    hasOptions: true,
    supportsValidation: false,
  },
  radio: {
    label: "Radio",
    icon: "fa-solid fa-circle-dot",
    preview: "options",
    optionInputType: "radio",
    defaultPlaceholder: "",
    hasOptions: true,
    supportsValidation: false,
  },
  checkbox: {
    label: "Checkbox",
    icon: "fa-solid fa-square-check",
    preview: "options",
    optionInputType: "checkbox",
    defaultPlaceholder: "",
    hasOptions: true,
    supportsValidation: false,
  },
};

export const FIELD_TYPES = Object.keys(FIELD_REGISTRY) as FieldType[];

export interface CatalogItem {
  dataType: FieldType;
  label: string;
  icon: string;
}

export const FIELD_CATALOG: CatalogItem[] = FIELD_TYPES.map((dataType) => ({
  dataType,
  label: FIELD_REGISTRY[dataType].label,
  icon: FIELD_REGISTRY[dataType].icon,
}));

export const getMeta = (dataType: FieldType | undefined): FieldMeta | null =>
  dataType ? (FIELD_REGISTRY[dataType] ?? null) : null;

export const hasOptions = (dataType: FieldType | undefined): boolean =>
  !!getMeta(dataType)?.hasOptions;

export const supportsValidation = (dataType: FieldType | undefined): boolean =>
  !!getMeta(dataType)?.supportsValidation;

export const createField = (dataType: FieldType): FormField => {
  const meta = getMeta(dataType);
  if (!meta) throw new Error(`Unknown field type: ${dataType}`);

  const id = makeId();
  return {
    id,
    dataType,
    name: `${dataType}_${id.toString(36).slice(-4)}`,
    label: meta.label,
    placeholder: meta.defaultPlaceholder,
    helpText: "",
    isRequired: false,
    ...(meta.hasOptions ? { options: defaultOptions() } : {}),
    ...(meta.supportsValidation
      ? { validation: { min: null, max: null } }
      : {}),
  };
};
