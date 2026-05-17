import SimpleFieldSettings from "./SimpleFieldSettings";
import type { FormField } from "../../../../types";

interface Props {
  activeField: FormField | null;
  className?: string;
}

export default function FieldSettings({ activeField, className = "" }: Props) {
  return (
    <div className={`field-settings-card bg-slate-50 px-4 py-2 max-h-max rounded-lg ${className}`}>
      <header className="mb-2">
        <p className="font-bold">Field Settings</p>
      </header>
      <div className="field-settings-body">
        <SimpleFieldSettings activeField={activeField} />
      </div>
    </div>
  );
}
