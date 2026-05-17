import { create } from "zustand";
import type { FormField } from "../types";

interface BuilderState {
  formFields: FormField[];
  activeField: FormField | null;
  setFields: (fields: FormField[]) => void;
  addField: (field: FormField, index?: number) => void;
  removeField: (id: number) => void;
  reorderFields: (fields: FormField[]) => void;
  reset: () => void;
  setActiveField: (field: FormField | null) => void;
  updateActiveField: (patch: { name: string; value: unknown }) => void;
}

export const useBuilderStore = create<BuilderState>((set, get) => ({
  formFields: [],
  activeField: null,

  setFields: (fields) => set({ formFields: fields }),

  addField: (field, index) =>
    set((state) => {
      const next = [...state.formFields];
      if (index === undefined || index >= next.length) {
        next.push(field);
      } else {
        next.splice(index, 0, field);
      }
      return { formFields: next, activeField: field };
    }),

  removeField: (id) =>
    set((state) => ({
      formFields: state.formFields.filter((f) => f.id !== id),
      activeField: state.activeField?.id === id ? null : state.activeField,
    })),

  reorderFields: (fields) => set({ formFields: fields }),

  reset: () => set({ formFields: [], activeField: null }),

  setActiveField: (field) => set({ activeField: field }),

  updateActiveField: ({ name, value }) => {
    const active = get().activeField;
    if (!active) return;
    const updated = { ...active, [name]: value } as FormField;
    set((state) => ({
      activeField: updated,
      formFields: state.formFields.map((f) =>
        f.id === updated.id ? updated : f,
      ),
    }));
  },
}));
