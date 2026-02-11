/**
 * FormDateInput Component
 * Date input field for forms
 */

interface FormDateInputProps {
  label: string;
  id: string;
  name: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

export function FormDateInput({ label, id, name, value, onChange }: FormDateInputProps) {
  return (
    <div className="space-y-2">
      <label
        className="text-sm font-medium text-text-light dark:text-text-dark"
        htmlFor={id}
      >
        {label}
      </label>
      <input
        className="w-full bg-subtle-light dark:bg-subtle-dark border-none rounded-lg h-14 px-4 text-text-light dark:text-text-dark placeholder-placeholder-light dark:placeholder-placeholder-dark focus:ring-2 focus:ring-primary focus:outline-none [color-scheme:light] dark:[color-scheme:dark]"
        id={id}
        name={name}
        type="date"
        value={value}
        onChange={onChange}
      />
    </div>
  );
}
