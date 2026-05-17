import { useDroppable } from "@dnd-kit/core";
import {
  SortableContext,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import FieldPreview from "../FieldPreview";
import type { FormField } from "../../../types";
import dragImg from "../../../assets/drag.png";

interface Props {
  fields: FormField[];
}

export default function Sections({ fields }: Props) {
  const { setNodeRef, isOver } = useDroppable({
    id: "canvas-droppable",
    data: { source: "canvas-root" },
  });

  return (
    <div
      ref={setNodeRef}
      className={`min-h-100 rounded-lg transition-colors ${
        isOver ? "bg-blue-50/60 outline-2 outline-dashed outline-blue-300" : ""
      }`}
    >
      {fields.length === 0 ? (
        <div className="flex flex-col items-center border border-dashed rounded-lg opacity-50 px-2 py-4 text-center mt-4">
          <img src={dragImg} className="w-15 h-15" alt="" />
          <p>
            Drag an element from the left and drop it here. Drag rows to
            reorder.
          </p>
        </div>
      ) : (
        <SortableContext
          items={fields.map((f) => `field-${f.id}`)}
          strategy={verticalListSortingStrategy}
        >
          {fields.map((field) => (
            <FieldPreview key={field.id} field={field} />
          ))}
        </SortableContext>
      )}
    </div>
  );
}
