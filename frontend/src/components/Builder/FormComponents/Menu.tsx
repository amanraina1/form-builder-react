import { useDraggable } from "@dnd-kit/core";
import { FIELD_CATALOG, type CatalogItem } from "../../../lib/fieldRegistry";

interface PaletteItemProps {
  item: CatalogItem;
}

function PaletteItem({ item }: PaletteItemProps) {
  const { attributes, listeners, setNodeRef, isDragging } = useDraggable({
    id: `palette-${item.dataType}`,
    data: { source: "palette", dataType: item.dataType },
  });

  return (
    <div
      ref={setNodeRef}
      {...attributes}
      style={{ opacity: isDragging ? 0.5 : 1 }}
      className="flex items-center justify-between my-3 border border-dashed rounded-lg py-2 px-4 cursor-default select-none hover:text-indigo-600 bg-white"
    >
      <div className="flex gap-3 items-center">
        <i className={`text-xs ${item.icon}`}></i>
        <span className="text-xs">{item.label}</span>
      </div>

      <div
        {...attributes}
        {...listeners}
        className="text-gray-300 hover:text-gray-600 cursor-grab active:cursor-grabbing flex justify-center"
        onClick={(e) => e.stopPropagation()}
        aria-label="Drag to reorder"
      >
        <i className="fas fa-grip-vertical"></i>
      </div>
    </div>
  );
}

interface Props {
  className?: string;
}

export default function Menu({ className = "" }: Props) {
  return (
    <div className={`bg-slate-50 p-4 rounded-lg max-h-max ${className}`}>
      <header className="mb-3">
        <p className="font-bold">Add fields</p>
      </header>
      {FIELD_CATALOG.map((item) => (
        <PaletteItem key={item.dataType} item={item} />
      ))}
    </div>
  );
}
