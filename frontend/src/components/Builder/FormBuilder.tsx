import { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import axios from "axios";
import {
  DndContext,
  DragOverlay,
  PointerSensor,
  useSensor,
  useSensors,
  pointerWithin,
  type DragEndEvent,
  type DragStartEvent,
} from "@dnd-kit/core";
import { arrayMove } from "@dnd-kit/sortable";
import { restrictToWindowEdges } from "@dnd-kit/modifiers";

import Menu from "./FormComponents/Menu";
import Sections from "./FormComponents/Sections";
import FieldSettings from "./FormComponents/FieldSettings/FieldSettings";
import FieldPreview from "./FieldPreview";
import TextField from "../FormFields/TextField";
import Loader from "../Mini/Loader";
import Alert from "../Mini/Alert";
import { useBuilderStore } from "../../stores/builder";
import { errorHandler, successHandler } from "../../helpers/responseHandler";
import {
  createField,
  getMeta,
  type CatalogItem,
} from "../../lib/fieldRegistry";
import type { FieldType, FormField } from "../../types";

interface FormMeta {
  name: string;
  description: string;
  isActive: boolean;
}

interface DragState {
  type: "palette";
  catalogItem: CatalogItem;
}

interface CanvasDragState {
  type: "canvas";
  field: FormField;
}

type ActiveDrag = DragState | CanvasDragState | null;

export default function FormBuilder() {
  const navigate = useNavigate();
  const params = useParams<{ id?: string }>();
  const formId = params.id ?? null;

  const { formFields, activeField, setFields, addField, reorderFields, reset } =
    useBuilderStore();

  const [loading, setLoading] = useState(false);
  const [loaderMsg, setLoaderMsg] = useState(
    "Getting the form details for you...",
  );
  const [form, setForm] = useState<FormMeta>({
    name: "",
    description: "",
    isActive: true,
  });
  const [activeDrag, setActiveDrag] = useState<ActiveDrag>(null);

  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 5 } }),
  );

  const fetchForm = async () => {
    setLoaderMsg("Getting the form details for you...");
    setLoading(true);
    try {
      const res = await axios.get(`/api/forms/${formId}`);
      const { data } = res.data;
      setForm({
        name: data.name,
        description: data.description ?? "",
        isActive: data.isActive,
      });
      setFields(data.fields ?? []);
    } catch (e) {
      errorHandler(e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (formId) fetchForm();
    return () => reset();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [formId]);

  const onFormFieldChange = (value: string, name: string) => {
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const saveForm = async () => {
    setLoaderMsg(formId ? "Updating your form..." : "Saving the new form...");
    setLoading(true);
    try {
      const payload = { ...form, fields: formFields };
      const res = formId
        ? await axios.put(`/api/forms/${formId}`, payload)
        : await axios.post("/api/forms", payload);

      successHandler(res.data.message);

      if (!formId) {
        setTimeout(() => {
          reset();
          navigate("/");
        }, 1200);
      } else {
        reset();
        await fetchForm();
      }
    } catch (e) {
      errorHandler(e);
    } finally {
      setLoading(false);
    }
  };

  const handleDragStart = (event: DragStartEvent) => {
    const data = event.active.data.current as
      | { source: "palette"; dataType: FieldType }
      | { source: "canvas"; fieldId: number }
      | undefined;
    if (!data) return;
    if (data.source === "palette") {
      const meta = getMeta(data.dataType);
      if (!meta) return;
      setActiveDrag({
        type: "palette",
        catalogItem: {
          dataType: data.dataType,
          label: meta.label,
          icon: meta.icon,
        },
      });
    } else if (data.source === "canvas") {
      const field = formFields.find((f) => f.id === data.fieldId);
      if (field) setActiveDrag({ type: "canvas", field });
    }
  };

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    console.log(event);
    setActiveDrag(null);
    if (!over) return;

    const activeData = active.data.current as
      | { source: "palette"; dataType: FieldType }
      | { source: "canvas"; fieldId: number }
      | undefined;
    if (!activeData) return;

    if (activeData.source === "palette") {
      const dataType = activeData.dataType;
      let insertIndex = formFields.length;
      if (typeof over.id === "string" && over.id.startsWith("field-")) {
        const overFieldId = Number(over.id.slice("field-".length));
        const idx = formFields.findIndex((f) => f.id === overFieldId);
        if (idx !== -1) insertIndex = idx;
      }
      const field = createField(dataType);
      addField(field, insertIndex);
      return;
    }

    if (activeData.source === "canvas") {
      if (active.id === over.id) return;
      if (typeof over.id !== "string" || !over.id.startsWith("field-")) return;
      const fromIdx = formFields.findIndex(
        (f) => `field-${f.id}` === active.id,
      );
      const toIdx = formFields.findIndex((f) => `field-${f.id}` === over.id);
      if (fromIdx === -1 || toIdx === -1) return;
      reorderFields(arrayMove(formFields, fromIdx, toIdx));
    }
  };

  return (
    <>
      {loading && <Loader message={loaderMsg} />}
      <div className="main-wrapper mx-auto py-4 basic-details">
        <Alert />

        <header className="flex justify-between items-center">
          <div className="flex items-center">
            <Link
              to="/"
              className="bg-slate-50 hover:bg-slate-100 font-light py-2 px-5 mr-2 rounded-xl"
            >
              <i className="fas fa-arrow-left font-light"></i> Back
            </Link>
            <h1 className="font-bold text-2xl">
              {formId ? "Edit form" : "New form"}
            </h1>
          </div>

          <div className="flex items-center gap-4">
            <label className="flex items-center gap-2 font-bold cursor-pointer">
              <input
                type="checkbox"
                checked={form.isActive}
                onChange={(e) =>
                  setForm((p) => ({ ...p, isActive: e.target.checked }))
                }
              />
              Active
            </label>
            <button
              type="button"
              onClick={saveForm}
              disabled={loading}
              className="bg-blue-700 hover:bg-blue-900 text-white font-bold py-2 px-5 rounded-xl disabled:bg-blue-300 disabled:cursor-not-allowed cursor-pointer"
            >
              {formId ? "Update form" : "Save form"}
            </button>
          </div>
        </header>

        <div className="bg-white p-4 my-2 rounded-xl">
          <TextField
            name="name"
            label="Form name"
            value={form.name}
            onChange={onFormFieldChange}
          />
          <TextField
            type="textarea"
            name="description"
            label="Description (Optional)"
            value={form.description}
            onChange={onFormFieldChange}
          />
        </div>

        <DndContext
          sensors={sensors}
          collisionDetection={pointerWithin}
          modifiers={[restrictToWindowEdges]}
          onDragStart={handleDragStart}
          onDragEnd={handleDragEnd}
          onDragCancel={() => setActiveDrag(null)}
        >
          <div className="grid grid-cols-10 gap-10">
            <Menu className="sticky-top-menu col-span-2" />

            <div className="min-h-100 col-span-5 px-4 bg-slate-50 rounded-lg">
              <header className="mb-3 border-bottom border-b">
                <p className="font-bold px-4 py-2">Form fields</p>
              </header>
              <Sections fields={formFields} />
            </div>

            <FieldSettings
              activeField={activeField}
              className="sticky-top-menu col-span-3"
            />
          </div>

          <DragOverlay dropAnimation={null}>
            {activeDrag?.type === "palette" ? (
              <div className="flex items-center gap-3 cursor-grabbing border border-dashed rounded-lg py-2 px-4 bg-white shadow-lg">
                <i className={`text-xs ${activeDrag.catalogItem.icon}`}></i>
                <span className="text-xs">{activeDrag.catalogItem.label}</span>
              </div>
            ) : activeDrag?.type === "canvas" ? (
              <FieldPreview field={activeDrag.field} isOverlay />
            ) : null}
          </DragOverlay>
        </DndContext>
      </div>

      <style>{`
        .sticky-top-menu {
          position: sticky !important;
          top: 45px !important;
        }
      `}</style>
    </>
  );
}
